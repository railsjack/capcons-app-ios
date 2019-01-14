// custom select module
jcf.addModule({
	name:'selectmultiple',
	selector:'select[size], select[multiple]',
	defaultOptions: {
		maxVisibleOptions: 10,
		disabledClass:'select-disabled',
		focusClass:'select-multiple-focus',
		wrapperClass:'select-multiple-area',
		scrollClass:'select-multiple-scroll',
		itemSelectedClass:'item-selected',
		listSelector: 'div.multiple-list',
		optionTextSelector: 'span',
		optionStructure: '<a><span></span></a>',
		selectStructure:'<div class="select-multiple-wrapper"><div class="wtop"><div class="tl"></div><div class="tr"></div></div><div class="cwrap"><div class="chold"><div class="multiple-list"></div></div></div><div class="wbot"><div class="bl"></div><div class="br"></div></div></div>'
	},
	checkElement: function(el){
		return (el.size || el.multiple);
	},
	setupWrapper: function(){
		jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
		this.fakeElement.innerHTML = this.options.selectStructure;
		this.fakeElement.style.width = this.realElement.offsetWidth + 'px';
		this.realElement.size = this.realElement.options.length;
		this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement.nextSibling);
		this.rebuildOptions();
		this.refreshState();
		this.addEvents();
		this.onControlReady(this);
	},
	rebuildOptions: function(){
		// build options list
		this.optionsHolder = jcf.lib.queryBySelector(this.options.listSelector, this.fakeElement)[0];
		this.optionsHolder.innerHTML = '';
		this.currentHolder = this.optionsHolder;
		this.fakeOptions = [];
		for(var i = 0; i < this.realElement.children.length; i++) {
			var curItem = this.realElement.children[i];
			var curType = curItem.tagName.toLowerCase();
			if(curType === 'option' && (!jcf.lib.prevSibling(curItem) || jcf.lib.prevSibling(curItem).tagName.toLowerCase() !== 'option')) {
				this.currentHolder = document.createElement('ul');
				this.optionsHolder.appendChild(this.currentHolder);
			} else if(curType === 'optgroup') {
				this.currentHolder = this.optionsHolder;
			}
			this.currentHolder.appendChild(this.buildElement(curItem));
		}
		
		// add scrollbars on big selects
		if(this.realElement.options.length > this.options.maxVisibleOptions) {
			jcf.lib.addClass(this.fakeElement, this.options.scrollClass);
			this.optionsHolder.style.height = (this.getFakeActiveOption().offsetHeight * this.options.maxVisibleOptions) + 'px';
			this.realElement.style.height = this.optionsHolder.style.height;
			this.optionsHolder.style.overflow = 'auto';
			this.optionsHolder.style.overflowX = 'hidden';
		}
	},
	buildElement: function(item) {
		// handle <option>
		if(item.tagName.toLowerCase() === 'option') {
			return this.createOption(item);
		}
		// handle <optgroup>
		else {
			return this.createOptgroup(item);
		}
	},
	createOptgroup: function(optgroup) {
		var optHold = document.createElement('div');
		var optTitle = document.createElement('strong');
		var optList = document.createElement('ul');
		optHold.className = 'optgroup';
		optTitle.innerHTML = optgroup.getAttribute('label');
		optHold.appendChild(optTitle);
		optHold.appendChild(optList);
		for(var i = 0; i < optgroup.children.length; i++) {
			optList.appendChild(this.buildElement(optgroup.children[i]));
		}
		return optHold;
	},
	createOption: function(option, holder){
		var item = document.createElement('li'), link;
		item.innerHTML = this.options.optionStructure;
		link = jcf.lib.queryBySelector(this.options.optionTextSelector, item)[0];
		link.innerHTML = option.innerHTML;
		if(option.className) {
			link.className = option.className;
		}
		jcf.lib.event.add(item, 'click', function(e){
			this.onOptionClick(e, item);
		}, this);
		if(holder) {
			holder.appendChild(item);
		}
		this.fakeOptions.push(item);
		return item;
	},
	addEvents: function(){
		jcf.lib.event.add(this.realElement, 'keydown', this.onKeyDown, this);
		jcf.lib.event.add(this.realElement, 'click', this.refreshState, this);
		jcf.lib.event.add(this.realElement, 'change', this.refreshState, this);
	},
	onKeyDown: function(e) {
		if(!this.realElement.disabled && e.keyCode !== 16 && e.keyCode !== 17) { // do not scroll to item when holding CTRL or SHIFT
			this.lastDirection = (e.keyCode == 38 || e.keyCode == 37 ? -1 : e.keyCode == 40 || e.keyCode == 39 ? 1 : 0);
			setTimeout(jcf.lib.bind(function(){
				// opera multiple keyboard nav fix
				if(jcf.lib.browser.opera && this.realElement.multiple && !e.shiftKey) {
					if(this.lastDirection) {
						this.realElement.selectedIndex = this.getChangedSelectedIndex() + this.lastDirection;
					}
				}
				this.refreshState();
				this.scrollToItem();
			},this),10);
		}
	},
	onOptionClick: function(e, item) {
		if(!this.realElement.disabled) {
			var itemIndex = this.getItemIndex(item);
			if(this.realElement.multiple) {
				if(jcf.isTouchDevice) {
					// for touch devices toggle option
					this.realElement.options[itemIndex].selected = !this.realElement.options[itemIndex].selected;
				} else {
					if(!(e.metaKey || e.ctrlKey) && !e.shiftKey) {
						// set one selected index and clear selection
						this.realElement.selectedIndex = itemIndex;
					} else {
						if(e.metaKey || e.ctrlKey) {
							// if CTRL pressed - toggle selected option
							this.realElement.options[itemIndex].selected = !this.realElement.options[itemIndex].selected;
						} else if(e.shiftKey) {
							// if SHIFT pressed - update selection
							var selectedIndex = this.getChangedSelectedIndex();
							var startIndex = selectedIndex < itemIndex ? selectedIndex : itemIndex;
							var endIndex = selectedIndex < itemIndex ? itemIndex : selectedIndex;
							for(var i = 0; i < this.fakeOptions.length; i++) {
								this.realElement.options[i].selected = (i >= startIndex && i <= endIndex);
							}
						}
					}
				}
			} else {
				this.realElement.selectedIndex = itemIndex;
			}
		}
		this.refreshState();
		e.preventDefault();
	},
	scrollToItem: function(){
		// calc values
		var dropHeight = this.optionsHolder.offsetHeight;
		var dropScrollTop = this.optionsHolder.scrollTop;
		var curIndex = this.getChangedSelectedIndex();

		// Opera multiple keyboard nav fix
		if(typeof curIndex === 'undefined') {
			this.realElement.selectedIndex = curIndex = 0;
			this.refreshState();
		}

		// scroll list
		var selectedOption = this.fakeOptions[curIndex];
		var positionTop = this.getOptionRelativeOffset(selectedOption);
		if(positionTop + selectedOption.offsetHeight >= dropScrollTop + dropHeight) {
			// scroll down (always scroll to option)
			this.optionsHolder.scrollTop = positionTop - dropHeight + selectedOption.offsetHeight;
		} else if(positionTop < dropScrollTop) {
			// scroll up (handle optgroup caption if present)
			this.optionsHolder.scrollTop = this.getOptionRelativeOffset(this.isFirstOptionInGroup(curIndex) ? this.getOptionOptgroup(selectedOption) : selectedOption);
		}
	},
	isFirstOptionInGroup: function(ind) {
		var realOption = this.realElement.options[ind];
		return ind === 0 && realOption === realOption.parentNode.children[0] && realOption.parentNode.tagName.toLowerCase() === 'optgroup';
	},
	getOptionOptgroup: function(fakeEl) {
		return fakeEl.parentNode.parentNode;
	},
	getOptionRelativeOffset: function(fakeEl) {
		return jcf.lib.getOffset(fakeEl).top - jcf.lib.getOffset(this.optionsHolder).top + this.optionsHolder.scrollTop;
	},
	getChangedSelectedIndex: function() {
		// multiple changed select index
		if(this.realElement.multiple) {
			// handle first call
			if(typeof this.lastPrevInd === 'undefined') {
				this.retValue = this.lastCurInd = this.firstCurInd = this.realElement.selectedIndex;
			}
			this.lastPrevInd = this.lastCurInd; this.lastCurInd = this.getLastSelectedOptionIndex();
			this.firstPrevInd = this.firstCurInd; this.firstCurInd = this.getFirstSelectedOptionIndex();
			
			// handle multiple call
			if(this.lastPrevInd === this.lastCurInd && this.firstPrevInd === this.firstCurInd) {
				return this.retValue;
			}

			// handle index change
			if(this.lastDirection < 0) {
				if(this.firstPrevInd > this.firstCurInd) {
					this.retValue = this.firstCurInd;
				} else if(this.lastPrevInd >= this.lastCurInd) {
					this.retValue = this.lastCurInd;
				}
			} else if(this.lastDirection > 0) {
				if(this.firstPrevInd < this.firstCurInd) {
					this.retValue = this.firstCurInd;
				} else {
					this.retValue = this.lastCurInd;
				}
			} else {
				this.retValue = this.realElement.selectedIndex;
			}
			return this.retValue;
		}
		// simple select index
		return this.realElement.selectedIndex;
	},
	getFirstSelectedOptionIndex: function() {
		for(var i = 0; i < this.realElement.options.length; i++) {
			if(this.realElement.options[i].selected) return i;
		}
	},
	getLastSelectedOptionIndex: function() {
		for(var i = this.realElement.options.length-1; i >= 0; i--) {
			if(this.realElement.options[i].selected) return i;
		}
	},
	getItemIndex: function(item){
		for(var i = 0; i < this.fakeOptions.length; i++) {
			if(this.fakeOptions[i] === item) return i;
		}
	},
	getFakeActiveOption: function() {
		return this.fakeOptions[this.realElement.selectedIndex < 0 ? 0 : this.realElement.selectedIndex];
	},
	refreshState: function(){
		for(var i = 0; i < this.fakeOptions.length; i++) {
			if(this.realElement.options[i].selected) {
				jcf.lib.addClass(this.fakeOptions[i], this.options.itemSelectedClass);
			} else {
				jcf.lib.removeClass(this.fakeOptions[i], this.options.itemSelectedClass);
			}
		}
		if(arguments.length) {
			this.scrollToItem(); // if called from event - scroll to item
		}
		if(this.realElement.disabled) {
			jcf.lib.addClass(this.fakeElement, this.options.disabledClass);
			if(this.labelFor) {
				jcf.lib.addClass(this.labelFor, this.options.labelDisabledClass);
			}
		} else {
			jcf.lib.removeClass(this.fakeElement, this.options.disabledClass);
			if(this.labelFor) {
				jcf.lib.removeClass(this.labelFor, this.options.labelDisabledClass);
			}
		}
	}
});
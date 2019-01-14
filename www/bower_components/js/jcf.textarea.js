// custom textarea module
jcf.addModule({
	name:'textarea',
	selector: 'textarea',
	defaultOptions: {
		wrapperClass:'textarea-wrapper',
		focusClass:'textarea-wrapper-focus',
		cropMaskClass: 'scroll-cropper',
		txtStructure:'<div class="control-wrapper"><div class="ctop"><div class="cleft"></div><div class="cright"></div></div><div class="cmid"><div class="chold"></div></div><div class="cbot"><div class="cleft"></div><div class="cright"></div></div></div>',
		txtHolder: 'div.chold',
		refreshInterval: 100
	},
	setupWrapper: function(){
		jcf.lib.removeClass(this.realElement, jcf.baseOptions.hiddenClass);
		jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
		
		// create structure
		this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement);
		this.fakeElement.innerHTML = this.options.txtStructure;
		this.textareaHolder = jcf.lib.queryBySelector(this.options.txtHolder, this.fakeElement)[0];
		this.textareaHolder.appendChild(this.realElement);
		jcf.lib.enableTextSelection(this.fakeElement);
		
		// init object and events
		this.prepareElement();
		this.refreshState();
		this.addEvents();
		this.addCustomScroll();
	},
	prepareElement: function() {
		jcf.lib.setStyles(this.realElement, {
			resize:'none',
			overflow:'hidden',
			verticalAlign:'top',
			width: jcf.lib.getInnerWidth(this.realElement),
			height: jcf.lib.getInnerHeight(this.realElement)
		});
		jcf.lib.setStyles(this.textareaHolder, {
			width:this.realElement.offsetWidth
		});
	},
	addCustomScroll: function() {
		// call ready state, so scrollbars can attach here
		this.onControlReady(this);
		var origWidth = jcf.lib.getInnerWidth(this.realElement);
		var barWidth = jcf.lib.scrollSize.getWidth();
		
		// change text area size by scrollbar width
		jcf.lib.setStyles(this.realElement, {
			width: origWidth + barWidth,
			overflowX: 'hidden',
			overflowY: 'scroll',
			direction: 'ltr'
		});
		
		// create crop mask
		this.scrollCropper = jcf.lib.createElement('div',{
			'class': this.options.cropMaskClass,
			style: {
				width: origWidth,
				overflow: 'hidden'
			}
		});
		this.realElement.parentNode.insertBefore(this.scrollCropper, this.realElement);
		this.scrollCropper.appendChild(this.realElement);
	},
	addEvents: function(){
		this.delayedRefresh = jcf.lib.bind(this.delayedRefresh, this);
		jcf.lib.event.add(this.realElement, 'keydown', this.delayedRefresh);
		jcf.lib.event.add(this.realElement, 'keyup', this.delayedRefresh);
	},
	onFocus: function(e) {
		jcf.modules[this.name].superclass.onFocus.apply(this, arguments);
		clearInterval(this.refreshTimer);
		this.delayedRefresh();
		this.refreshTimer = setInterval(this.delayedRefresh, this.options.refreshInterval);
	},
	onBlur: function() {
		jcf.modules[this.name].superclass.onBlur.apply(this, arguments);
		clearInterval(this.refreshTimer);
	},
	delayedRefresh: function() {
		clearTimeout(this.delayTimer);
		this.delayTimer = setTimeout(jcf.lib.bind(this.refreshState, this),10);
	},
	refreshState: function() {
		if(this.scrollCropper) {
			this.scrollCropper.scrollTop = this.scrollCropper.scrollLeft = 0;
			this.scrollCropper.parentNode.scrollTop = 0;
		}
		// custom scrollbars will call this method before refreshing themself
	}
});
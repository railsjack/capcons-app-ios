'use strict';

angular.module('CCS-Safety')
  .controller('FooterCtrl', ['$scope', '$location', 'Sharedata',
    function ($scope, $location, Sharedata) {
      var hasFooter = false;
      $scope.hasFooter = function () {
        return hasFooter;
      };

      $scope.hasSelectedProject = function() {

         if(!Sharedata.get('project')){
          return 'disabled';
        }
      };
      $scope.hasprojectandcheklist = function() {
        

        try
        {
          // uploadPhoto("iVBORw0KGgoAAAANSUhEUgAAACUAAAAhCAYAAABeD2IVAAAFN0lEQVR4Xt2YaUwUZxjHFSxUCm3SStJIEARW7oBNQKhfyCKFVKUlJQEVaKMNbUqxCSDwgVIi8cIq1sYqsQlWqBy1Sq1cC3Is9yK4Qt3lkcNKI7dWLKd8oP/3LZOgzKzbsm3avskvy8zCzm+eeY53WTE/P/+v4/8hNTc3p5Pe3r4V7e03OFjmYC2wAWtw7u+RwnoBbACOYB14BZgvnH9pQcLFyMhIHhYWFnn06OcpWVlZh5OSkvdCTGZwKazVO3fuCkcUstTqm2dLS8sOHj+e+TFWVHR0dERqamr0sWPHP7t06fL5hoZG1fXrbdTael1Aa21tHQQxY0NL2VRWXst4/HiOxJienuECKlUrp6VFJcCP5XJ5KLsxQ0vZIwInpaRmZx9zqebmliUwsYiIiPcgZWFoKRkicJoJSHHrlkZSKiFhXyzLQYNHqrGx6UtdUvfuDUhKZWRkpLBCWLYU1nNgHdgUHPxWaHd3T74uqZmZWUKCi0plZ587aWJiIl9oEUZ/SQrLzsvLa3tZWfmh+/cfKEUk9I6WkOx1dfWNJ058kWZhYbFFKmo6hRDujyYmJttZAv9JeG41NTUv5gm5a9eqFN7em94WE5MSMraysgqEkFpaQDf4W2praxeEqLZWyaL0hFxVVXWVmZkZi9hKfaRWh4eHh4kI8A9Hl6b6+np6+HBcp9jw8AidPfs1RUZGka+vL6HHLYlafHwCr0h9pFaamprKkUcNLHGfAkINFBISQra2tuTn50d79rxPycnJqK6jdOjQYVwonoKDg8ne3p6cnJwoLi6eampquQyqV4Afp6R8Gg8pS0mphbVqgXX796d/ODU1rWEiYqjVai4SHr6DfHx8yM3NjTw8PCggIIAweujChTwaG7uPRzlBQ0PDNDg49DRdgYGB70DqebBqiRRPJGNjuaen57bFnDmTFf/o0W832AgxNJ2dP+W7urpuc3R05EDhRbFIud++3V3wRySYgOGZnJxC1IZIq+1CTrVwVCoVXbx48RwEnMWkXt648bXtCHkzHhstF0SYP76BgUHCPos6OjpRcVUazE8CQm6xfFNJRkrYCaSlpX2Aktayu5Kip6eX/P39WfXQqVNfUVHRD+zDeRFcufIjlZcr0MGzKTPzBJI5hQ1jQiOmI0eOtLLfWQxm4ifsus+qPhl6SCbESApEgSe1g4MD2dnZ0fr163k12tjYcAoLv4OENzvP35fJZPxVoajQsH4lkJ+fnwMhF31agqm5ufmWvr47peziUhw4cJALOTs7C/A2EBQUxPtYXl4eubi4sHNcKDY2lp9XKpUcPMpWJPh2tmPVd8y8il4TipxQj48/IjHQx1hj5BESorV582YqLi4RIoGfiyGzlxITk9B4mUwdfwU4lxgHIVt9x4wMDXC3paXlG2gJ+x48+JV0UVJSShiyVFBQyPsRtstUXV3DQZ4JEvwYacHJzf2WPTZXvQYylgMSNwFR0N6583MlNv87MBKycUwSLBbkxxqNllWZAGSqOcKxQqEQeWzSHX1NVNS7u3C3naOjYwRY1+3IyclNQ34pR0ZGSR9wM1RRUSkJKrMNebaVtQB9pDxv3uwoWjwSIMjBqmbH+oKtCbu4GFzs/Pmcb1jVAWkpZh0TE7O7v/8Xunu3f7nwPdPVq8Vi8ELA1zNKT09PY/1Jl5QMv3wanZc1xmXT1UW8iaKpisHfw/fDJki9rkvKG1+PqthMMhRoCZhp30ty+XIRYVscADEjKam1mNhvuru7bzUkqLKt6PoSyFiyb3hWoq/6p/nP/Cvod4M+AYycVdHoAAAAAElFTkSuQmCC");          
          if(Sharedata.get('project').id && Sharedata.get('checklist').id){
            return ''
          }
          else {return 'disabled';}
        }
        catch(error){
          return 'disabled'
          navigator.notification.alert(error.message, function(){}, " ");
        }
        
      };
      $scope.createProject = function(){
        Sharedata.clear();
        $location.path('/newProject');
      };

      $scope.openProject = function(){
        Sharedata.clear();
        $location.path('/projectlist');
      };

      $scope.reportIncident = function(){
        // fix this the id must be taken from common data service
        $location.path('/incidentReport/' + Sharedata.get('project').id);
      };

      $scope.openCheckList = function(){
        // fix this the id must be taken from common data service
        $location.path('/checklist/' + Sharedata.get('project').id);
      };
      
      
      $scope.downloadpdf = function(){
        // fix this the id must be taken from common data service
        $location.path('/categoryList/' + Sharedata.get('checklist').id);
        if(window.debug)console.log(Sharedata.get('checklist').id);
        if(window.debug)console.log(Sharedata.get('project').id);
        document.getElementById("pdf").href = settings.url + 'projects/'+Sharedata.get('project').id+'/reports/'+Sharedata.get('checklist').id+'/detail_report.pdf';
        if(window.debug)console.log($('#pdf').href);
      };  
      var updateFooterStatus = function () {
        var location = ($location.path().match(/\/\w+/)|| [])[0];
        switch (location) {
          case '/':
          case '/login':
            hasFooter = false;
            break;
          default:
            hasFooter = true;
            break;
        }
      };

      $scope.$on('$locationChangeSuccess', updateFooterStatus);
  }]);
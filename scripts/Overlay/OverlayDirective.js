angular.module('cms').directive('overlay', ['OverlayService',function (OverlayService) {   
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="overlay" ng-show="visibility" ></div>',      
      link: function (scope, element, attrs) {          
         
          scope.$watch(function() {return OverlayService.getVisibility()}, 
          function() {  
              scope.visibility = OverlayService.getVisibility();
          });          
          
      }
    };
}]);
angular.module('cms')
    .controller('KeyboardCtrl', ['ContentService', '$scope', function (ContentService, $scope) {
       var focusedHtmlElement;
       var Key = {"ENTER": 13, "F2": 113}; 
       this.content = ContentService.getTree();
                    
        $scope.keyPress = function(e){            
            focusedHtmlElement = document.querySelector( ':focus' );
            
            if(focusedHtmlElement){
                switch (e.keyCode) {
                   
                    case Key.F2:   
                        var scope = angular.element(focusedHtmlElement).scope();                        
                        if(scope.fileType === "file" || scope.fileType === "folder"){
                          scope.showRenameField(scope);    
                        }
                        return;
                        
                    default:
                      return;
                      
                }                   
                
            }
            
        }
}]);

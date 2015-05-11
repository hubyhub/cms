angular.module('cms')
    .controller('KeyboardCtrl', ['ContentService', '$scope', function (ContentService, $scope) {
       var focusedHtmlElement;
       var Key = {"ENTER": 13, "F2": 113, "ESC" : 27}; 
       this.content = ContentService.getTree();
                    
        $scope.keyPress = function(e){                      
             console.log(e.keyCode);
            
                switch (e.keyCode) {
                   
                    case Key.F2: 
                        focusedHtmlElement = document.querySelector( ':focus' );
                        if(focusedHtmlElement){ 
                            var scope = angular.element(focusedHtmlElement).scope();                        
                            if(scope.fileType === "file" || scope.fileType === "folder"){
                              scope.showRenameField(scope);    
                            }
                        } 
                        return;
                    
                    case Key.ESC: 
                        // if rename-field exists, close rename field without saving
                        if(document.getElementById('rename-field')){
                            
                            
                        }
                        
                        return;    
                    default:
                      return;    
                
            }
            
        }
}]);

angular.module('cms')
    .controller('KeyboardCtrl', ['ContentService', '$scope', function (ContentService, $scope) {
       var focusedHtmlElement;
       var Key = {  "ENTER": 13, 
                    "F2": 113, 
                    "ESC" : 27, 
                    "ENTF" : 46, 
                    "STRG" : 17,
                    "c" : 67,
                    "v" : 86
                }; 
        var strg;                
       //this.content = ContentService.getTree();
                    
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
                     var el = document.getElementById('rename-field');
                    // if rename-field exists, close rename field without saving
                        if(el){
                            var scope = angular.element(el).scope();
                            scope.cancelRename();
                        }                        
                        return;    
                        
                    case Key.ENTF:
                       // debugger;
                        focusedHtmlElement = document.querySelector( ':focus' );
                        if(focusedHtmlElement){
                            var scope = angular.element(focusedHtmlElement).scope();                        
                            if(scope.fileType === "file" || scope.fileType === "folder"){
                              // scope.deleteNode();    
                              // take care when deleting and ask Modal-dialog
                            }
                        }
                        return;
                    
                    case Key.c:
                        
                        if(strg){
                            focusedHtmlElement = document.querySelector( ':focus' );
                            if(focusedHtmlElement){
                                var scope = angular.element(focusedHtmlElement).scope();                        
                                if(scope.fileType === "file" || scope.fileType === "folder"){
                                    scope.copyNode();                                            
                                }
                            }
                        }
                        return;                        
                    
                    case Key.v:
                        if(strg){
                            focusedHtmlElement = document.querySelector( ':focus' );
                            if(focusedHtmlElement){
                                var scope = angular.element(focusedHtmlElement).scope();                        
                                if(scope.fileType === "file" || scope.fileType === "folder"){
                                    scope.pasteNode();    
                                }
                            }
                        }
                        return;   
                    
                    case Key.STRG:                       
                        strg = true;
                        return;   
                        
                    default:
                      return;    
                
            }
            
        }
        
        $scope.keyUp = function(e){ 
          console.log(e.keyCode); 
          
            switch (e.keyCode) {
                case Key.STRG:
                  strg = false;
                  return;   

                default:
                 return;    

            }
        }
}]);

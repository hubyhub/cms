
angular.module('cms').factory('OverlayService',[function (){
        var visibility = false;
        return {
            setVisibility : function(isVisible){                               
                  visibility = isVisible;                             
            },
            getVisibility : function(){
              return visibility;  
            }            
        };

    }]
);
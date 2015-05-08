angular.module('cms').controller('TableViewCtrl', ['ContentService', function(ContentService) {
    self = this;
    self.table ={};

    self.init = function(){
        self.table = ContentService.getTable();
    }

    self.addKey = function(){                
        console.log(self.table);
    }
    

    self.submit = function () {
              console.log("submit");
    };

}]);
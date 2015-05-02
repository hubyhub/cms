
angular.module('cms').factory('ContentService',['ContentTree', function (ContentTree){

        var currentTable = {};
        var currentNode  = {};
        var tree = ContentTree;

        return {
            selectNode : function(node){

                if(currentNode){
                    currentNode.selected = false;
                }

                currentNode = node;
                currentNode.selected = true;
                currentTable.content = currentNode.item.content;
            },
            getTable : function(){
                return currentTable;
            },
            getTree : function(){
                return tree;
            }
        };

    }]
);
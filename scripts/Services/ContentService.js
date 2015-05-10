
angular.module('cms').factory('ContentService',['ContentTree', '$timeout', function (ContentTree, $timeout){

        var currentTable = {};
        var currentNode  = {};
        var thisScope;
        var renameNode;

        var nodeTemplate =
        {
            "children" : {},
            "content": {},
            "name": "test"
        };

        // Default tree has a root-only
        var tree = {
            "root": {
                "id":"00000000-0000-0000-0000-000000000000",
                "name": "Root",
                "content": {},
                "children": {}
            }
        };
        tree.root.children = ContentTree;

        return {
            selectNode : function(node){

                if(currentNode){
                    currentNode.selected = false; //der alte Node
                }

                currentNode = node;
                currentNode.selected = true;
                currentTable.content = currentNode.item.content;
            },
            getSelectedNode : function(){
              return currentNode;  
            },
            setRenameNode : function(node){
                renameNode = node;
            },
            getRenameNode : function(){
                return renameNode;
            },
            getTable : function(){
                return currentTable;
            },
            getTree : function(){
                return tree;
            },
            saveScope : function(myScope){
                thisScope = myScope;
            },
            getScope : function(){
                return thisScope;
            }
        };

    }]
);
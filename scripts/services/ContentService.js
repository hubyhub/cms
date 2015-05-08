
angular.module('cms').factory('ContentService',['ContentTree', '$timeout', function (ContentTree, $timeout){

        var currentTable = {};
        var currentNode  = {};

        var nodeTemplate =
        {
            "children" : {},
            "content": {},
            "name": "test"
        };

        // Default tree has a root-only
        var tree = {
            "root": {
                "name": "Root",
                "content": {},
                "children": {}
            }
        };
        tree.root.children = ContentTree;

        return {
            selectNode : function(node){

                if(currentNode){
                    currentNode.selected = false;
                }

                currentNode = node;
                currentNode.selected = true;
                currentTable.content = currentNode.item.content;
            },
            addNode : function(node, name){
           
                nodeTemplate.name = name;
                //node.item.children[name] = nodeTemplate;
                node.update(nodeTemplate);
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

angular.module('cms').factory('ContentService',['ContentTree', '$timeout','GUIDService', function (ContentTree, $timeout, GUIDService){

        var currentTable = {};       
        var thisScope;
        var renameNode;
        var copyNode;
        var pathString = "tree.root";    
        // Default tree has a root-only
        var tree = {
            "root": {
                "id":"00000000-0000-0000-0000-000000000000",
                "name": "Root",
                "parent": null,
                "children": {},
                "content": {}
                
            }
        };

        tree.root.children = ContentTree;

        var nodeTemplate =
        {
            "id" :"",
            "name": "",
            "parent": "",
            "children" : {},
            "content": {},            
        };
        
        // Get path of an object
        var getPath = function (id, path) {          
            var parent = GUIDService.getScopeById(id).item.parent;
            if(parent){
                path.unshift(parent);
                getPath(parent, path);
            }
            return path;
        }; 
        
        // Helper function.. maybe put it into addNode function 
        var createNodeAndAppendToDOM = function (node) {
                    var isFile = true;
                    var guid = GUIDService.getGuid();
                    if(node.hasChildren){
                        isFile = false;
                    }

                    node.fileType = "folder";
                    node.hasChildren = true;                     
                    node.item.children[guid] ={
                        "id":guid,
                        "name": "",
                        "parent" : node.item.id,
                        "children" : {},
                        "content": {}                        
                    };

                    if(isFile){
                       node.compileNode();
                    }
                    
                    return guid;
        };
        
        
              
        return {
            selectNode : function(node){
                currentTable.content = node.item.content;
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
            deleteNode : function(node){                            
                var pathString = "tree.root";    
                var parentIds = getPath(node.item.id, [node.item.id] );                              
                var parentNode = GUIDService.getScopeById(node.item.parent);

                //create path-to-node as string
                for(var i = 1; i< parentIds.length; i++){                    
                    pathString += ".children['"+parentIds[i]+"']";
                }
                    
                if(eval("delete "+ pathString)){
                    parentNode.updateFileFolder();                    
                };
                          
            },
            copyNode: function(node){
                
                copyNode = node.item;
                console.log("copy");
            },
            pasteNode: function(){
                console.log("paset");
            },
            getTree : function(){
                return tree;
            },
            saveScope : function(myScope){
                thisScope = myScope;
            },
            addNode :function(node){
                
                if(node.contextMenu){
                    node.contextMenu.remove();
                }                    
                node.expanded = true;
                var id = createNodeAndAppendToDOM(node);   
                // Wait until apply and digest has ended
                $timeout(function() {
                    var node = GUIDService.getScopeById(id);
                    node.selectNode(node);
                    node.showRenameField(node);
                }, 0);
                
            }
           
        };

    }]
);


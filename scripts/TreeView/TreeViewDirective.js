angular.module('cms')
    .directive('treeView', [function () {

        return {
            replace: true,
            scope: {
                tree: '='
            },
            template: "<ol class='tree-view'><tree-item ng-repeat='t in tree' item='t'></tree-item></ol>"
        };

    }])
    .directive('treeItem', ["$compile", "$timeout", "ContentService", "OverlayService","GUIDService",function ($compile,$timeout, ContentService, OverlayService, GUIDService) {

        var type = {"file": "file", "folder": "folder"};
        return {
            replace: true,
            scope: {
                item: '='
            },
            link: function (scope, element, attr) {
                // TODO: compile nur 1x aufrufen bei wechsel von file to folder. (checken ob auch wirklich BEIDE directives aufgerufen werden)
                // und wenn bereits ein folder ist, dann brauchts nicht mehr aufgerufen werden?  bzw. auf dem PARENT element. also alle elemente noch einmal.. aber nur einmal.. oder
                // alle children löschen (im HTML, und nachdem Element hinzugefügt worden ist compile)
                
                scope.list = {};
                scope.expanded = false;
                scope.selected = false;
                scope.fileType = type.file;
                scope.hasChildren = false;
                //scope.editable = false;
                scope.newNode ={};
                scope.compileNode = function() {
                    var compiled = $compile("<tree-view tree='item.children'></tree-view>")(scope, function (cloned, scope) {                        
                        element.append(cloned);                             
                    });
                    
                }
                
                if (Object.prototype.toString.call(scope.item.children) === '[object Object]' && Object.keys(scope.item.children).length > 0) {
                    scope.fileType = type.folder;
                    scope.hasChildren = true;
                    scope.compileNode();
                }

              



                // Show and hide Context-Menu
                scope.showContextMenu = function () {
                    scope.contextMenu = $compile('<div id="context-menu" tabindex="-1" ><span ng-click="addNode()">New Node</span><span ng-click="showRenameField()">Rename</span><span>Copy</span><span>Cut</span><span ng-click="deleteNode()">Delete Node</span></div>')(scope);
                    element.append(scope.contextMenu);
                    document.getElementById("context-menu").focus();
                    scope.contextMenu.on('blur', function () {
                        scope.contextMenu.remove();
                    });
                };
                
                scope.saveName = function(){                                                                             
                       
                    // gets the reference to the node we want to rename
                    var node = ContentService.getRenameNode();                    
                    var el = document.getElementById(node.item.id);
                    
                    OverlayService.setVisibility(false);                    
                    node.item.name = scope.newNode.name;                
                    scope.newNode.name = "";                    
                    scope.renameField.remove(); 
                    scope.renameField = undefined;
                    
                    el.focus();
                    //TODO REMOVE EVENTLISTENER! also on contextmenu                        
                   ///$event.keyCode == 13 && 113
                    
                }
                
                scope.cancelRename = function(){   
                    var node = ContentService.getRenameNode(); 
                    var el = document.getElementById(node.item.id);

                    OverlayService.setVisibility(false);                   
                    
                    scope.newNode.name = "";
                    scope.renameField.remove();
                    scope.renameField = undefined; 
                    // cleanup & refactoring of new-node creation
                    if(!node.item.name || node.item.name.trim() === ""){
                        node.item.name= "New Item";
                    }
                    
                    el.focus();
                }
                
                // update view after deleting
                scope.updateFileFolder = function(){
                    
                    if(scope.item.id !== "00000000-0000-0000-0000-000000000000"){
                        if(scope.item.children.length>0){                            
                            scope.fileType = type.folder;
                            scope.hasChildren = true;
                        }
                        else{                        
                            scope.fileType = type.file;
                            scope.hasChildren = false;
                        }
                    }  
                }
                
                ///$event.keyCode == 13 && 113
                scope.showRenameField = function (node) {
                    if(!node){
                        node = scope;
                    }
                    if(!node.renameField){                   
                        // gets the new DOM-NODE
                        var el = GUIDService.getAngularElementById(node.item.id);
                       
                        // show current node-name in the rename-textfield
                        scope.newNode.name = node.item.name;
 
                        // creates input field                    
                        scope.renameField = $compile('<div id="rename-form"><form name="renameForm" novalidate ng-submit="renameForm.$valid && saveName()" ><input type="text" id="rename-field" name="renameText" ng-blur="renameForm.$valid && saveName()"  ng-model="newNode.name" ng-minlength="3" ng-required="true" placeholder="Name of the Node" /></form></div>')(scope);
                        el.append(scope.renameField);
                        
                        OverlayService.setVisibility(true);
                        
                        // saves a reference to the node, that we want to rename
                        ContentService.setRenameNode(node);

                        //sets focus on input field
                        document.getElementById("rename-field").focus();                   
                    }
                };
                
                // Selects a Node and hightlights it
                scope.selectNode = function (extScope) {
                    if(extScope){
                        ContentService.selectNode(extScope);
                    }
                    else{
                        ContentService.selectNode(scope);
                    }
                };
                                              
                // expands & collapses the folder
                scope.toggleFolder = function () {
                    scope.expanded = !scope.expanded;
                };
                
                // creates a new Node and appends it to JSON-object and DOM
                scope.addNode = function () {                   
                    ContentService.addNode(scope);                    
                };
                
                // Removes Node
                scope.deleteNode = function () {          
                    if(scope.contextMenu){
                        scope.contextMenu.remove();
                    }
                    ContentService.deleteNode(scope);
                };
                
                
                scope.copyNode = function () {          
                    if(scope.contextMenu){
                        scope.contextMenu.remove();
                    }
                    ContentService.copyNode(scope);
                };
                
                scope.pasteNode = function () {          
                    if(scope.contextMenu){
                        scope.contextMenu.remove();
                    }
                    ContentService.pasteNode(scope);
                };
                
                
                

            },
            template: '<li ng-class="{expanded: expanded}"><i class="expander" ng-click="toggleFolder()" ng-if="hasChildren" ></i><span  id="{{item.id}}" class="item" tabindex="1" ng-class="{expanded: expanded, selected : selected}" ng-click="selectNode()"   ng-right-click="showContextMenu()"><i class="file-type" ng-class="fileType"></i><span class="item-name"  >{{item.name}}</span></span></li>',
            controllerAs: 'itemCtrl'           
        };

    }])
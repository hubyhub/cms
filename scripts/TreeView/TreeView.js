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
    .directive('treeItem', ["$compile", "$timeout", "ContentService","GUIDService",function ($compile,$timeout, ContentService, GUIDService) {

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
                scope.editable = false;
                scope.newNode ={};

                if (Object.prototype.toString.call(scope.item.children) === '[object Object]' && Object.keys(scope.item.children).length > 0) {
                    scope.fileType = type.folder;
                    scope.hasChildren = true;
                    compileNode();
                }

                function compileNode() {
                    var compiled = $compile("<tree-view tree='item.children'></tree-view>")(scope, function (cloned, scope) {                        
                        element.append(cloned);                             
                    });
                    
                }

                // Show and hide Context-Menu
                scope.showContextMenu = function () {
                    scope.contextMenu = $compile('<div id="context-menu" tabindex="-1" ><span ng-click="addNode()">New Node</span><span>Copy</span><span>Cut</span><span>Delete</span></div>')(scope);
                    element.append(scope.contextMenu);
                    document.getElementById("context-menu").focus();
                    scope.contextMenu.on('blur', function () {
                        scope.contextMenu.remove();
                    });
                };
                
                scope.saveName = function($event){                                                                             
                       
                    var node = ContentService.getRenameNode();                    
                    node.item.name = scope.newNode.name;                
                    scope.renameField.remove();                     
                    scope.newNode.name ="";
                    //TODO REMOVE EVENTLISTENER! also on contextmenu                        
                   ///$event.keyCode == 13 && 113
                }
                
                
                ///$event.keyCode == 13 && 113
                scope.showRenameField = function (node) {
                    
                    // gets the new DOM-NODE
                    var el = GUIDService.getAngularElementById(node.item.id);
                   
                    // creates input field
                    scope.renameField = $compile('<input type="text" id="rename-field" ng-model="newNode.name" ng-keyup="$event.keyCode == 13 && saveName($event)" ng-blurs="saveName()" placeholder="Name of the Node" />')(scope);
                    el.append(scope.renameField);
                    
                    // saves the node, that we want to rename
                    ContentService.setRenameNode(node);
                    
                    //sets focus on input field
                    document.getElementById("rename-field").focus();
                    
                    //set "rename-node"
                   
                   
                   
                    // add input-field
                                       
               
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
                    scope.contextMenu.remove();
                    scope.expanded = true;
                    var id = scope.createNodeAndAppendToDOM();   
                    // Wait until apply and digest has ended
                    $timeout(function() {
                        var node = GUIDService.getScopeById(id);
                        scope.selectNode(node);
                        scope.showRenameField(node);
                    }, 0);
                    
                };
                
                // Helper function.. maybe put it into addNode function 
                scope.createNodeAndAppendToDOM = function () {
                    var isFile = true;
                    var guid = GUIDService.getGuid();
                    if(scope.hasChildren){
                        isFile = false;
                    }

                    scope.fileType = type.folder;
                    scope.hasChildren = true;                     
                    scope.item.children[guid] ={
                        "children" : {},
                        "content": {},
                        "name": "",
                        "id":guid
                    };

                    if(isFile){
                       compileNode();
                    }
                    
                    return guid;
                };

            },
            template: '<li ng-class="{expanded: expanded}"><i class="expander" ng-click="toggleFolder()" ng-if="hasChildren" ></i><span  id="{{item.id}}" class="item"  ng-class="{expanded: expanded, selected : selected, editable: editable}" ng-click="selectNode()"   ng-right-click="showContextMenu()"><i class="file-type" ng-class="fileType"></i><span class="item-name" >{{item.name}}</span></span></li>',
            controllerAs: 'itemCtrl'           
        };

    }])
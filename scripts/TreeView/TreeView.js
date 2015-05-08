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
    .directive('treeItem', function ($compile, ContentService) {

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

                if (Object.prototype.toString.call(scope.item.children) === '[object Object]' && Object.keys(scope.item.children).length > 0) {
                    scope.fileType = type.folder;
                    scope.hasChildren = true;
                    compileNode();
                }

                function compileNode() {
                    $compile("<tree-view tree='item.children'></tree-view>")(scope, function (cloned, scope) {
                        element.append(cloned);
                    });
                }

                // Show and hide Context-Menu
                scope.showContextMenu = function () {
                    var contextMenu = $compile('<div id="context-menu" tabindex="-1" ><span ng-click="itemCtrl.addNode()">New Node</span><span>Copy</span><span>Cut</span><span>Delete</span></div>')(scope);
                    element.append(contextMenu);
                    document.getElementById("context-menu").focus();
                    contextMenu.on('blur', function () {
                        contextMenu.remove();
                    });
                };

                scope.addNode = function () {
                    var isFile = true;

                    if(scope.hasChildren){
                        isFile = false;
                    }

                    scope.fileType = type.folder;
                    scope.hasChildren = true;
                    var newName = scope.item.name+"1";
                    scope.item.children[newName] ={
                        "children" : {},
                        "content": {},
                        "name": newName
                    };

                    if(isFile){
                        compileNode();
                    }

                };

                scope.update = function (nodeTemplate) {
                    var isFile = true;
                    //debugger;
                    if(scope.hasChildren){
                        isFile = false;
                    }

                    scope.fileType = type.folder;
                    scope.hasChildren = true;

                    scope.item.children["whatever"] = nodeTemplate;
                    if(isFile){
                        compileNode();
                    }
                }

                scope.manf = function(){
                    console.log("manf");

                }

            },
            template: '<li ng-class="{expanded: expanded}"><i class="expander" ng-click="itemCtrl.toggleFolder()" ng-if="hasChildren" ></i><span class="item" ng-class="{expanded: expanded, selected : selected}" ng-click="itemCtrl.select()" ng-right-click="showContextMenu()"><i class="file-type" ng-class="fileType"></i><span>{{item.name}}</span></span></li>',
            controllerAs: 'itemCtrl',
            controller: function ($scope) {

                this.toggleFolder = function () {
                    $scope.expanded = !$scope.expanded;
                };

                this.select = function () {
                    ContentService.selectNode($scope);
                };

                this.addNode = function () {
                    //TODO: implement add functionality without service?
                    //  -->take update functionality
                    //  -->add unique object.. (hopefully that is causing the freezing right now)
                    // name?
                    //

                    $scope.addNode();
                   //ContentService.addNode($scope, "Item" + Math.round(Math.random() * 100));
                };


            }
        };

    })
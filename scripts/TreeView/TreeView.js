'use strict';

angular.module('cms')
    .directive('treeView', [function () {

        return{
            replace : true,
            scope : {
                tree :'='
            },
            template:"<ol class='tree-view'><tree-item ng-repeat='t in tree' item='t'></tree-item></ol>"
        };

    }])
    .directive('treeItem', function ($compile, ContentService) {

        var type = { "file" : "file", "folder" : "folder" };
        return{
            replace : true,
            scope : {
                item :'='
            },
            link : function (scope, element, attr){

                scope.list = {};
                scope.expanded = false;
                scope.fileType = type.file;
                scope.hasChildren = false;
                scope.selected = false;

                scope.removeContextMenu = function(){
                    console.log("asdfasdf");
                };



                // Show and hide Context-Menu
                scope.showContextMenu = function(){

                    var contextMenu = $compile('<div id="context-menu" tabindex="-1" ><span ng-click="itemCtrl.addNode()">New Node</span><span>Copy</span><span>Cut</span><span>Delete</span></div>')(scope);
                    element.append(contextMenu);
                    document.getElementById("context-menu").focus();

                    contextMenu.on('blur', function () {
                        contextMenu.remove();
                    });

                };

                if(Object.prototype.toString.call(scope.item.children) === '[object Object]' && Object.keys(scope.item.children).length > 0 ){
                    scope.fileType = type.folder;
                    scope.hasChildren = true;
                    $compile("<tree-view tree='item.children'></tree-view>")(scope, function(cloned, scope){
                        element.append(cloned);
                    });
                }

            },
            template:'<li ng-class="{expanded: expanded}"><i class="expander" ng-click="itemCtrl.toggleFolder()" ng-if="hasChildren" ></i><span class="item" ng-class="{expanded: expanded, selected : selected}" ng-click="itemCtrl.select(item)" ng-right-click="showContextMenu()"><i class="file-type" ng-class="fileType"></i><span>{{item.name}}</span></span></li>',
            controllerAs: 'itemCtrl',
            controller: function ($scope) {

                this.toggleFolder = function(){
                    $scope.expanded = !$scope.expanded;
                };

                this.select = function(node){
                    ContentService.selectNode($scope);
                };

                this.addNode = function(){
                    ContentService.addNode($scope);
                };

            }
    };

    });
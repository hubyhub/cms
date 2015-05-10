angular.module('cms')
    .controller('TreeViewCtrl', ['ContentService', function (ContentService) {
        this.content = ContentService.getTree();
}]);

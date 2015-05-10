<?php
    $file = "content.json";
    $json = json_encode(file_get_contents($file));
?>
<!doctype html>
<html ng-app="cms"  >
  <head>
    <meta charset="utf-8">
    <title>Superlink</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/header.css">
    <link rel="stylesheet" href="styles/csstree.css">
    <link rel="stylesheet" href="styles/layout.css">
    <link rel="stylesheet" href="styles/key-value-table.css">
    <link rel="stylesheet" href="styles/language-bar.css">
    <link rel="stylesheet" href="styles/context-menu.css">


  </head>
  <body ng-controller="KeyboardCtrl" ng-keydown=" keyPress($event);" >
    <header>JsonCMS
        <div id="language-bar">
            <span class="selected">EN</span>
            <span>DE</span>
            <span>IT</span>
            <span>ES</span>
        </div>
    </header>
    <main>        
        <div class="column-layout" >

            <div class="column" >

                    <div ng-controller="TreeViewCtrl as tree" >
                        <tree-view tree="tree.content"></tree-view>
                    </div>

            </div>

        <div class="column">
            <form ng-controller="TableViewCtrl as tableView" ng-init="tableView.init()" ng-submit="tableView.submit()">

                <table class="key-value" >
                    <tr ng-repeat="(key, value) in tableView.table.content" >
                        <td><input type="text" value="{{key}}"/></td>
                        <td><input type="text" value="{{value}}"/></td>
                    </tr>
                    <tr ng-repeat-end>
                        <td><input type="text" placeholder="Add key..." ng-click="" /></td>
                        <td><input type="text" placeholder="Add value..."  ng-click="" /></td>
                    </tr>
                </table>

            </form>
        </div>
    </div>

    </main>


    <script src="scripts/lib/angular-1.3.14.js"></script>
    <script src="scripts/app.js"></script>
    <script>angular.module('cms').value('ContentTree', JSON.parse(<?= $json ?>) );</script>
    <script src="scripts/Directives/RightClick.js"></script>
    <script src="scripts/TreeView/TreeViewCtrl.js"></script>
    <script src="scripts/Services/ContentService.js"></script>
    <script src="scripts/Keyboard/KeyboardCtrl.js"></script>
    <script src="scripts/Services/GUIDService.js"></script>
    <script src="scripts/TableView/TableViewCtrl.js"></script>
    <script src="scripts/TreeView/TreeView.js"></script>

</body>
</html>

'use strict';

var mainController = angular.module('mainController', []);

mainController.controller('MainCtrl', ['$scope', '$http', 'Search', 'Summary', 'Agent', 'usSpinnerService', '$modal',
  function ($scope, $http, Search, Summary, Agent, usSpinnerService, $modal) {
    $scope.color = "White";
    $scope.date = "1 Minute";
    $scope.time = 0;
    $scope.setInterval = 60000;
    $scope.agentName = "";
    $scope.agentList = [];
    $scope.diskName = "";
    $scope.diskList = [];
    $scope.summary_list = [];

    $scope.navBarClass = "navbar navbar-default navbar-fixed-top";
    $scope.panelClass = "panel panel-default";
    $scope.panelBtnClass = "btn btn-default btn-xs pull-right";

    $scope.menuList = {
      "File System" : ['ON', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "Memory Usage" : ['ON', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "Storage Usage" : ['ON', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "Garbage Collection Full" : ['OFF', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "Garbage Collection Incremental" : ['OFF', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "Heap Usage" : ['OFF', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "CPU Usage" : ['ON', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "CPU Time" : ['ON', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "V8 Heap Usage" : ['OFF', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "HTTP Request" : ['ON', 'col-md-4', 'glyphicon glyphicon-resize-full'],
      "HTTP Response" : ['OFF', 'col-md-4', 'glyphicon glyphicon-resize-full']
    };

    $scope.summaryListChange = function (agentName, diskName) {
      $scope.summary_list = [
        [agentName, 'File System', 'Requests per minute', 'fileSystem'],
        [agentName, 'OS', 'Total memory', 'memoryTotal'],
        [agentName, 'OS', 'Free memory', 'memoryFree'],
        [agentName, diskName, 'Total space', 'storageTotal'],
        [agentName, diskName, 'Used space', 'storageUsage'],
        [agentName, 'Garbage Collection', 'Full GCs per minute', 'GCsFull'],
        [agentName, 'Garbage Collection', 'Incremental GCs per minute', 'GCsIncremental'],
        [agentName, 'Garbage Collection', 'Used heap size change per minute', 'heapUsage'],
        [agentName, 'Process', 'CPU usage', 'cpuUsage'],
        [agentName, 'Process', 'CPU time', 'cpuTime'],
        [agentName, 'Process', 'V8 heap used', 'V8heapUsage'],
        [agentName, 'Process', 'V8 heap total', 'V8heapTotal'],
        [agentName, 'HTTP Client', 'Requests per minute', 'httpRequest'],
        [agentName, 'HTTP Client', 'Average response time', 'httpResponse']
      ];
    }

    $scope.diskListChange = function () {
      Agent.list({session:$scope.agentName,scopesearch:'Disks'}, function success(result) {
        if(result.length != 0 ) {
          $scope.diskName = result[0].MetricsNames[0].Scope;
          $scope.diskList = result[0].MetricsNames;
        } else {
          $scope.diskName = '';
        }
        $scope.summaryListChange($scope.agentName, $scope.diskName);
        $scope.dateBtnClick($scope.time, $scope.setInterval, $scope.date);
      }, function error() {
      })
    }

    Agent.list({onlyname:1}, function success(result) {
      $scope.agentName = result[0].Name;
      $scope.agentList = result;
      $scope.diskListChange();
      $scope.minuteIntervalCall();
    }, function error() {
    });

    $scope.colorBtnClick = function (color, navBar, panel, panelBtn, bgColor) {
      $scope.color = color;
      $scope.navBarClass = navBar;
      $scope.panelClass = panel;
      $scope.panelBtnClass = panelBtn;
      document.body.style.backgroundColor = bgColor;
    }

    $scope.agentBtnClick = function (name) {
      $scope.agentName = name;
      $scope.diskListChange();
    }

    $scope.dateBtnClick = function (time, interval, title) {
      $scope.time = time;
      $scope.setInterval = interval;
      $scope.date = title;
      usSpinnerService.spin('spinner-1');
      async.each($scope.summary_list,
        function (summary_val, callback) {
          var session_id = summary_val[0];
          var scope = summary_val[1];
          var name = summary_val[2];
          var array = summary_val[3];
          if($scope.time == 0) {
            Search.query({session_id: session_id, scope: scope, name: name, len: 24}, function success(result) {
              $scope.$parent.DBArray[array] = [];
              if(scope != '') {
                var searchData = [];
                for(var i=0; i<24; i++) {
                  if(i%2 == 0) {
                    var oneData = {x:0, y:0};
                    oneData.x = result[i].x;
                    oneData.y = result[i].y;
                    searchData[i/2] = oneData;
                  }
                }
                $scope.$parent.DBArray[array] = searchData;
              }
              callback(null);
            }, function error() {
              callback(null);
            });
          } else {
            Summary.query({time: $scope.time, session_id: session_id, scope: scope, name: name}, function success(result) {
              $scope.$parent.DBArray[array] = [];
              if(scope != '') {
                $scope.$parent.DBArray[array] = result;
              }
              callback(null);
            }, function error() {
              callback(null);
            });
          }
        }, function (err) {
          usSpinnerService.stop('spinner-1');
          $scope.$parent.refreshChart();
        });
    }

    $scope.diskBtnClick = function (name) {
      $scope.diskName = name;
      $scope.summaryListChange($scope.agentName, $scope.diskName);
      $scope.dateBtnClick($scope.time, $scope.setInterval, $scope.date);
    }

    $scope.getSplit = function (string, nb) {
      // 결과가 appName/hostname/mount/point로 오므로 마지막값을 리턴한다.
      var array = string.split('/');
      return $scope.result = array[array.length-1];
    }

    $scope.minuteIntervalCall = function () {
      var interval = setInterval(function() {
        var d = new Date();
        console.log(d.getHours() + ':' + d.getMinutes());
        if($scope.time == 0) {
          $scope.dateBtnClick($scope.time, $scope.setInterval, $scope.date);
        }
      }, $scope.setInterval);
    }

    $scope.sidebarBtnClick = function () {
      if (document.getElementById("sidebar").style.left == "-20px") {
        $("#sidebar").animate({
          left: -180
        });
        $("#sidebar_icon").removeClass("glyphicon glyphicon-chevron-left");
        $("#sidebar_icon").addClass("glyphicon glyphicon-chevron-right");
      } else {
        $("#sidebar").animate({
          left: -20
        });
        $("#sidebar_icon").removeClass("glyphicon glyphicon-chevron-right");
        $("#sidebar_icon").addClass("glyphicon glyphicon-chevron-left");
      }
    }

    $scope.menuBtnClick = function (menu) {
      if($scope.menuList[menu][0] == "ON") {
        $scope.menuList[menu][0] = "OFF";
      } else {
        $scope.menuList[menu][0] = "ON";
      }
    }

    $scope.chartSizeBtnClick = function (menu) {
      if($scope.menuList[menu][1] == "col-md-4") {
        $scope.menuList[menu][1] = "col-md-12";
        $scope.menuList[menu][2] = "glyphicon glyphicon-resize-small";
      } else {
        $scope.menuList[menu][1] = "col-md-4";
        $scope.menuList[menu][2] = "glyphicon glyphicon-resize-full";
      }
      $scope.$parent.refreshChart();
    }

    $scope.xAxisTickFormat = function () {
      return function (d) {
        return getTime(d);
      }
    }

    $scope.yAxisTickFormat = function (type) {
      return function (d) {
        return d + type;
      }
    }

    $scope.xFunction = function () {
      return function (d) {
        return d.x;
      }
    }

    $scope.yFunction = function () {
      return function (d) {
        return d.y;
      }
    }

    $scope.tooltipBtnClick = function () {
      return function (key, x, y) {
        return key + " : " + y;
      }
    }
  }
]);

function getTime(d) {
  var date = new Date(d);
  var hour = date.getHours();
  var minute = date.getMinutes();
  return hour + ':' + minute;
}
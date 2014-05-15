'use strict';

var socket = io.connect('http://localhost');
var commonController = angular.module('commonController', []);

commonController.controller('CommonCtrl', ['$scope', '$http', '$rootScope',
  function ($scope, $http, $rootScope) {
    $scope.payloadlist = [];

    //initial data
    $scope.DBArray = {
      fileSystem:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      memoryTotal:[{x:1, y:1},{x:2, y:1},{x:3, y:1},{x:4, y:1},{x:5, y:1},{x:6, y:1},{x:7, y:1},{x:8, y:1},{x:9, y:1},{x:10, y:1},{x:11, y:1},{x:12, y:1}],
      memoryFree:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      memoryUsage:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      storageTotal:[{x:1, y:1},{x:2, y:1},{x:3, y:1},{x:4, y:1},{x:5, y:1},{x:6, y:1},{x:7, y:1},{x:8, y:1},{x:9, y:1},{x:10, y:1},{x:11, y:1},{x:12, y:1}],
      storageUsage:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      GCsFull:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      GCsIncremental:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      heapUsage:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      httpRequest:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      httpResponse:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      cpuUsage:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      cpuTime:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}],
      V8heapTotal:[{x:1, y:1},{x:2, y:1},{x:3, y:1},{x:4, y:1},{x:5, y:1},{x:6, y:1},{x:7, y:1},{x:8, y:1},{x:9, y:1},{x:10, y:1},{x:11, y:1},{x:12, y:1}],
      V8heapUsage:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0}]
    };

    $scope.refreshChart = function () {
      $scope.values = $scope.DBArray;
      for(var i=0; i<12; i++) {
        var value = $scope.DBArray['memoryTotal'][i].y - $scope.DBArray['memoryFree'][i].y;
        value = Number(value.toFixed(2));
        $scope.DBArray['memoryUsage'][i].y = value;
        $scope.DBArray['memoryUsage'][i].x = $scope.DBArray['memoryTotal'][i].x;
        //console.log('memoryTotal : ' + $scope.DBArray['memoryTotal'][i].x);
        //console.log('memoryFree : ' + $scope.DBArray['memoryFree'][i].x);
      }

      $scope.fileSystemData = [
       {
         key: 'File System',
         values: $scope.values['fileSystem'],
         color: '#F0AD4E'
       }
      ]
      $scope.memoryUsageData = [
        {
          key: 'Memory Total',
          values: $scope.values['memoryTotal']
        },
        {
          key: 'Memory Usage',
          values: $scope.values['memoryUsage'],
          color: '#F0AD4E'
        }
      ]
      $scope.storageUsageData = [
        {
          key: 'Storage Total',
          values: $scope.values['storageTotal']
        },
        {
          key: 'Storage Usage',
          values: $scope.values['storageUsage'],
          color: '#F0AD4E'
        }
      ]
      $scope.GCsFullData = [
        {
          key: 'GCs Full',
          values: $scope.values['GCsFull'],
          color: '#5CB85C'
        }
      ]
      $scope.GCsIncrementalData = [
        {
          key: 'GCs Incremental',
          values: $scope.values['GCsIncremental'],
          color: '#5CB85C'
        }
      ]
      $scope.heapUsageData = [
        {
          key: 'Heap Usage',
          values: $scope.values['heapUsage'],
          color: '#5CB85C'
        }
      ]
      $scope.httpRequestData = [
        {
          key: 'HTTP Request',
          values: $scope.values['httpRequest'],
          color: '#5BC0DE'
        }
      ]
      $scope.httpResponseData = [
        {
          key: 'HTTP Response',
          values: $scope.values['httpResponse'],
          color: '#5BC0DE'
        }
      ]
      $scope.cpuUsageData = [
       {
         key: 'CPU Usage',
         values: $scope.values['cpuUsage'],
         color: '#B85CB8'
       }
      ]
      $scope.cpuTimeData = [
        {
          key: 'CPU Time',
          values: $scope.values['cpuTime'],
          color: '#B85CB8'
        }
      ]
      $scope.V8HeapUsageData = [
        {
          key: 'V8 Heap Total',
          values: $scope.values['V8heapTotal']
        },
        {
          key: 'V8 Heap Usage',
          values: $scope.values['V8heapUsage'],
          color: '#B85CB8'
        }
      ]
    }
  }
]);





'use strict';

var publicApp = angular.module('publicApp', [
  'ngRoute',
  'nvd3ChartDirectives',
  'ui.bootstrap',
  'mainController',
  'commonController',
  'restServices',
  'angularSpinner'
]);

publicApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
});

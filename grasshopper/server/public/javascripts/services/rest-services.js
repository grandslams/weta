var restServices = angular.module('restServices', ['ngResource']);

restServices.factory('Summary', ['$resource',
  function($resource){
    return $resource('http://www.weta.io/api/summary/metrics/:time', {time: '@time'}, {
      query: {method:'GET', isArray:true}
    });
  }]);

restServices.factory('Search', ['$resource',
  function($resource){
    return $resource('http://www.weta.io/api/search/metrics', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);

restServices.factory('Agent', ['$resource',
  function($resource){
    return $resource('http://www.weta.io/api/agent/list/:session', {session:'@session'}, {
      list: {method:'GET', isArray:true},
      get: {method:'GET', params:{session:'@session'}, isArray:true}
    });
  }]);
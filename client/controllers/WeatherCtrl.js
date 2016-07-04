angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','WeatherSearchService',
  function ($scope, WeatherSearchService) {
    console.log('are we in the weather controllers???');
    WeatherSearchService.getWeatherData();
}]);
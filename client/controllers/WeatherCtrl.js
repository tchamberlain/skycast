angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','WeatherSearchService','$timeout',
  function ($scope, WeatherSearchService, $timeout) {
     
    $scope.searchPlace = function(place){
      WeatherSearchService.getPlaceData( place )
      .then(function(resp){
        $scope.placePredictions = resp.data;
      });      
    }
     $scope.getWeatherData = function(place){
      WeatherSearchService.getWeatherCurrently(place)
      .then(function(resp){
        $scope.weatherCurrently = resp.data.currently;
        $scope.weatherForecast = resp.data.daily;
      });    
     }
    



}]);
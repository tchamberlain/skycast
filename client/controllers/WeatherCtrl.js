angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','WeatherSearchService','$timeout',
  function ($scope, WeatherSearchService, $timeout) {
    
    console.log('are we in the weather controllers???');
    WeatherSearchService.getWeatherData();
    $scope.searchPlace = function(place){
      WeatherSearchService.getPlaceData( place );      
    }
    
}]);
angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','WeatherSearchService','$timeout',
  function ($scope, WeatherSearchService, $timeout, $q, $log) {
    

    $scope.placePredictions = [];

    $scope.searchPlace = function(place){
      WeatherSearchService.getPlaceData( place )
      .then(function(resp){
        $scope.placePredictions = resp.data;
      });      
    }
     $scope.getWeatherData = function(place){
      // if someone presses enter rather than clicking on an option
      if( place === undefined ){
        if($scope.placePredictions.length > 0){
          place =  $scope.placePredictions[0];
        } else {
          $scope.placePredictions[0] = 'No results found. Please try another search.';
        }
      }

      //set the place as the one just clicked on
      $scope.place = place.terms[0].value;

      WeatherSearchService.getWeatherCurrently(place)
      .then(function(resp){
        $scope.weatherCurrently = resp.data.currently;
        $scope.weatherForecast = resp.data.daily.data;
        
        //get the current day
        var day = new Date().getDay();
        var daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        for(var i = 0; i < $scope.weatherForecast.length; i++){
          $scope.weatherForecast[i].day = daysOfWeek[ ( i+day+1 ) % 7 ];
        }
      });    

      //set this predictions back to empty
      $scope.placePredictions = [];

     }


    

}]);
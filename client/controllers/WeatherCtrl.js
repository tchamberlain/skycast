angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','WeatherSearchService','$timeout',
  function ($scope, WeatherSearchService, $timeout, $q, $log) {
    
    $scope.searchPlace = function( placeEntry ){
      // use service to generate google places autocomplete predictions
      WeatherSearchService.getPlaceData( placeEntry )
      .then(function(resp){
        $scope.placePredictions = resp.data;
      });      
    }

     $scope.getWeatherData = function( place ){
      // if someone presses enter rather than clicking on an option
      if( place === undefined ){
        if($scope.placePredictions.length > 0){
          place =  $scope.placePredictions[0];
        } else {
          $scope.placePredictions[0] = 'No results found. Please try another search.';
        }
      }
      //set the placeEntry as the prediction just clicked on
      $scope.placeEntry = place.terms[0].value;

      // get the weather information for this week
      WeatherSearchService.getWeatherCurrently(place)
      .then(function(resp){
        $scope.weatherCurrently = resp.data.currently;
        // add the day of the week onto each forecast object
        $scope.weatherForecast = WeatherSearchService.addDaysOfWeek( resp.data.daily.data );
      });

      //set this predictions back to empty
      $scope.placePredictions = [];

     }


}]);
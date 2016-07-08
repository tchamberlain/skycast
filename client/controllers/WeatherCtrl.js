angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','SearchService','$timeout',
  function ( $scope, SearchService, $timeout, $q ) {
    
    $scope.searchPlace = function( placeEntry ){
      // clearing any current data for a new search
      $scope.weatherCurrently = null;
      $scope.weatherForecast = null;
      $scope.weatherHistory = null;
      $scope.weatherMapUrl = null;

      // use service to generate google places autocomplete predictions
      SearchService.getPlaceData( placeEntry )
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

      //set this predictions back to empty
      $scope.placePredictions = [];

      //set the placeEntry as the prediction just clicked on
      $scope.placeEntry = place.name;

      // get the weather information for this week
      SearchService.getWeatherCurrently( place )
      .then(function(resp){
        // make the map
        $scope.mapUrl = SearchService.constructMapUrl( resp.data.latitude, resp.data.longitude );
        $scope.weatherCurrently = resp.data.currently;
        // add the day of the week onto each forecast object
        $scope.weatherForecast = SearchService.addDaysOfWeek( resp.data.daily.data );
      });

      SearchService.getWeatherHistory( place )
      .then(function(resp){
        setUpHistoryChart(resp.data);
        $scope.weatherHistory = resp;
      });

     }

    // When routing from pastSearches, there will already be a search, so we'll grab it
    var getPriorSearch = function(){
      if( SearchService.getSearch() ){
         $scope.getWeatherData( SearchService.getSearch() );
        // reset search to null
        SearchService.setSearch( null )
      }
    }

    var setUpHistoryChart = function( data ){
      var highTempArr = data.map(function( date ) {
                return date.temperatureMax;
      });
      var lowTempArr = data.map(function( date ) {
                return date.temperatureMin;
      });

      //get the dates in a human-readable format
      var datesArr = data.map(function( date ) {
                return SearchService.convertTimeStamp(date.time);
      });
      
      $scope.chartData = [ lowTempArr, highTempArr ];
      $scope.labels = datesArr;

      $scope.series = ['High Temp', 'Low Temp'];
    }

    getPriorSearch();

}]);




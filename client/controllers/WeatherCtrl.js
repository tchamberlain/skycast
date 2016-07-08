angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','SearchService','$timeout',
  function ( $scope, SearchService, $timeout, $q ) {
    
    $scope.searchPlace = searchPlace;
    $scope.getWeatherData = getWeatherData;

    getPriorSearch();

    // When routing from pastSearches, there will already be a search, so we'll grab it
    function getPriorSearch(){
      if( SearchService.getSearch() ){
         $scope.getWeatherData( SearchService.getSearch() );
        // reset search to null
        SearchService.setSearch( null )
      }
    }

    function searchPlace( placeEntry ){
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

    function getWeatherData( place ){
      //set this predictions back to empty
      $scope.placePredictions = [];

      //set the placeEntry as the prediction just clicked on
      $scope.placeEntry = place.name;

      setUpCurrentWeather(place);
      setUpWeatherHistory(place);

     }

    function setUpCurrentWeather( place ){
      // get the weather information for this week
      SearchService.getWeatherCurrently( place )
      .then(function(resp){
        // make the map
        $scope.mapUrl = SearchService.constructMapUrl( resp.data.latitude, resp.data.longitude, resp.data.key );
        $scope.weatherCurrently = resp.data.currently;
        // add the day of the week onto each forecast object
        $scope.weatherForecast = SearchService.addDaysOfWeek( resp.data.daily.data );
      });
    }

    function setUpWeatherHistory( place ){
      SearchService.getWeatherHistory( place )
      .then(function(resp){
        setUpHistoryChart(resp.data);
        $scope.weatherHistory = resp;
      });
    }

    function setUpHistoryChart( data ){
      var highTempArr = data.map(function( date ) {return date.temperatureMax; });
      var lowTempArr = data.map(function( date ) { return date.temperatureMin; });
      var datesArr = data.map(function( date ) {return SearchService.convertTimeStamp(date.time);});
      $scope.chartData = [ lowTempArr, highTempArr ];
      $scope.labels = datesArr;
      $scope.series = ['High Temp', 'Low Temp'];
    }

}]);




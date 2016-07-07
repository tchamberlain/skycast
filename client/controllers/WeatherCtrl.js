angular.module('WeatherCtrl',[])
.controller('weatherController',['$scope','WeatherSearchService','$timeout',
  function ( $scope, WeatherSearchService, $timeout, $q ) {
   
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
      $scope.placeEntry = place.name;

      // get the weather information for this week
      WeatherSearchService.getWeatherCurrently( place )
      .then(function(resp){
        $scope.weatherCurrently = resp.data.currently;
        // add the day of the week onto each forecast object
        $scope.weatherForecast = WeatherSearchService.addDaysOfWeek( resp.data.daily.data );
      });

      WeatherSearchService.getWeatherHistory( place )
      .then(function(resp){
        console.log(resp.data)
        setUpHistoryChart(resp.data);
        $scope.weatherHistory = resp;
      });

      //set this predictions back to empty
      $scope.placePredictions = [];

     }

    // When routing from pastSearches, there will already be a search, so we'll grab it
    var getPriorSearch = function(){
      if( WeatherSearchService.getSearch() ){
        var place = WeatherSearchService.getSearch();
         $scope.getWeatherData( place );
        // reset search to null
        WeatherSearchService.setSearch( null )
      }
    }

    var setUpHistoryChart = function( data ){
       var highTempArr = data.map(function( date ) {
                  return date.temperatureMax;
        });
       var lowTempArr = data.map(function( date ) {
                  return date.temperatureMin;
        });
       var datesArr = data.map(function( date ) {
                  return convertTimeStamp(date.time);
        });

      $scope.labels = datesArr;
      $scope.series = ['High Temp', 'Low Temp'];
       $scope.chartData = [
         lowTempArr,
         highTempArr
       ];
    }

    var convertTimeStamp = function( timestamp ){
      var date = new Date(timestamp * 1000);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      var datevalues = [
         months[date.getMonth()],
         date.getDate()
      ];
      return datevalues.join('-');
    }

    getPriorSearch();

}]);
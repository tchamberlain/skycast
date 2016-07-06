angular.module('WeatherSearchService',[])
.factory('WeatherSearchService',
  ['$http',
  function ($http) {
    var search = null;

    return ({
      getWeatherCurrently: getWeatherCurrently,
      getPlaceData: getPlaceData,
      getPastSearches: getPastSearches,
      getSearch: getSearch,
      setSearch: setSearch,
      addDaysOfWeek: addDaysOfWeek
    });

    function addDaysOfWeek( weatherForecastArr ) {
      //get the current day
      var day = new Date().getDay();
      var daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      for(var i = 0; i < weatherForecastArr.length; i++){
       weatherForecastArr[i].day = daysOfWeek[ ( i+day+1 ) % 7 ];
      }
      return weatherForecastArr;
    }

    function getSearch() {
      return search;
    }
    function setSearch(newSearch) {
      search = newSearch;
    }

    function getWeatherCurrently(place) {
      return $http.post('/weather/currently',
        { place: place })
      .error(function (data) {
       console.error(data);
      });
    }

    function getWeatherHistory(place) {
      return $http.post('/weather/history',
        { place: place })
      .error(function (data) {
       console.error(data);
      });
    }

    function getPlaceData(place) {
      return $http.post('/placeData',
        { place: place })
      .error(function (data) {
        console.error(data);
      });
    }

    function getPastSearches() {
      return $http.get('/user/pastSearches')
      .error(function (data) {
       console.error(data);
      });
    }

}]);
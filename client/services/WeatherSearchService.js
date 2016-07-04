angular.module('WeatherSearchService',[])
.factory('WeatherSearchService',
  ['$http',
  function ($http) {

    return ({
      getWeatherData: getWeatherData,
      getPlaceData: getPlaceData,
    });

    function getWeatherData() {
      return $http.get('/weatherData')
      // handle success
      .success(function (data) {
        console.log('wat data we recieve??',data);
      })
      // handle error
      .error(function (data) {
       console.error(data);
      });
    }

    function getPlaceData(place) {
      return $http.post('/placeData',
        {place: place})
      // handle success
      .success(function (data) {
        console.log('wat data we recieve??',data);
      })
      // handle error
      .error(function (data) {
        console.error(data);
      });
    }


}]);
angular.module('WeatherSearchService',[])
.factory('WeatherSearchService',
  ['$http',
  function ($http) {

    return ({
      getWeatherData: getWeatherData,
    });

    function getWeatherData() {
      return $http.get('/weatherData')
      // handle success
      .success(function (data) {
        console.log('wat data we recieve??',data);
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

}]);
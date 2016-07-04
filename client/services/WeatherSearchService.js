angular.module('WeatherSearchService',[])
.factory('WeatherSearchService',
  ['$http',
  function ($http) {

    return ({
      getWeatherCurrently: getWeatherCurrently,
      getPlaceData: getPlaceData,
    });

    function getWeatherCurrently(place) {
      return $http.post('/weather/currently',
        { place: place })
      // handle error
      .error(function (data) {
       console.error(data);
      });
    }

    function getWeatherHistory(place) {
      return $http.post('/weather/history',
        { place: place })
      // handle error
      .error(function (data) {
       console.error(data);
      });
    }

    function getPlaceData(place) {
      return $http.post('/placeData',
        { place: place })
      // handle success
      // .success(function (resp) {
      //   return resp.data;
      // })
      // handle error
      .error(function (data) {
        console.error(data);
      });
    }


}]);
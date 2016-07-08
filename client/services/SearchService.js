angular.module('SearchService',[])
.factory('SearchService',['$http', SearchServiceFunc ]);

function SearchServiceFunc ($http) {
  var search = null;

  return ({
    getWeatherCurrently: getWeatherCurrently,
    getWeatherHistory: getWeatherHistory,
    getPlaceData: getPlaceData,
    getPastSearches: getPastSearches,
    getSearch: getSearch,
    setSearch: setSearch,
    addDaysOfWeek: addDaysOfWeek,
    constructMapUrl: constructMapUrl,
    convertTimeStamp: convertTimeStamp
  });

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

  function addDaysOfWeek( weatherForecastArr ) {
    //get the current day
    var day = new Date().getDay();
    var daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    for( var i = 0; i < weatherForecastArr.length; i++ ){
     weatherForecastArr[i].day = daysOfWeek[ ( i+day+1 ) % 7 ];
    }
    return weatherForecastArr;
  }

  function getPastSearches() {
    return $http.get('/user/pastSearches')
    .error(function (data) {
     console.error(data);
    });
  }

  function constructMapUrl( lat,lng, key ){
    var urlbase = "https://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lng+"&zoom=8&size=400x400&markers=color:blue%7Clabel:S";     
    var mapUrl = urlbase + "&markers=color:red%7Clabel:*%7C"+lat+","+lng + '&key='+key;
    return mapUrl;
  }

  function convertTimeStamp( timestamp ){
    var date = new Date(timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var datevalues = [
       months[date.getMonth()],
       date.getDate()
    ];
    return datevalues.join('-');
  }

}
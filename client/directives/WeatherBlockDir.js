angular.module('WeatherBlockDir',[])
.directive('weatherBlock', function() {
     return {
      restrict:'E',
      scope: {
         weather: '=weather',
      },
        templateUrl: './views/weatherBlock.html',
    }
});



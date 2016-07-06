var myApp = angular.module('myApp',[
  'ngRoute',
  'WeatherCtrl',
  'PastSearchesCtrl',
  'WeatherSearchService',
  'angular-skycons'
]);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/weather.html',
      controller: 'weatherController',
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/pastSearches', {
      templateUrl: 'views/pastSearches.html',
      controller: 'pastSearchesController',
      access: {restricted: true}
    })
    .otherwise({
      redirectTo: '/',
      access: {restricted: true}
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});

myApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});


myApp.directive('weatherBlock', function() {
     return {
      restrict:'E',
      scope: {
         weather: '=weather'
      },
        templateUrl: './views/weatherBlock.html',
    }
});

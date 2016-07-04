var myApp = angular.module('myApp',[
  'ngRoute',
  'WeatherCtrl',
  'PastSearchesCtrl',
  'WeatherSearchService'
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
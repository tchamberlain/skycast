angular.module('myApp',[
  'ngRoute',
  'LoginCtrl',
  'LogoutCtrl',
  'RegisterCtrl',
  'WeatherCtrl',
  'PastSearchesCtrl',
  'SearchService',
  'AuthService',
  'LoadingDir',
  'WeatherBlockDir',
  'angular-skycons',
  'chart.js'
  ])
.config(function ($routeProvider) {
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
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerController',
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
})
.run(function ($rootScope, $location, $route, AuthService) {
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

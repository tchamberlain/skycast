angular.module('myApp').controller('logoutController',['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    // call logout from service
    AuthService.logout()
      .then(function () {
        $location.path('/login');
      });
}]);
angular.module('LoginCtrl',[]).controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.showLoginForm = true;
    
    $scope.switchForms = function () {
      $location.path('/register');
    }

    $scope.login = function () {
      // initial value
      $scope.error = false;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.loginForm = {};
        });

    };

}]);


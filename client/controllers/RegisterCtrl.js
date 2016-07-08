angular.module('RegisterCtrl', []).controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.switchForms = function () {
          $location.path('/login');
        }

    $scope.register = function () {

      // initial values
      $scope.error = false;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $scope.registerForm = {};
          AuthService.login($scope.registerForm.username, $scope.registerForm.password)
        })
        .then(function () {
          $location.path('/');
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "There was an error with your username. Please enter a different one";
          $scope.registerForm = {};
        })
    };

}])


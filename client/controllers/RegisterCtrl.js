angular.module('RegisterCtrl', []).controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $scope.disabled = false;
          $scope.registerForm = {};
          AuthService.login($scope.registerForm.username, $scope.registerForm.password)
        })
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          console.log('are we here???')
          $scope.error = true;
          $scope.errorMessage = "That username is taken! Please enter a different one";
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // .then(function(){
        // })
        // .then(function () {
        //   $location.path('/');
        //   $scope.disabled = false;
        //   $scope.loginForm = {};
        // })

    };

}]);
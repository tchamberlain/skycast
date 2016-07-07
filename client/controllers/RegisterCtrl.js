angular.module('RegisterCtrl', []).controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
       $scope.series = ['High Temp', 'Low Temp'];
       $scope.data = [
         [65, 59, 80, 81, 56, 55, 40],
         [28, 48, 40, 19, 86, 27, 90]
       ];
       $scope.onClick = function (points, evt) {
         console.log(points, evt);
       };



    $scope.switchForms = function () {
          $location.path('/login');
        }

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
          $scope.error = true;
          $scope.errorMessage = "There was an error with your username. Please enter a different one";
          $scope.disabled = false;
          $scope.registerForm = {};
        })
    };

}])


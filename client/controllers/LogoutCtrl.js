angular.module('LogoutCtrl',[])
.controller('logoutController',['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
   
   $scope.logout = function () {
     AuthService.logout()
       .then(function () {
         $location.path('/login');
       });
   };

   $scope.isLoggedIn = function () {
     return AuthService.isLoggedIn() && ($location.path()!=='/login');
   }

}]);
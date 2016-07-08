angular.module('LoadingDir',[])
.directive('loading',   ['$http' ,function ($http){
  return {
    restrict: 'A',
    link: function (scope, elm, attrs){
      scope.isLoading = function () {
          return $http.pendingRequests.length > 1;
      };
      scope.$watch(scope.isLoading, function (v){
        if(v){
            elm.show();
        }else{
          elm.hide();
        }
      });
    }
  };
}]);
angular.module('PastSearchesCtrl',[])
.controller('pastSearchesController',['$scope','WeatherSearchService','$location',
  function ( $scope, WeatherSearchService, $location, $q ) {

   $scope.pastSearches = [];
    var getPastSearches = function(){
      WeatherSearchService.getPastSearches()
      .then(function(resp){
        $scope.pastSearches = resp.data.pastSearches;
        if( $scope.pastSearches.length === 0 ){
          $scope.noSearches = true;
        }
        $scope.username = resp.data.username;
      });      
    }
    $scope.viewSearch = function( search ){
      WeatherSearchService.setSearch( search );
      $location.path('/');
    }

   getPastSearches();


}]);
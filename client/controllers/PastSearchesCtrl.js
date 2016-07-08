angular.module('PastSearchesCtrl',[])
.controller('pastSearchesController',['$scope','SearchService','$location',
  function ( $scope, SearchService, $location, $q ) {

   $scope.pastSearches = [];
   $scope.routeToSearch = routeToSearch;
    
    getPastSearches();
    
    function getPastSearches(){
    SearchService.getPastSearches()
      .then(function(resp){
        $scope.pastSearches = resp.data.pastSearches;
        $scope.username = resp.data.username;
        // If the user has no searches, display a message 
        if( $scope.pastSearches.length === 0 ){
          $scope.noSearches = true;
        }
      });      
    }
    
    function routeToSearch( search ){
      SearchService.setSearch( search );
      $location.path('/');
    }

}]);
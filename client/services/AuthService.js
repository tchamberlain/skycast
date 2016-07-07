angular.module('AuthService',[])
.factory('AuthService',['$q', '$http', AuthServiceFunc ]);

function AuthServiceFunc ($q, $http) {

  var user = null;

  return ({
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register
  });

  function isLoggedIn() {
    if(user) {
      return true;
    } else {
      return false;
    }
  }

  function getUserStatus() {
    return $http.get('/user/status')
    .success(function (data) {
      if(data.status){
        user = true;
      } else {
        user = false;
      }
    })
    .error(function (data) {
      user = false;
    });
  }

  function login(username, password) {
    var deferred = $q.defer();

    $http.post('/user/login',
      {username: username, password: password})
      .success(function (data, status) {
        if(status === 200 && data.status){
          user = true;
          deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      .error(function (data) {
        user = false;
        deferred.reject();
      });

    return deferred.promise;
  }

  function logout() {
    var deferred = $q.defer();

    $http.get('/user/logout')
        .success(function (data) {
        user = false;
        deferred.resolve();
      })
      .error(function (data) {
        user = false;
        deferred.reject();
      });

    return deferred.promise;
  }

  function register(username, password) {
    var deferred = $q.defer();

    $http.post('/user/register',
      {username: username, password: password})
        .success(function (data, status) {
        if(status === 200 && data.status){
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      .error(function (data) {
        deferred.reject();
      });

    return deferred.promise;
  }
}
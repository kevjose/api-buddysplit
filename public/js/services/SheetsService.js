appServices.factory('SheetsService', function($http, $q, Options) {
  return {
    create: function() {
      var deferred = $q.defer();

      $http.post(Options.baseUrl + '/sheets', {}).success(function(data) {
        deferred.resolve(data);
      }).error(function(data, status) {
        deferred.reject(data);
      });

      return deferred.promise;
    },

    read: function(id) {
      var deferred = $q.defer();

      $http.get(Options.baseUrl + '/sheets/' + id).success(function(data) {
        deferred.resolve(data);
      }).error(function(data, status) {
        deferred.reject(data);
      });

      return deferred.promise;
    },

    update: function(sheet) {
      var deferred = $q.defer();

      $http.put(Options.baseUrl + '/sheets', sheet).success(function(data) {
        deferred.resolve(data);
      }).error(function(data, status) {
        deferred.reject(data);
      });

      return deferred.promise;
    }
  }
});
appControllers.controller('HomeCtrl', ['$scope', '$http', '$location', '$state', 'SheetsService',
	function HomeCtrl($scope, $http, $location, $state, SheetsService) {

		$scope.creationInProgress = false;

		$scope.createSheet = function() {
			$scope.creationInProgress = true

			SheetsService.create().then(function(data) {
				return $state.go('sheets.overview', {id: data.sheet_id});
			});
		};
	}
]);
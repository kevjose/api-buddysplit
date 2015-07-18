appControllers.controller('SheetsCtrl', ['$scope', '$location', '$state', '$stateParams', 'SheetsService', 'FriendsService', 'ExpensesService', 'BalanceService',
	function SheetsCtrl($scope, $location, $state, $stateParams, SheetsService, FriendsService, ExpensesService, BalanceService) {
		$scope.sheet = {friends:[], expenses: []};
		$scope.url = $location.absUrl();
		var sheet_id = $stateParams.id;

		SheetsService.read(sheet_id).then(function(data) {
			$scope.sheet = data;
		})

		$scope.$watch('sheet.friends', function (newVal, oldVal) {
		    $scope.balance = BalanceService.compute($scope.sheet);
		}, true);

		$scope.$watch('sheet.expenses', function (newVal, oldVal) {
		    $scope.balance = BalanceService.compute($scope.sheet);
		}, true);

		//Date picker
		$scope.toggleMin = function() {
	    	$scope.minDate = $scope.minDate ? null : new Date();
	  	};
	  	$scope.toggleMin();

	  	$scope.today = function() {
		    $scope.dt = new Date();
	  	};
	  	$scope.today();

		$scope.saveSheetName = function(name) {
			if (name != null && name.trim().length > 0) {

				SheetsService.update({_id: sheet_id, name: name.trim()}).then(function(data) {
					$scope.sheet.name = name.trim();
					return $state.go('sheets.overview', {id: $scope.sheet._id});
				});
			}
		}

		$scope.addFriend = function(name) {
			if (name != null && name.trim().length > 0) {
				var friend = {name: name.trim(), sheet_id: sheet_id};

				FriendsService.create(friend).then(function(data) {
					$scope.sheet.friends.push(data);
				});
			}
		}

		$scope.showFriendName = function(friendId) {
			var friends = $scope.sheet.friends;
			for (var i in friends) {
				if (friends[i]._id == friendId) {
					return friends[i].name;
				}
			}
		}

		$scope.showFriendNames = function(friendIds) {
			var friendNames = '';
			for (var i in friendIds) {
				friendNames += $scope.showFriendName(friendIds[i]);
				if (i < friendIds.length - 1) {
					friendNames += ', ';
				}
			}

			return friendNames;
		}

		$scope.showEditFriend = function(friend) {
			var friends = $scope.sheet.friends;
			for (var i in friends) {
				if (friends[i]._id == friend._id) {
					$scope.sheet.friends[i].editable = true;
				}
				else {
					if (friends[i].editable) {
						$scope.sheet.friends[i].editable = false;
					}
				}
			}
		}

		$scope.editFriend = function(newname, friend) {
			var friends = $scope.sheet.friends;

			if (newname == null || newname.trim() == friend.name || newname.trim().length == 0) {
				for (var i in friends) {
					$scope.sheet.friends[i].editable = false;
				}
				return ;
			}
			
			for (var i in friends) {
				if (friends[i]._id == friend._id) {
					
					FriendsService.update({sheet_id: sheet_id, _id: friend._id, name: newname.trim()}).then(function(data) {
						$scope.sheet.friends[i].name = newname.trim();
						$scope.sheet.friends[i].editable = false;
					});

					break ;
				}
			}
		}

		$scope.deleteFriend = function(friend) {
			//wait api (update all expenses & remove friend) 

			FriendsService.delete(sheet_id, friend._id).then(function(data) {
				var friends = $scope.sheet.friends;
				for (var i in friends) {
					if (friends[i]._id == friend._id) {
						$scope.sheet.friends.splice(i, 1);
						break ;
					}
				}

				//forloop on expenses to remove expenses paid_by friend_id
				var expenses = $scope.sheet.expenses;
				for (var i in expenses) {
					if (expenses[i].paid_by == friend._id) {
						$scope.sheet.expenses.splice(i, 1);
					}
				}

				//and to remove friend_id from paid_for in expenses
				for (var i in expenses) {
					if (expenses[i].paid_by != friend._id) {
						var indexInPaidFor = expenses[i].paid_for.indexOf(friend._id);
						if (indexInPaidFor > -1) {
							$scope.sheet.expenses[i].paid_for.splice(indexInPaidFor, 1);
						}
					}
				}
			});
		}

		$scope.addExpense = function(expense, dt) {
			var newExpense = expense;
			newExpense.sheet_id = sheet_id;
			newExpense.date = dt;

			ExpensesService.create(newExpense).then(function(data) {
				$scope.sheet.expenses.push(data);
				return $state.go('sheets.expenses', {id: $scope.sheet._id});
			});
		}

		$scope.deleteExpense = function(expense) {
			ExpensesService.delete(sheet_id, expense._id).then(function(data) {
				var expenses = $scope.sheet.expenses;
				for (var i in expenses) {
					if (expenses[i]._id == expense._id) {
						$scope.sheet.expenses.splice(i, 1);
						break ;
					}
				}
			});
		}
	}
]);

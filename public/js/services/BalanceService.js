appServices.factory('BalanceService', function() {
	return {
		compute: function(sheet) {
			var friends = sheet.friends;
			var expenses = sheet.expenses;
			var balance = [];

			//Create initial array containing for each friend, the list of other friends with amount = 0
			for (var i in friends) {
				balance[i] = {_id: friends[i]._id, name: friends[i].name, owes: []};
				for (var j in friends) {
					if (i != j) {
						balance[i].owes.push({_id: friends[j]._id, name: friends[j].name, amount: 0});
					}
				}
			}

			//Compute the amount owes by each friend to each others.
			for (var i in expenses) {
				var expense = expenses[i];
				var amountPerFriend = expense.amount / expense.paid_for.length;


				for (var j in balance) {

					if (balance[j]._id == expense.paid_by) {
						for (var k in expense.paid_for) {
							for (var l in balance[j].owes) {
								if (balance[j].owes[l]._id == expense.paid_for[k]) {
									balance[j].owes[l].amount -= amountPerFriend;
								}
							}
						}
					}
					else {
						for (var k in expense.paid_for) {
							if (balance[j]._id == expense.paid_for[k]) {
								for (var l in balance[j].owes) {
									if (balance[j].owes[l]._id == expense.paid_by) {
										balance[j].owes[l].amount += amountPerFriend;
										break ;
									}
								}
							}
						}
					}
				}
			}

			//Remove negative amount
			for (var i in balance) {
				for (var j in balance[i].owes) {
					if (balance[i].owes[j].amount < 0) {
						balance[i].owes[j].amount = 0;
					}
				}
			}

			return balance;
		}

	};
});
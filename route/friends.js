var db = require('../config/database.js');
var Async = require('async');

exports.create = function(req, res) {
	var friend = req.body;

	if (friend == null || friend.sheet_id == null || friend.name == null 
		|| friend.name.trim().length == 0) {
		return res.send(400);
	}

	var friendEntry = new db.FriendsModel();
	friendEntry.sheet_id = friend.sheet_id;
	friendEntry.name = friend.name.trim();

	friendEntry.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, friendEntry);
	});
}

exports.readAllFromSheet = function(req, res) {
	var sheet_id = req.params.sheet_id;

	if (sheet_id == null) {
		return res.send(400);
	}

	var query = db.FriendsModel.find({sheet_id: sheet_id});
	query.exec(function(err, friends) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, friends);
	});
}

exports.read = function(req, res) {
	var sheet_id = req.params.sheet_id;
	var friend_id = req.params.id;

	if (sheet_id == null || friend_id == null) {
		return res.send(400);
	}

	var query = db.FriendsModel.findOne({sheet_id: sheet_id, _id: friend_id});
	query.exec(function(err, friend) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, friend);
	});
}

exports.update = function(req, res) {
	var friend = req.body;
	if (friend == null || friend.sheet_id == null || friend._id == null
		|| friend.name == null || friend.name.trim().length == 0) {

		res.send(400);
	}

	updateFriend = {name: friend.name.trim()};

	db.FriendsModel.update({sheet_id: friend.sheet_id, _id: friend._id},
		updateFriend,
		function(err, nbRows, raw) {
			if (err) {
				return res.send(400);
			}

			return res.send(200);
		}
	);
}

exports.delete = function(req, res) {
	var sheet_id = req.params.sheet_id;
	var friend_id = req.params.id;

	if (sheet_id == null || friend_id == null) {
		return res.send(400);
	}

	Async.series(
		[
			//Remove friend
			function(callback) {
				var query = db.FriendsModel.findOne({sheet_id: sheet_id, _id: friend_id});
				query.exec(function(err, friend) {
					if (err) {
						callback(err);
					}

					if (friend != null) {
						friend.remove();
						callback(null);
					} else {
						callback("friend not found");
					}
				});
			},

			//Remove expenses where friend = paid_by
			function(callback) {
				var query = db.ExpensesModel.find({sheet_id: sheet_id, paid_by: friend_id});
				query.exec(function(err, expenses) {
					if (err) {
						callback(err);
					}

					if (expenses != null) {
						for (var i in expenses) {
							expenses[i].remove();
						}

						callback(null);
					} else {
						callback(null);
					}
				});
			},

			//Find expenses where friend is in paid_for, in order to remove it from paid_for and update expenses
			function(callback) {
				var query = db.ExpensesModel.find({sheet_id: sheet_id, paid_for: friend_id});
				query.exec(function(err, expenses) {
					if (err) {
						callback(err);
					}

					if (expenses != null) {
						for (var i in expenses) {
							var indexInPaidFor = expenses[i].paid_for.indexOf(friend_id);
							if (indexInPaidFor > -1) {
								expenses[i].paid_for.splice(indexInPaidFor, 1);

								expenses[i].save(function(err) {
									if (err) {
										callback(err);
									}
								});
							}
						}

						callback(null);
					} else {
						callback(null);
					}
				});
			}
		],

		//Final Callback
		function(err, results) {
			if (err) {
				return res.send(400);
			}

			return res.send(200);
		}
	);
}
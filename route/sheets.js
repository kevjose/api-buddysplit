var db = require('../config/database.js');
var Async = require('async');

exports.create = function(req, res) {
	var sheetEntry = new db.SheetsModel();
	sheetEntry.name = 'My Shared Sheet';

	sheetEntry.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, {sheet_id: sheetEntry._id});
	});
}

/* Read from sheets, friends and expenses */
exports.read = function(req, res) {
	var sheet_id = req.params.id;
	if (sheet_id == null) {
		return res.send(400);
	}

	Async.parallel([

		//Read sheets data from Sheets
		function(callback) {
			var query = db.SheetsModel.findOne({_id: sheet_id});
			query.exec(function(err, sheet) {
				if (err) {
		  			callback(err);
		  		}

		  		callback(null, sheet);
		  	});
		},

		//Read friends data from Friends
		function(callback) {
			var query = db.FriendsModel.find({sheet_id: sheet_id});
			query.exec(function(err, friends) {
				if (err) {
		  			callback(err);
		  		}

		  		callback(null, friends);
		  	});
		},

		//Read expenses data from Expenses
		function(callback) {
			var query = db.ExpensesModel.find({sheet_id: sheet_id});
			query.sort('-date');
			query.exec(function(err, expenses) {
				if (err) {
		  			callback(err);
		  		}

		  		callback(null, expenses);
		  	});
		}
	],

	//Compute all results
	function(err, results) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		//results contains [sheets, Friends, Expenses]
		var sheetData = {_id: results[0]._id, name: results[0].name};
		sheetData.friends = results[1] || [];
		sheetData.expenses = results[2] || [];

		return res.send(200, sheetData);
	});
}

exports.update = function(req, res) {
	var sheet = req.body;
	
	if (sheet == null || sheet._id == null || sheet.name == null
		|| sheet.name.trim().length == 0) {

		return res.send(400);
	}

	updateSheet = {name: sheet.name.trim()};

	db.SheetsModel.update({_id: sheet._id}, updateSheet, function(err, nbRows, raw) {
		if (err) {
			return res.send(400);
		}

		return res.send(200);
	});
}
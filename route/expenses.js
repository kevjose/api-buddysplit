var db = require('../config/database.js');

exports.create = function(req, res) {
	var expense = req.body;

	if (expense == null || expense.sheet_id == null || expense.name == null 
		|| expense.name.trim().length == 0 || expense.paid_by == null
		|| expense.paid_by.length == 0 || expense.paid_for == null
		|| expense.paid_for.length == 0 || expense.amount == null
		|| expense.date == null) {

		return res.send(400);
	}

	var expenseEntry = new db.ExpensesModel();
	expenseEntry.sheet_id = expense.sheet_id;
	expenseEntry.name = expense.name.trim();
	expenseEntry.date = expense.date;
	expenseEntry.amount = expense.amount;
	expenseEntry.paid_by = expense.paid_by;
	expenseEntry.paid_for = expense.paid_for;

	expenseEntry.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, expenseEntry);
	});
}

exports.readAllFromSheet = function(req, res) {
	var sheet_id = req.params.sheet_id;

	if (sheet_id == null) {
		return res.send(400);
	}

	var query = db.ExpensesModel.find({sheet_id: sheet_id});
	query.sort('-date');
	query.exec(function(err, expenses) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, expenses);
	});
}

exports.read = function(req, res) {
	var sheet_id = req.params.sheet_id;
	var expense_id = req.params.id;

	if (sheet_id == null || friend_id == null) {
		return res.send(400);
	}

	var query = db.ExpensesModel.findOne({sheet_id: sheet_id, _id: expense_id});
	query.exec(function(err, expense) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, expense);
	});
}

exports.update = function(req, res) {
	return res.send(400, "Not implemented yet");
}

exports.delete = function(req, res) {
	var sheet_id = req.params.sheet_id;
	var expense_id = req.params.id;

	if (sheet_id == null || expense_id == null) {
		return res.send(400);
	}

	var query = db.ExpensesModel.findOne({sheet_id: sheet_id, _id: expense_id});
	query.exec(function(err, expense) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		if (expense != null) {
			expense.remove();
			return res.send(200);
		} else {
			return res.send(400);
		}
	});
}
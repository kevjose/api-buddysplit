var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoUrl = 'mongodb://localhost/splitly';
var mongoOptions = {};
var Types = mongoose.Types;

mongoose.connect(mongoUrl, mongoOptions, function (err, res) {
    if (err) { 
        console.log('[DB] Connection failed to ' + mongoUrl + '. ' + err);
    } else {
        console.log('[DB] Successfully connected to: ' + mongoUrl);
    }
});


// Define Schemas
var Sheets = new Schema({
	name: { type: String, required: true },
	created: { type: Date, default: Date.now }
});

var Friends = new Schema({
	sheet_id: { type: Schema.Types.ObjectId, required: true },
	name: { type: String, required: true }
});

var Expenses = new Schema({
	sheet_id: { type: Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
	date: { type: Date, required: true },
	amount: { type: Number, required: true },
	paid_by: { type: Schema.Types.ObjectId, required: true },
	paid_for: [ { type: Schema.Types.ObjectId, required: true } ]
});

// Export Models
exports.SheetsModel = mongoose.model('Sheets', Sheets);
exports.FriendsModel = mongoose.model('Friends', Friends);
exports.ExpensesModel = mongoose.model('Expenses', Expenses);
exports.Types = Types;
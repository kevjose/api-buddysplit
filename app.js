//express app
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var db = require('./config/database');

//Configuration
//app.set('port', (process.env.PORT || 3009));
app.listen(process.env.PORT || 3009);

var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));  

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});


//Routes
var routes = {};
routes.sheets = require('./route/sheets.js');
routes.friends = require('./route/friends.js');
routes.expenses = require('./route/expenses.js');
routes.stats = require('./route/stats.js');


//Routing URLs
app.post('/sheets', routes.sheets.create);
app.get('/sheets/:id', routes.sheets.read);
app.put('/sheets', routes.sheets.update);

//sheet_id must always be present
app.post('/friends', routes.friends.create);
app.get('/friends/:sheet_id', routes.friends.readAllFromSheet);
app.get('/friends/:sheet_id/:id', routes.friends.read);
app.put('/friends', routes.friends.update);
app.delete('/friends/:sheet_id/:id', routes.friends.delete);

app.post('/expenses', routes.expenses.create);
app.get('/expenses/:sheet_id', routes.expenses.readAllFromSheet);
app.get('/expenses/:sheet_id/:id', routes.expenses.read);
app.put('/expenses', routes.expenses.update); //todo to finish
app.delete('/expenses/:sheet_id/:id', routes.expenses.delete);

app.get('/stats', routes.stats.read);


console.log('[INFO] Your project API started on port 3009');
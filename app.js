var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var db = require('./config/database');

//Configuration
app.set('port', (process.env.PORT || 3009));
app.listen(process.env.PORT || 3009);
app.use(bodyParser());
app.use(morgan());

app.all('*', function(req, res, next) {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	if ('OPTIONS' == req.method) return res.send(200);
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
"use strict";

var process = require('process');
var debug = require('debug')('main');
var express = require('express');
var cors = require('cors');
var path = require('path');
// "serve-favicon": "~2.2.0"
//var favicon = require('serve-favicon');

// "morgan": "~1.5.0"
var logger = require('morgan');

// "cookie-parser": "~1.3.3",
var cookieParser = require('cookie-parser');

// "body-parser": "~1.10.0",
var bodyParser = require('body-parser');

var apiv1 = require('./routes/apiv1');
var apiv2 = require('./routes/apiv2');

var rvk = require('./lib/rvk');

var uri = process.env.URI ||
	process.argv[2];

var pathRoot = process.env.VIRTUAL_PATH || '';

rvk.importXml(uri);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
//app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(pathRoot, express.static(path.join(__dirname, 'public')));
app.use(pathRoot + '/doc', express.static(path.join(__dirname, 'apidoc')));
app.use(pathRoot + '/api/v1', apiv1);
app.use(pathRoot + '/api/v2', apiv2);

app.get(pathRoot + '/', function(req, res, next) {
	res.redirect(pathRoot + '/doc');
})
/// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.send(err.toString());
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send(err.message);
});

module.exports = app;

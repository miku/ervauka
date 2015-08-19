"use strict";

var process = require('process');
var debug = require('debug')('main');
var express = require('express');
var cors = require('cors');
var path = require('path');
var session = require('express-session');

// "morgan": "~1.5.0"
var logger = require('morgan');

// "body-parser": "~1.10.0",
var bodyParser = require('body-parser');

var apiv1 = require('./routes/apiv1');
var apiv2 = require('./routes/apiv2');

var rvk = require('./lib/rvk');

var uri = process.env.URI ||
	process.argv[2];

rvk.importXml(uri);

var app = express();

app.use(cors());

switch (app.get('env')) {
	case 'test':
		break;
	case 'development':
		app.use(logger('dev'));
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.send(err.toString());
		});
		break;
	default:
		app.use(logger('combined'));
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.send(err.message);
		});
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	resave: false,
	rolling: true,
	secret: 'changeit',
	saveUninitialized: false,
	cookie: {secure: false}
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', express.static(path.join(__dirname, 'apidoc')));
app.use('/api/v1', apiv1);
app.use('/api/v2', apiv2);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

module.exports = app;

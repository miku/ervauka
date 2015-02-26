"use strict";

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

//rvk.importXml('https://speicherwolke.uni-leipzig.de/public.php?service=files&t=65da0cd17ebba83085a69ba263502fea&download');
rvk.importXml('file:///home/seltmann/projects/nodejs/ervauka/rvk.xml');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', express.static(path.join(__dirname, 'apidoc')));
app.use('/api/v1', apiv1);
app.use('/api/v2', apiv2);
app.get('/', function(req, res, next) {
	res.redirect('/doc');
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

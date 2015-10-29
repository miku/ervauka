"use strict";

var debug = require('debug')('apiv1');
var express = require('express');
var router = express.Router();
var query = require('../lib/rvk').Query;

router.post('/getchilds', function(req, res, next) {
	var id = (!req.body.notation_id || req.body.notation_id === 'null') ? undefined : req.body.notation_id;
	var depth = parseInt(req.body.depth) || 0;
	var blacklist = req.session.blacklist || [];

	query(blacklist).getChildTree(id, depth).then(function(data) {
		res.send({
			data: data,
			status: 'OK'
		});
	}, function(err) {
		next(err);
	});

});

router.post('/init', function(req, res, next) {
	debug('init session');
	req.session.blacklist = req.body.blacklist || [] ;
	res.json(req.session.blacklist);
});

module.exports = router;

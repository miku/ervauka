"use strict";

var debug = require('debug')('apiv1');
var express = require('express');
var router = express.Router();
var query = require('../lib/rvk').Query;

/**
 * @api 		{get} 	/api/v1/ Basic information about the api
 * @apiName 	v1
 * @apiGroup 	generic
 */
router.get('/', function (req, res) {
	res.send({
		version: '1',
		documentation: '/apidoc'});
});

router.get('/getchilds', function(req, res, next) {
	var id = (!req.query.notation_id || req.query.notation_id === 'null') ? undefined : req.query.notation_id;
	var depth = parseInt(req.query.depth) || 0;
	var notationsToHide = req.session.notationsToHide || [];

	query(notationsToHide).getChildTree(id, depth).then(function(data) {
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
	req.session.notationsToHide = req.body.notationsToHide || [] ;
	res.json(req.session.notationsToHide);
});

module.exports = router;

"use strict";

var debug = require('debug')('apiv1');
var express = require('express');
var router = express.Router();
var rvk = require('../lib/rvk');

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

/**
 * @api 		{get} 	/api/v1/getchilds/			 	returns the childs
 * @apiParam	{string} id 							the parent id
 * @apiParam	{number} [depth=0]						the depth
 * @apiName 	v1
 * @apiGroup 	generic
 * @apiSuccessExample {json} Success-Response:
 * 	{
 * 		"data": [
 * 			{
 * 				"id":"AA",
 * 				"notation":"AA",
 * 				"title":"Bibliographien der Bibliographien, Universalbibliographien, Bibliothekskataloge, Nationalbibliographien",
 * 				"hasChildren":"4",
 * 				"children":[]
 * 			},
 * 			{
 * 				"id":"AB",
 * 				"notation":"AB",
 * 				"title":"Verzeichnisse amtlicher Druckschriften, Hochschulschriften und Akademieschriften, Serienbibliographien und Zeitschriftenbibliographien",
 * 				"hasChildren":"4",
 * 				"children":[]
 * 			},
 * 			{
 * 				"id":"AC",
 * 				"notation":"AC",
 * 				"title":"Bibliographien und Kataloge besonderer Literaturgattungen",
 * 				"hasChildren":"11",
 * 				"children":[]
 * 			},
 * 		],
 * 		"status":"OK"
 * 	}
 */
router.get('/getchilds', function(req, res, next) {
	var id = (!req.query.notation_id || req.query.notation_id === 'null') ? undefined : req.query.notation_id;
	var depth = parseInt(req.query.depth) || 0;

	rvk.getChildTree(id, depth).then(function(data) {
		res.send({
			data: data,
			status: 'OK'
		});
	}, function(err) {
		next(err);
	});

});



module.exports = router;

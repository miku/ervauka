"use strict";

var debug = require('debug')('apiv2');
var express = require('express');
var router = express.Router();
var rvk = require('../lib/rvk');

/**
 * @api 		{get} 	/api/v2/ Basic information about the api
 * @apiName 	v2
 * @apiGroup 	generic
 */
router.get('/', function (req, res) {
	res.send({
		version: '2',
		documentation: '/apidoc'});
});

/**
 * @api 		{get} 	/api/v2/getchilds/			 	returns the childs
 * @apiParam	{string} id 							the parent id
 * @apiParam	{number} [depth=0]						the depth
 * @apiName 	v2
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
router.get('/getchilds/:id/:depth?', function(req, res) {
	console.log(req.params.id);
	res.send(rvk.getChildTree(req.params.id, 0));
});



module.exports = router;

"use strict";

var debug = require('debug')('rvk');
var xmljs = require('libxmljs');
var request = require('request');
var fs = require('fs');
var url = require('url');
var sprintf = require('sprintf-js').sprintf;
var defer = require('q').defer;

var rvk = function() {

	var rvkXml,
		notationAttributePattern = '//node[@notation="%s"]/children/node',
		rootNode = '/classification_scheme/node',
		cache = {children: [], xpath: []};

	var importXml = function(location) {

		var u = url.parse(location)

		function parseXml(data) {
			debug('Parsing XML string ...');
			rvkXml = xmljs.parseXmlString(data);
			debug('Parsing finished')
		}

		debug('Requesting XML content...')
		if (u.protocol === 'http:' || u.protocol === 'http:') {
			request.get(u, function(err, response, data) {
				if (err || response.statusCode !== 200) {
					return debug(err)
				}
				debug(sprintf('XML content provided by "%s" successfully read', u.path));
				parseXml(data);
			});
		} else if (u.protocol === 'file:') {
			fs.readFile(u.path, 'utf8', function(err, data) {
				if (err) {
					return debug(err)
				}
				debug(sprintf('XML content provided by "%s" successfully read', u.path));
				parseXml(data);
			});
		}
	};

	var _getChildren = function(parent) {
		var deferred = defer();

		var xpath = parent ? sprintf(notationAttributePattern, parent) : rootNode;

		deferred.resolve(rvkXml.find(xpath));

		return deferred.promise;
	};

	var getChildTree = function(parent, depth) {

		var deferred = defer();

		var result = [];

		var childrenToProcess;

		debug(sprintf('processing children for "%s"', parent));

		_getChildren(parent).then(function (children) {
			childrenToProcess=children.length;

			debug(sprintf('%d children found for "%s"', childrenToProcess, parent));

			children.forEach(function(child) {
				_processNode(child, depth).then(function(node) {
					result.push(node);
					childrenToProcess--;
					if (childrenToProcess === 0) {
						deferred.resolve(result);
					}
				});
			});
		}, function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

	var _processNode = function(node, depth) {
		var deferred = defer();

		var id = node.attr('notation').value();

		debug(sprintf('processing node "%s"', id));

		var result = {
			id: id,
			notation: node.attr('notation').value(),
			title: node.attr('benennung').value(),
			hasChildren: node.find('children').length
		};

		if (depth === 0 || result.hasChildren === 0) {
			result.children = [];
			deferred.resolve(result);
		} else {
			getChildTree(result.id, depth - 1).then(function (children) {
				result.children = children;
				deferred.resolve(result);
			}, function (err) {
				deferred.reject(err);
			});
		}

		return deferred.promise;
	};

	return {
		getChildTree: getChildTree,
		importXml: importXml
	};
}

module.exports = rvk();

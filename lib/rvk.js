"use strict";

var debug = require('debug')('rvk');
var xmljs = require('libxmljs');
var request = require('request');
var fs = require('fs');
var url = require('url');
var sprintf = require('sprintf-js').sprintf;
var defer = require('q').defer;

function RvkXml() {

	var rvkXml,
		childNodesPath = '/children/node',
		rootNode = '/classification_scheme/node',
		cache = {children: [], xpath: []};

	function importXml(location) {

		var deferred = defer();
		rvkXml = deferred.promise;

		function parseXml(data) {
			debug('Parsing XML string ...');
			deferred.resolve(xmljs.parseXmlString(data));
			debug('Parsing finished')
		}

		try {
			var u = url.parse(location);
			debug('Requesting XML content...');

			if (u.protocol === 'http:' || u.protocol === 'https:') {
				request.get({
					uri: u.href,
					encoding: null
				}, function (err, response, data) {
					if (err || response.statusCode !== 200) {
						throw new Error(err);
					}
					debug(sprintf('XML content provided by "%s" successfully read', u.href));
					parseXml(data);
				});
			} else if (u.protocol === 'file:') {
				fs.readFile(u.path, function (err, data) {
					if (err) {
						throw new Error(err);
					}
					debug(sprintf('XML content provided by "%s" successfully read', u.path));
					parseXml(data);
				});
			} else {
				throw new Error(sprintf('no suitable content location provided: "%s". has to be either http:, https: or file:', u.protocol));
			}
		} catch (err) {
			deferred.reject(err);
		}
	}

	function _getChildren(xpath) {
		var deferred = defer();

		rvkXml.then(function(data) {
			try {
				var children = data.find(xpath);

				if (children.length > 0) {
					deferred.resolve(children);
				} else {
					throw new Error('no children found');
				}
			} catch (err) {
				deferred.reject(err)
			}
		},
		function(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}

	function getChildTree(parent, depth) {

		var deferred = defer();

		var result = [];

		var childrenToProcess;

		var xpath = parent ? parent + childNodesPath : rootNode;

		debug(sprintf('processing children for "%s"', parent));

		_getChildren(xpath).then(function (children) {
			childrenToProcess = children.length;

			debug(sprintf('%d children found for "%s"', childrenToProcess, xpath));

			children.forEach(function (child) {
				_processNode(xpath, child, depth).then(function (node) {
					result.push(node);
					childrenToProcess--;
					if (childrenToProcess === 0) {
						deferred.resolve(result);
					}
				},
				function (err) {
					deferred.reject(err);
				});
			});
		}, function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}

	function _processNode(parent, node, depth) {
		var deferred = defer();

		try {
			var notation = node.attr('notation').value();

			var id = sprintf("%s[@notation='%s']", parent, notation);

			debug(sprintf('processing node "%s"', id));

			var result = {
				id: id,
				notation: notation,
				title: node.attr('benennung').value(),
				hasChildren: node.find('children').length
			};
		} catch (err) {
			deferred.reject(err);
		}

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
	}

	return {
		getChildTree: getChildTree,
		importXml: importXml
	};
}

module.exports = RvkXml();

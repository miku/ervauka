"use strict"

var xmljs = require('libxmljs');
var request = require('request');
var fs = require('fs');
var url = require('url');
var sprintf = require('sprintf-js').sprintf

var rvk = function() {

	var rvkXml,
		notationAttributePattern = '//node[@notation="%s"]/children';

	var importXml = function(location) {

		var u = url.parse(location)

		if (u.protocol === 'http:' || u.protocol === 'http:') {
			request.get(u, function(err, response, data) {
				if (err || response.statusCode !== 200) {
					return console.log(err)
				}
				rvkXml = xmljs.parseXmlString(data);

			});
		} else if (u.protocol === 'file:') {
			fs.readFile(u.path, 'utf8', function(err, data) {
				if (err) {
					return console.log(err)
				}
				rvkXml = xmljs.parseXmlString(data);
			})
		}
	}


	var _getChilds = function(parent) {
		var children = rvkXml.find(sprintf(notationAttributePattern, parent));

		var result = [];

		for (var child in children) {

			result.push({
				id: child.attr('notation').value(),
				notation: child.attr('notation').value(),
				title: child.attr('benennung').value(),
				hasChildren: child.find('children').length
			});
		}

		return result;
	}

	var getChildTree = function(parent, depth) {

		var children = _getChilds(parent);

		for (var i in children) {

			if (depth === 0 || children[i].hasChildren === 0) {
				children[i].children = [];
			} else {
				children[i].children = getChildTree(children[i].notation, depth--)
			}
		}

		return children;
	}

	return {
		getChildTree: getChildTree,
		importXml: importXml
	};
}


module.exports = rvk();

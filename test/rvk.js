"use strict";

//var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');

//chai.use(chaiAsPromised);

//var should = chai.should();

var should = require('should');

describe('Rvk', function () {
	describe('#importXml', function () {
		it('should throw no error', function () {
			var rvk = require('../lib/rvk');
			rvk.importXml('file://' + __dirname + '/rvk.xml');
		})
	});
	describe('#getChildTree (flat)', function () {
		var rvk = require('../lib/rvk'),
			result;
		rvk.importXml('file://' + __dirname + '/rvk.xml');

		beforeEach(function (done) {
			rvk.getChildTree('/classification_scheme/node[@notation=\'A\']', 0).then(function (data) {
				result = data;
				done();
			},function(err) {
				result = err;
				done();
			})
		});
		it('should return correct values', function () {
			result.should.have.length(1);
			result[0].id.should.be.exactly('/classification_scheme/node[@notation=\'A\']/children/node[@notation=\'AA\']');
			result[0].notation.should.be.exactly('AA');
			result[0].title.should.be.exactly('Bibliographien der Bibliographien, Universalbibliographien, Bibliothekskataloge, Nationalbibliographien');
			result[0].hasChildren.should.be.exactly(1);
			result[0].children.should.be.Array;
		});
	});

	describe('#getChildTree (multidimensional)', function () {
		var rvk = require('../lib/rvk'),
			result;
		rvk.importXml('file://' + __dirname + '/rvk.xml');

		beforeEach(function (done) {
			rvk.getChildTree('/classification_scheme/node[@notation=\'A\']', 1).then(function (data) {
				result = data;
				done();
			},function(err) {
				result = err;
				done();
			})
		});
		it('should return 2 level tree', function () {
			result.should.have.length(1);
			result[0].id.should.be.exactly('/classification_scheme/node[@notation=\'A\']/children/node[@notation=\'AA\']');
			result[0].notation.should.exactly('AA');
			result[0].title.should.exactly('Bibliographien der Bibliographien, Universalbibliographien, Bibliothekskataloge, Nationalbibliographien');
			result[0].hasChildren.should.exactly(1);
			result[0].children.should.be.Array;
		});
	});
});

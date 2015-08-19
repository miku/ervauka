"use strict";

var should = require('should');

describe('Rvk', function () {
	describe('#importXml', function () {
		it('should throw no error', function (done) {
			var rvk = require('../lib/rvk');
			rvk.importXml('file://' + __dirname + '/rvk.xml').then(function() {
				done()
			}).catch(done);
		})
	});
	describe('#getChildTree', function () {
		var rvk = require('../lib/rvk')
			, query = rvk.Query()
			;

		rvk.importXml('file://' + __dirname + '/rvk.xml');

		it('should return a one dimensional array', function (done) {
			query.getChildTree('/classification_scheme/node[@notation=\'A\']', 0).then(function (result) {
				result.should.have.length(1);
				result[0].id.should.be.exactly('/classification_scheme/node[@notation=\'A\']/children/node[@notation=\'AA\']');
				result[0].notation.should.be.exactly('AA');
				result[0].title.should.be.exactly('Bibliographien der Bibliographien, Universalbibliographien, Bibliothekskataloge, Nationalbibliographien');
				result[0].hasChildren.should.be.exactly(1);
				result[0].children.should.be.Array;
				done();
			}).catch(done);
		});

		it('should return 2 level tree', function (done) {
			query.getChildTree('/classification_scheme/node[@notation=\'A\']', 1).then(function (result) {
				result.should.have.length(1);
				result[0].id.should.be.exactly('/classification_scheme/node[@notation=\'A\']/children/node[@notation=\'AA\']');
				result[0].notation.should.exactly('AA');
				result[0].title.should.exactly('Bibliographien der Bibliographien, Universalbibliographien, Bibliothekskataloge, Nationalbibliographien');
				result[0].hasChildren.should.exactly(1);
				result[0].children.should.be.Array;
				done();
			}).catch(done);
		});
	});
});

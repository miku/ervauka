"use strict";

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var should = chai.should();

describe('Rvk', function () {
	describe('#importXml', function () {
		it('should throw no error', function () {
			var rvk = require('../lib/rvk');
			rvk.importXml('file://' + __dirname + '/rvk.xml');
		})
	});
	describe('#getChildTree', function () {
		var rvk = require('../lib/rvk');
		rvk.importXml('file://' + __dirname + '/rvk.xml');

		it('should return correct values', function (done) {

			rvk.getChildTree('A', 0).should.eventually.equal('foo');


				/*
				then(function (data) {
						data.should.have.length(1);
						data[0].id.should.be.exactly('AA');
						data[0].notation.should.be.exactly('AA');
						data[0].title.should.be.exactly('Bibliographien der Bibliographien, Universalbibliographien, Bibliothekskataloge, Nationalbibliographien');
						data[0].hasChildren.should.be.exactly(1);
						data[0].children.should.be.instanceof(typeof []);
						done();
					} catch (err) {
						should.not.exist(err);
						done();
					}
				},
				function (err) {
					should.not.exist(err);
					done();
				}); */
		});
		it('should return 2 level tree', function (done) {
			rvk.getChildTree('A', 1).then(function (data) {
					try {
						should.not.exist(data);
						data.length.should.exactly(1);
						data[0].id.should.exactly('AA');
						data[0].notation.should.exactly('AA');
						data[0].title.should.exactly('Bibliographien der Bibliographien, Universalbibliographien, Bibliothekskataloge, Nationalbibliographien');
						data[0].hasChildren.should.exactly(1);
						data[0].children.should.be([]);
						done();
					} catch (err) {
						should.not.exist(err);
						done();
					}
				},
				function (err) {
					should.not.exist(err);
					done();
				});
		})
	})
});

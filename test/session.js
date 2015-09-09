'use strict';

var request = require('supertest');
var should = require('should');
var app = require('../app');

describe('session handling', function() {
	describe('session initiation with omitted notations to hide parameter', function() {
		it('should init a new session with empty notations to hide', function(done) {
			request(app).post('/api/v1/init').expect(200).end(function (err, res) {
				if (err) return done(err);
				res.body.should.be.Array;
				res.body.should.have.length(0);
				done();
			});
		});
	});

	describe('session initiation with an array of one notation to hide', function() {
		var agent = request.agent(app);

		it ('should hide the notation "Antike Welt"', function(done) {
			agent
				.post('/api/v1/init')
				.send({notationsToHide: ['AA 09900']})
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					res.body.should.be.Array;
					res.body.should.have.length(1);
					res.body[0].should.equal('AA 09900');
					done();
				});
		});

		it('should return only notation "AA 10000 - AA 19900"', function(done) {
			agent
				.post('/api/v1/getchilds')
				.send({
					depth: '0',
					notation_id: '/classification_scheme/node[@notation=\'A\']/children/node[@notation=\'AA\']'
				})
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					res.body.status.should.equal('OK');
					res.body.data.should.be.Array;
					res.body.data.should.have.length(1);
					res.body.data[0].notation.should.equal('AA 10000 - AA 19900');
					done();
				});
		});
	});
});

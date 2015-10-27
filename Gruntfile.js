'use strict';

var request = require('request');
var path = require('path');
module.exports = function (grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	var reloadPort = 35729, files;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		path: path.resolve('./'),
		develop: {
			server: {
				file: 'bin/www',
				args: 'file://<%= path %>/test/rvk.xml',
				env: { DEBUG: '*,-express*', NODE_ENV: 'development' }
			}
		},
		watch: {
			options: {
				nospawn: true,
				livereload: reloadPort
			},
			server: {
				files: [
					'bin/www',
					'app.js',
					'routes/*.js',
					'Gruntfile.js'
				],
				tasks: ['develop', 'delayed-livereload']
			},
			js: {
				files: ['public/js/*.js'],
				options: {
					livereload: reloadPort
				}
			},
			css: {
				files: [
					'public/css/*.css'
				],
				options: {
					livereload: reloadPort
				}
			},
			views: {
				files: ['views/*.jade'],
				options: {
					livereload: reloadPort
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			public: {
				files: {
					'public/ervauka.min.js': ['public/ervauka.js']
				}
			}
		}
	});

	grunt.config.requires('watch.server.files');
	files = grunt.config('watch.server.files');
	files = grunt.file.expand(files);

	grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
		var done = this.async();
		setTimeout(function () {
			request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
				var reloaded = !err && res.statusCode === 200;
				if (reloaded) {
					grunt.log.ok('Delayed live reload successful.');
				} else {
					grunt.log.error('Unable to make a delayed live reload.');
				}
				done(reloaded);
			});
		}, 500);
	});

	grunt.registerTask('default', [
		'develop',
		'watch'
	]);

	grunt.registerTask('build', [
		'uglify'
	]);
};

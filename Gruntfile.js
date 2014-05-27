/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> ' +
				'<%= pkg.homepage ? "* " + pkg.homepage + " " : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		cssmin: {
			css: {
				files: {
					'dist/<%= pkg.name %>.min.css': ['src/**/*.css']
				},
				options: {
					banner: '<%= meta.banner %>'
				}
			}
		},
		uglify: {
			js: {
				files: {
					'dist/<%= pkg.name %>.min.js': [ 'src/revolver.core.js', 'src/carousel.touchdrag.js', 'src/revolver.init.js' ]
				},
				options: {
					banner: '<%= meta.banner %>'
				}
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			files: ['grunt.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'uglify', 'cssmin']);
	// Travis
	grunt.registerTask('travis', ['jshint', 'qunit']);

};

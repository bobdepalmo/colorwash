'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
			development: {
				options: {
					style: 'compressed'
				},
				files: {
					'demo/css/style.min.css' : 'demo/sass/style.scss'
				}
			}
		},
		uglify: {
			development: {
        options: {
          banner: '/*! some * shit here */\n'
        },
				files: {
					'dist/colorwash.min.js' : ['src/colorwash.js']
				}
			}
		},
		watch: {
			sass: {
				files: ['demo/sass/style.scss'],
				tasks: ['sass:development'],
				options: {
					livereload: true
				}
			},
			js: {
        files: ['src/colorwash.js'],
        tasks: ['uglify:development'],
        options: {
          livereload: true
        }
      }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', [
		'uglify:development',
		'sass:development',
		'watch'
  ]);
};
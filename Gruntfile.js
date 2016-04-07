'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
			development: {
				options: {
					style: 'compressed'
				},
				files: {
					'demo/assets/css/style.min.css' : 'demo/assets/sass/style.scss'
				}
			}
		},
		uglify: {
			development: {
        options: {
          banner: '/*\n * colorWash.js 1.0.0\n * https://github.com/bobdepalmo/colorwash.js\n * @license MIT licensed\n *\n * Copyright (C) 2016 depalmo.com - A project by Bob DePalmo\n */\n'
        },
				files: {
					'dist/colorwash.min.js' : ['src/colorwash.js']
				}
			}
		},
		copy: {
		  development: {
		    files: {
          'dist/colorwash.js': 'src/colorwash.js'
        }
		  },
		},
		watch: {
			sass: {
				files: ['demo/assets/sass/style.scss'],
				tasks: ['sass:development'],
				options: {
					livereload: true
				}
			},
			js: {
        files: ['src/colorwash.js'],
        tasks: ['uglify:development','copy:development'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['demo/index.html'],
        options: {
          livereload: true
        }
      }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'sass:development',
		'uglify:development',
		'copy:development',
		'watch'
  ]);
};
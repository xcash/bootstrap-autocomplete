'use strict';
var gulp  = require('gulp'),
	gutil = require('gulp-util'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),	
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	sequence = require('gulp-sequence'),
	size = require('gulp-size'),
	rename = require('gulp-rename'),
	webpack = require('gulp-webpack'),
	server = require('gulp-server-livereload');


gulp.task(	'default',
			function () {
				gutil.log('\n'+
					gutil.colors.green('GULP TASKS') + '\n\t' +

					// default | help
					gutil.colors.yellow('default | help') + '\n\t\t' +
					'Shows the available tasks\n\n\t' +

					// monitor
					gutil.colors.yellow('monitor') + '\n\t\t' +
					'Real time check for changes in js files.\n\t\tIt handles errors and rebuilds the minified and compiled files.\n\n\t' +


					// release
					gutil.colors.yellow('release') + '\n\t\t' +
					'Rebuild and concatenate all js files.\n\t\tMinifies and uglifies JS for deploy.\n\t\t'

				);
			}
);


gulp.task('monitor', function () {
	return sequence(['build-js', ], ['watch', 'dev-server'])();
});

gulp.task('release', function () {
	return sequence('build-js', 'dist-min')();
});

gulp.task('watch', function () {
	gulp.watch('src/**/*', ['build-js']);
});

gulp.task('build-js', function () {
	// copy index.html
	gulp.src('src/index.html')
		.pipe(gulp.dest('dist/latest/'));
	gulp.src('src/index4.html')
		.pipe(gulp.dest('dist/latest/'));
	// copy testdata
	gulp.src('src/testdata/*')
		.pipe(gulp.dest('dist/latest/testdata/'));
	return gulp.src('src/main.ts')
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.plugin, error.message, '\n');
				return this.emit('end');
			}
		}))
		.pipe(webpack( require('./webpack.config.js') ))
		.pipe(rename('bootstrap-autocomplete.js'))
		.pipe(gulp.dest('dist/latest/'));
});

gulp.task('dist-min', function () {
	return gulp.src('dist/latest/bootstrap-autocomplete.js')
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(size({title: 'PRE-MINIFY'}))
		.pipe(uglify({ mangle:true })) 
		.pipe(size({title: 'POST-MINIFY'}))
		.pipe(gulp.dest('dist/latest'));
});

gulp.task('dev-server', function() {
  gulp.src('dist/latest')
    .pipe(server({
	  host: '0.0.0.0',
      livereload: {
		enable: true,
	  	clientConsole: false
	  }
    }));
});

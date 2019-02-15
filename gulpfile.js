'use strict';
var gulp  = require('gulp'),
	log = require('fancy-log'),
	colors = require('ansi-colors'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),	
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	rename = require('gulp-rename'),
	webpack = require('webpack-stream'),
	browserSync = require('browser-sync');

var reload = browserSync.reload;


gulp.task('default',
			function () {
				log('\n'+
					colors.green('GULP TASKS') + '\n\t' +

					// default | help
					colors.yellow('default | help') + '\n\t\t' +
					'Shows the available tasks\n\n\t' +

					// monitor
					colors.yellow('monitor') + '\n\t\t' +
					'Real time check for changes in js files.\n\t\tIt handles errors and rebuilds the minified and compiled files.\n\n\t' +


					// release
					colors.yellow('release') + '\n\t\t' +
					'Rebuild and concatenate all js files.\n\t\tMinifies and uglifies JS for deploy.\n\t\t'

				);
			}
);


gulp.task('monitor', function () {
	gulp.series('build-js', function(done) {
		done();
		gulp.parallel('watch', 'dev-server', function(done) {
			done();
		})();
	})();
});

gulp.task('release', function () {
	gulp.series('build-js', 'dist-min', function(done) {
		done();
	})();
});

gulp.task('watch', function () {
	gulp.watch('src/**/*', gulp.series('build-js', function (done) {
		reload();
		done();
	}));
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
	browserSync({
		server: {
			baseDir: 'dist/latest'
		},
		open: false,
	});

	gulp.watch(['*.html', '*.js', 'testdata/*'], {cwd: 'dist/latest'}, reload);

	/*
	gulp.src('dist/latest')
    .pipe(server({
	  host: '0.0.0.0',
      livereload: {
		enable: true,
	  	clientConsole: false
	  }
		}));
	*/
});

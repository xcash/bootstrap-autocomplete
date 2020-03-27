const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const tslint = require('gulp-tslint');
const size = require('gulp-size');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync');
const del = require('del');
const webpackConfig = require('./webpack.config.js');

const reload = browserSync.reload;

async function help() {
  log('\n' +
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

function cleanDist() {
  return del('dist/**', { force: true });
}

function copyHtml() {
  return gulp.src('src/index*.html')
    .pipe(gulp.dest('dist/latest/'));
}

function copyTestData() {
  return gulp.src('src/testdata/*')
    .pipe(gulp.dest('dist/latest/testdata/'));
}

function compileJs() {
  return gulp.src('src/main.ts')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.plugin, error.message, '\n');
        return this.emit('end');
      }
    }))
    .pipe(tslint({ formatter: 'verbose' }))
    .pipe(tslint.report())
    .pipe(webpack(webpackConfig))
    .pipe(rename('bootstrap-autocomplete.js'))
    .pipe(gulp.dest('dist/latest/'));
}


function build(cb) {
  return gulp.series(
    copyHtml,
    copyTestData,
    compileJs
  )(cb);
}

function watch(cb) {
  gulp.watch('src/**/*', gulp.series(build, function (done) {
    reload();
    done();
  }), cb);
}

function monitor(cb) {
  return gulp.series(
    cleanDist,
    build,
    gulp.parallel(watch, devServer)
  )(cb);
}

async function devServer() {
  browserSync({
    server: {
      baseDir: 'dist/latest'
    },
    open: false,
  });

  gulp.watch(['*.html', '*.js', 'testdata/*'], { cwd: 'dist/latest' }, reload);
}

function minify() {
  return gulp.src('dist/latest/bootstrap-autocomplete.js')
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(size({ title: 'PRE-MINIFY' }))
    .pipe(uglify({ mangle: true }))
    .pipe(size({ title: 'POST-MINIFY' }))
    .pipe(gulp.dest('dist/latest'));
}

function release(cb) {
  return gulp.series(
    cleanDist,
    build, minify
  )(cb);
}

function test(cb) {
  return gulp.series(
    compileJs
  )(cb);
}

exports.default = help;
exports.monitor = monitor;
exports.release = release;


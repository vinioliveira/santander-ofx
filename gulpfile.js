var browserify = require('browserify');
var watchify = require('watchify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var manifest = require('./extension/manifest.json');
var fs = require('fs');
var pathmodify = require('pathmodify');
var path = require('path');
var assign = require('lodash.assign');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-cssnano');
var zip = require('gulp-zip');

var options = {
  mods: [
    pathmodify.mod.dir('default', path.join(__dirname, './src/js')),
  ]
};

gulp.task('browserify:app', function() {
  var b = browserify('./src/js/app.js');
  return b
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./extension/compile/js/'));
});

gulp.task('browserify', function() {
  gulp.start('browserify:app');
});

gulp.task('watch', function() {
  var customOpts = {
    entries: ['./src/js/app.js'],
    debug: false
  };

  var opts = assign({}, watchify.args, customOpts),
  browserifyBuilder = browserify(opts);
  var watch = watchify(browserifyBuilder).plugin(pathmodify, options);
  var bundle = function() {
    watch
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./extension/compile/js/'));
  };

  watch.on('update', bundle); // on any dep update, runs the bundler
  watch.on('log', gutil.log); // output build logs to terminal
  bundle();

  gulp.watch('src/css/**/*.scss', ['scss']);
});

gulp.task('scss', function () {
  gulp.src('src/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('extension/compile/css'));
});

gulp.task('uglify-js', function() {
  return gulp.src('extension/compile/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('extension/compile/js/'));
});

gulp.task('minify-css', function() {
  return gulp.src('extension/**/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('extension'));
});

gulp.task('compress', function () {
  return gulp.src('extension/**/*')
    .pipe(zip(manifest.name + '-v' + manifest.version + '.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  gulp.start('scss', 'watch');
});

/**
 * Created by randall on 7/4/15.
 */
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var react = require('gulp-react');

gulp.task('vendor:css', function() {
    return gulp.src(['./bower_components/bootstrap/dist/css/bootstrap.*'])
        .pipe(gulp.dest('./public/css'));
});

gulp.task('vendor:fonts', function() {
    return gulp.src(['./bower_components/bootstrap/dist/fonts/*'])
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('vendor', ['vendor:css', 'vendor:fonts'], function() {
   return gulp.src(['./bower_components/jquery/dist/*',
                    './bower_components/react/react*.js',
                    './bower_components/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(gulp.dest('./public/js'));
});

gulp.task('react', function () {
    return gulp.src(['./app/**/*.jsx'])
        .pipe(sourcemaps.init())
        .pipe(react())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('default', ['vendor', 'react']);

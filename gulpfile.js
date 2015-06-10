
var gulp = require('gulp'),
	concat = require('gulp-concat'),
	jade = require('gulp-jade'),
	path = require('path'),
	gutil = require('gulp-util');

	paths = {
		templates: ['./views/client-side/**/*.jade'],
	},

	jadeTask = function () {
		return gulp.src(paths.templates, { cwd: './**' })
			.pipe(jade({ client: true, name: 'message' }).on('error', swallowError))
			.pipe(concat('templates.js'))
			.pipe(gulp.dest('./public/javascripts'));
	};

function swallowError(error) {
	var msg = {
		filename: error.filename,
		name: error.name,
		message: error.message
	};
	
	gutil.log(msg);

	this.emit('end');
}

gulp.task('jade', jadeTask);
gulp.task('build', ['jade']);

gulp.task('default', ['build']);

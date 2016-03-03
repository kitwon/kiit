var gulp = require('gulp');

//加载所需插件
var rimraf = require('gulp-rimraf'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	copy = require('gulp-copy'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass');

// mac task: sass编译
gulp.task('sass', function() {
	gulp.src('./source/scss/index.scss')
	.pipe(sass())
	.pipe(gulp.dest('./source/css/'))
})


gulp.task('css', function() {
	gulp.src('./source/css/index.css')
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(gulp.dest('./source/css'))
})

gulp.task('javascripts', function() {
	gulp.src(['./source/js/index.js', './source/js/post.js'])
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./source/js'))
})

//清除文档
gulp.task('rimraf', function() {
	// return gulp.src(['./source/css/＊.css'], {read: false})
	// .pipe(rimraf({force: true}))
})

//运行gulp\监听文件
gulp.task('develop', function() {
	gulp.start('sass', 'css', 'javascripts');
	gulp.watch(['./source/scss/*', './source/scss/**/*'], ['sass', 'css']);
	gulp.watch(['./source/js/index.js', './source/js/post.js'], ['javascripts']);
})

gulp.task('default',['rimraf', 'develop']);
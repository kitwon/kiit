const gulp = require('gulp'),
	path = require('path');

//加载所需插件
const cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	include = require('gulp-include'),
	uglify = require('gulp-uglify'),
	prefix = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass');

const glob = require('glob');

const filepath = {
	scss: path.join(__dirname, 'src/scss/*(index|bootstrap).scss'),
	js: path.join(__dirname, 'src/js/*.js'),
	plugin: path.join(__dirname, 'src/js/plugins/*.js'),
	// vendor: path.join(__dirname, 'src/js/vendor/*.js'),
	vendor: function() {
		var filepath = [];
		var arr = glob.sync(path.join(__dirname, 'src/js/vendor/*.js'))

		for(let i = arr.length-1; i >= 0; i--) {
			if(arr[i].indexOf('jquery') !== -1) {
				filepath.unshift(arr[i])
			}else {
				filepath.push(arr[i])
			}
		}
		return filepath;
	}
}

// mac task: sass编译
gulp.task('sass', function() {
	gulp.src(filepath.scss)
		.pipe(plumber())
		.pipe(sass())
		.pipe(prefix('last 3 version'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(gulp.dest('./source/css'))
})


// gulp.task('css', function() {
// 	gulp.src('./source/css/index.css')
// 		.pipe(rename({suffix: '.min'}))
// 		.pipe(cssnano())
// 		.pipe(gulp.dest('./source/css'))
// })

gulp.task('javascripts', function() {
	gulp.src(filepath.js)
		.pipe(plumber())
		.pipe(include())
		// .pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./source/js'))
})
gulp.task('vendorJs', function() {
	gulp.src(filepath.vendor())
        .pipe(include())
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./source/js'))
})
gulp.task('pluginJs', function() {
	gulp.src(filepath.plugin)
		.pipe(rename({suffix: '.min'}))
		.pipe(concat('plugin.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('./source/js'))
})


//运行gulp\监听文件
gulp.task('develop', function() {
	gulp.start('sass', 'javascripts', 'vendorJs');

	gulp.watch(path.join(__dirname, 'src/scss/**/**/*'), ['sass']);
	gulp.watch([filepath.js], ['javascripts']);
	gulp.watch([filepath.vendor()], ['vendorJs']);
	// gulp.watch([filepath.plugin], ['pluginJs']);
})

gulp.task('default',['develop']);

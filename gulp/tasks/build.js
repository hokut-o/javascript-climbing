import gulp from 'gulp';
import runSequence from 'run-sequence';
import pug from 'gulp-pug'
import stylus from 'gulp-stylus';
import autoprefixer from 'autoprefixer'
import plumber from 'gulp-plumber';
import rupture from 'rupture';
import imagemin from 'gulp-imagemin';
import imageminPng from 'imagemin-pngquant';
import imageminJpg from 'imagemin-jpeg-recompress';
import imageminGif from 'imagemin-gifsicle';
import webpackStream from 'webpack-stream'
import webpack from 'webpack'
import webpackConfig from '../../webpack.config.build'
import paths from '../config'
import mqpacker from "css-mqpacker";
import sortCSSmq from "sort-css-media-queries";
import postcss from "gulp-postcss";


gulp.task('copyimg', () => {
	return gulp.src(['src/images/**'])
	.pipe(del([paths.distImg + '/*.+(jpg|jpeg|png|gif|svg)', paths.distImg + '/**/*.+(jpg|jpeg|png|gif|svg)', '!' + paths.distImg + '/sprite/**']))
	.pipe(gulp.dest(paths.distImg))
});

gulp.task("webpackBuild", () => {
	return webpackStream(webpackConfig, webpack)
	.pipe(gulp.dest(paths.js_build))
});

gulp.task('imgBuild', () => {
	return gulp.src(paths.img_src + '**/*.+(jpg|jpeg|png|gif)')
	.pipe(imagemin([
		imageminPng(),
		imageminJpg(),
		imageminGif()
	]))
	.pipe(imagemin())
	.pipe(gulp.dest(paths.img_build));
});

gulp.task('svgCopy', () => {
	return gulp.src(paths.img_src + '**/*.svg')
	.pipe(gulp.dest(paths.img_build));
});

gulp.task('fontCopy', () => {
	return gulp.src(paths.dest + 'font/*.*')
	.pipe(gulp.dest('build/font/'));
});

gulp.task('stylusBuild', () => {
	return gulp.src(paths.stylus_src)
	.pipe(plumber())
	.pipe(stylus({
		use: [rupture()],
		compress: true,
		'include css': true,
	}))
	.pipe(postcss([
		mqpacker({
			sort: sortCSSmq
		}),
		autoprefixer({
			remove: false,
			grid: true,
		})
	]))
	.on('error', (err) => {
		console.log(err.message);
	})
	.pipe(gulp.dest(paths.stylus_build))
});

gulp.task('pugBuild',  () => {
	return gulp.src(paths.pug_src)
	.pipe(plumber())
	.pipe(pug({
		pretty: true
	}))
	.on('error', (err) => {
		console.log(err.message);
	})
	.pipe(gulp.dest(paths.build));
});

gulp.task('build', (cb) => {
	return runSequence(
		'pugBuild',
		'stylusBuild',
		'imgBuild',
		'svgCopy',
		'fontCopy',
		'webpackBuild',
		cb
	);
});
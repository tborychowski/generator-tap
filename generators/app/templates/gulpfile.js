const gulp = require('gulp');
const cssmin = require('gulp-clean-css');
const webpack = require('webpack-stream');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const noop = require('through2').obj;
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const env = require('gulp-env');
const isProd = require('minimist')(process.argv.slice(2)).prod;
const webpackConfig = require('./webpack.config.js');
const PUBLIC_PATH = 'public/';

const wpErr = (err, stats) => {
	if (err) notify.onError('Error: ' + err);
	err = stats.compilation.errors;
	if (err.length) notify.onError('Error: ' + err[0].message);
};

let serverStarted = false;
const startServer = done =>
	nodemon({ script: './server/index.js', watch: ['./server'], ext: 'js html' })
		.on('start', () => {
			if (serverStarted) return;
			serverStarted = true;
			setTimeout(done, 500);
		});


env.set({ NODE_ENV: isProd ? 'production' : 'development' });


gulp.task('help', () => {
	const tasks = '  ' + Object.keys(gulp.tasks).sort().join('\n  ');
	console.log(`\nAvailable tasks:\n${tasks}\n`);/* eslint no-console: 0 */
});


gulp.task('eslint', () => {
	return gulp.src(['client/**/*.js', 'server/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});


gulp.task('assets', () => {
	gulp.src(['assets/*.*']).pipe(gulp.dest(`${PUBLIC_PATH}`));
});


gulp.task('js', ['eslint'], () => {
	if (!isProd) webpackConfig.devtool = 'inline-source-map';
	else {
		const MinifyPlugin = require('babel-minify-webpack-plugin');
		webpackConfig.plugins = [ new MinifyPlugin() ];
	}

	return gulp.src(['client/index.js'])
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(webpack(webpackConfig, null, wpErr))
		.pipe(gulp.dest(PUBLIC_PATH))
		.pipe(livereload());

});


gulp.task('styl', () => {
	return gulp.src(['client/index.styl', 'client/**/*.styl'])
		.pipe(isProd ? noop() : sourcemaps.init())
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(stylus({ paths: ['client'], 'include css': true }))
		.pipe(isProd ? cssmin({ keepSpecialComments: 0 }) : noop())
		.pipe(concat('app.css'))
		.pipe(isProd ? noop() : sourcemaps.write())
		.pipe(gulp.dest(PUBLIC_PATH))
		.pipe(livereload());
});


gulp.task('server', done => {
	startServer(done);
});


gulp.task('watch', ['default'], () => {
	if (isProd) return;
	livereload.listen();
	gulp.watch('client/**/*.styl', ['styl']);
	gulp.watch('client/**/*.js', ['js']);
	gulp.watch('client/**/*.html', ['js']);
	gulp.watch('assets/**/*.*', ['assets']);
});


gulp.task('default', [ 'js', 'styl', 'assets', 'eslint' ]);
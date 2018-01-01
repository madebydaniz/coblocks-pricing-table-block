/**
 * Gulp
 */

var pkg                     	= require('./package.json');
var projectURL              	= 'http://gutenkit.local';
var styleWatchFile   		= './block/style.scss';
var editorWatchFile   		= './block/editor.scss';
var scriptWatchFiles   		= [ './block/block.build.js', './block/frontend.js' ];
var PHPWatchFiles    		= [ './**/*.php' ];

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

/**
 * Load Plugins.
 */
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var minifycss    = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var notify       = require('gulp-notify');
var runSequence  = require('run-sequence');
var lineec       = require('gulp-line-ending-corrector');
var csscomb      = require('gulp-csscomb');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();
var cache        = require('gulp-cache');
var uglify       = require('gulp-uglify');
var reload       = browserSync.reload;

/**
 * Tasks
 */
gulp.task('clear', function () {
	cache.clearAll();
});

gulp.task( 'browser_sync', function() {
	browserSync.init( {
		proxy: projectURL,
		open: true,
		injectChanges: true,
	});
});

gulp.task( 'styles', function () {
	gulp.src( styleWatchFile, { base: './' } )
	.pipe( sass( {
		errLogToConsole: true,
		outputStyle: 'expanded',
		precision: 10
	} ) )
	.on( 'error', console.error.bind( console ) )
	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
	.pipe( lineec() )
	.pipe( gulp.dest( './' ) )
	.pipe( csscomb() )
	.pipe( gulp.dest( './' ) )
	// .pipe( browserSync.stream() )
	.pipe( rename( { suffix: '.min' } ) )
	.pipe( minifycss() )
	.pipe( lineec() )
	.pipe( gulp.dest( './' ) )
	// .pipe( browserSync.stream() )
});

gulp.task( 'editor_styles', function () {
	gulp.src( editorWatchFile, { base: './' } )
	.pipe( sass( {
		errLogToConsole: true,
		outputStyle: 'expanded',
		precision: 10
	} ) )
	.on( 'error', console.error.bind( console ) )
	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
	.pipe( lineec() )
	.pipe( csscomb() )
	.pipe( gulp.dest( '.' ) )
	// .pipe( browserSync.stream() )
	.pipe( rename( { suffix: '.min' } ) )
	.pipe( minifycss() )
	.pipe( lineec() )
	.pipe( gulp.dest( '.' ) )
	// .pipe( browserSync.stream() )
});

gulp.task( 'scripts', function() {
	gulp.src( scriptWatchFiles, { base: './' } )
	.pipe( rename( { suffix: '.min' } ) )
	.pipe( uglify() )
	.pipe( lineec() )
	.pipe( gulp.dest( '.' ) )
	.pipe( browserSync.stream() )
});

/**
 * Default Command.
 */
gulp.task( 'default', [ 'clear', 'styles', 'editor_styles', 'scripts' ], function () {
	gulp.watch( PHPWatchFiles, reload );
	gulp.watch( styleWatchFile, [ 'styles' ] );
	gulp.watch( editorWatchFile, [ 'editor_styles' ] );
});
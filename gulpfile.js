// ----------------------------------------------------------------------------------------
// Plugins
// ----------------------------------------------------------------------------------------

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');
var cleancss     = require('gulp-clean-css');
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var clean        = require('gulp-clean');
var gutil        = require('gulp-util');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var babelify     = require('babelify');
var watchify     = require('watchify');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var buffer       = require('vinyl-buffer');
var flatten      = require('gulp-flatten');


// ----------------------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------------------


var src = {
  sass     : 'src/scss/**/*.scss',
  top      : 'src/*',
  html     : 'src/*.html',
  img      : 'src/img/**/*',
  js       : 'src/js/**/*',
  fonts    : 'src/fonts/**/*',
  mainjs   : 'src/js/main.js',
  vendorjs : 'dev/js/vendor/*.js',
};

var dist = {
  css      : 'dist/css',
  top      : 'dist',
  img      : 'dist/img',
  fonts    : 'dist/fonts',
  js       : 'dist/js',
  html     : 'dist',
  mainjs   : 'dist/js',
  vendorjs : 'prod/js/vendor',
};


// ----------------------------------------------------------------------------------------
// Tasks
// ----------------------------------------------------------------------------------------


// Task: Sass
// sourcemaps, compile, minify, rename, move to dist
gulp.task('sass', function() {
  return gulp.src(src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleancss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.css))
    .pipe(browserSync.reload({stream: true}));
});

// Task: HTML
// move html files from src to dist
gulp.task('html', function() {
  return gulp.src(src.html)
    .pipe(plumber())
    .pipe(gulp.dest(dist.html))
    .pipe(browserSync.reload({stream: true}))
    .on('error', gutil.log);
});


// Task: Browserify + Watchify
// Browserify will watch the dev.js file.
// Babel is used to allow for es2015, and specifically ES6 Modules.
gulp.task('watchify', function () {

  var args = {
    entries: [src.mainjs],
    debug: true,
    cache: {},
    packageCache: {},
  };

  var bundler = watchify(browserify(src.mainjs, args).transform(babelify, {presets: ["es2015"]}));
  bundle_js(bundler)

  bundler.on('update', function () {
    bundle_js(bundler)
  })
})


function bundle_js(bundler) {
  return bundler.bundle()
    .pipe(source(src.mainjs))
    .pipe(buffer())
    .pipe(gulp.dest(dist.mainjs))
    .pipe(rename('bundle.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist.mainjs))
    .pipe(browserSync.reload({stream:true}));
}

// Task: Browserify without watchify
gulp.task('browserify', function () {
  var bundler = browserify(src.mainjs, { debug: true }).transform(babelify, {presets: ["es2015"]})

  return bundle_js(bundler)
})

// Browserify without sourcemaps (or watchify)
gulp.task('browserify-prod', function () {
  var bundler = browserify(src.mainjs).transform(babelify, {presets: ["es2015"]})

  return bundler.bundle()
    .pipe(source(src.mainjs))
    .pipe(buffer())
    .pipe(rename('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist.mainjs))
})

// Task: Migrate Files
gulp.task('migrate', function() {
  gulp.src(src.top + '.{txt,ico,html,png}')
    .pipe(plumber())
    .pipe(gulp.dest(dist.top));

  // Grab fonts
  gulp.src(src.fonts + '.{eot,svg,tff,woff,woff2}')
    .pipe(plumber())
    .pipe(flatten())
    .pipe(gulp.dest(dist.fonts));

  // Grab images
  gulp.src(src.img)
    .pipe(plumber())
    .pipe(gulp.dest(dist.img));

  // Grab Vendor JS (not used in es6 modules)
  gulp.src(src.vendorjs)
    .pipe(plumber())
    .pipe(gulp.dest(dist.vendorjs));

});

// Task: Watch
gulp.task('watch', ['watchify', 'browserSync', 'sass', 'html',], function() {
  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.html, ['html']);
  gulp.watch(src.img, ['migrate']);
});

// Task: Clean
// Delete all files in the dist folder
gulp.task('clean', function () {
  return gulp.src(dist.top + '/*', {read: false})
    .pipe(clean());
});

// Task: BrowserSync
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './dist',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0'
      }
    }
  })
});


// Task: Default (launch server and watch files for changes)
gulp.task('default', ['migrate', 'watch'], function(){});

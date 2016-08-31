/* eslint-disable no-multi-spaces, key-spacing, import/no-extraneous-dependencies */

// ----------------------------------------------------------------------------------------
// Plugins
// ----------------------------------------------------------------------------------------

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const browserSync  = require('browser-sync');
const cleancss     = require('gulp-clean-css');
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');
const clean        = require('gulp-clean');
const gutil        = require('gulp-util');
const browserify   = require('browserify');
const source       = require('vinyl-source-stream');
const babelify     = require('babelify');
const watchify     = require('watchify');
const uglify       = require('gulp-uglify');
const buffer       = require('vinyl-buffer');
const flatten      = require('gulp-flatten');


// ----------------------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------------------


const src = {
  sass     : 'src/scss/**/*.scss',
  top      : 'src/*',
  html     : 'src/*.html',
  img      : 'src/img/**/*',
  js       : 'src/js/**/*',
  fonts    : 'src/fonts/**/*',
  mainjs   : 'src/js/main.js',
  vendorjs : 'dev/js/vendor/*.js',
};

const dist = {
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
gulp.task('sass', () => {
  gulp.src(src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleancss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.css))
    .pipe(browserSync.reload({ stream: true }));
});

// Task: HTML
// move html files from src to dist
gulp.task('html', () => {
  gulp.src(src.html)
    .pipe(plumber())
    .pipe(gulp.dest(dist.html))
    .pipe(browserSync.reload({ stream: true }))
    .on('error', gutil.log);
});


function bundleJs(bundler) {
  return bundler.bundle()
    .pipe(source(src.mainjs))
    .pipe(buffer())
    .pipe(gulp.dest(dist.mainjs))
    .pipe(rename('bundle.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist.mainjs))
    .pipe(browserSync.reload({ stream:true }));
}

// Task: Browserify + Watchify
// Browserify will watch the dev.js file.
// Babel is used to allow for es2015, and specifically ES6 Modules.
gulp.task('watchify', () => {
  const args = {
    entries: [src.mainjs],
    debug: true,
    cache: {},
    packageCache: {},
  };

  const bundler = watchify(browserify(src.mainjs, args)
    .transform(babelify, { presets: ['es2015'] }));

  bundleJs(bundler);

  bundler.on('update', () => {
    bundleJs(bundler);
  });
});


// Task: Browserify without watchify
gulp.task('browserify', () => {
  const bundler = browserify(src.mainjs, { debug: true })
    .transform(babelify, { presets: ['es2015'] });

  return bundleJs(bundler);
});

// Browserify without sourcemaps (or watchify)
gulp.task('browserify-prod', () => {
  const bundler = browserify(src.mainjs).transform(babelify, { presets: ['es2015'] });

  return bundler.bundle()
    .pipe(source(src.mainjs))
    .pipe(buffer())
    .pipe(rename('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist.mainjs));
});

// Task: Migrate Files
gulp.task('migrate', () => {
  gulp.src('${src.top} .{txt,ico,html,png}')
    .pipe(plumber())
    .pipe(gulp.dest(dist.top));

  // Grab fonts
  gulp.src('${src.fonts} .{eot,svg,tff,woff,woff2}')
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
gulp.task('watch', ['watchify', 'browserSync', 'sass', 'html'], () => {
  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.html, ['html']);
  gulp.watch(src.img, ['migrate']);
});

// Task: Clean
// Delete all files in the dist folder
gulp.task('clean', () => {
  gulp.src('${dist.top} /*', { read: false })
    .pipe(clean());
});

// Task: BrowserSync
gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: './dist',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
});

// Task: Default (launch server and watch files for changes)
gulp.task('default', ['migrate', 'watch'], () => {});

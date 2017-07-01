const browserify = require('browserify');
const browserifyShim = require('browserify-shim');
const babelify = require('babelify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const transform = require('vinyl-transform');
const uglify = require('gulp-uglify');

module.exports = (gulp, PATH, $) => {
  return () => {
    watchify(browserify(`${ PATH.src.js }/main.js`, { debug: true }))
      .transform(babelify, { presets: ['es2015'] })
      //.transform(browserifyShim)
      .bundle()
      .on('error', (err) => { console.log(`Error : ${ err.message }`); /*console.log(err.stack);*/ })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe($.rename('build.min.js'))
      .pipe(gulp.dest(`${ PATH.dist }/${ PATH.js }/`))
  }
}
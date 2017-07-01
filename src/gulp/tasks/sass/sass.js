const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');

module.exports = (gulp, PATH, $) => {
  return () => {
    gulp.src(`${ PATH.src.scss }/{style,print}.scss`)
      .pipe($.plumber({
        errorHandler: function(err) {
          console.log(err.messageFormatted);
          this.emit('end');
        }
      }))
      .pipe(sass({
        sourceMap: true
      }))
      .pipe(autoprefixer({
        browsers: [
          'last 2 versions',
          'ie 9',
          'safari 8'
        ]
      }))
      .pipe(cleanCss({
        debug: true
      }, (details) => {
        console.log(`${ details.name }: ${ details.stats.originalSize } Byte > ${ details.stats.minifiedSize } Byte`);
      } ))
      .pipe($.rename({
        extname: '.min.css'
      }))
      .pipe(gulp.dest(`${ PATH.dist }/${ PATH.css }/`))
  }
}
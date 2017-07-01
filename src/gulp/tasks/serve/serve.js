const webserver = require('gulp-webserver');

module.exports = (gulp, PATH, $) => {
  return () => {
    gulp.src(`${ PATH.dist }/`)
        .pipe(webserver({
            livereload: false,
            port: `${ PATH.port }`,
            host: '0.0.0.0',
            directoryListing: false//,
            //open: true
        }));
  }
}
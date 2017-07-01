const sassGlobbing = require('gulp-sass-globbing');

module.exports = (gulp, PATH, $) => {

  let files = [
        'base',
        'constants',
        'layouts',
        'mixins',
        'modules',
        'utils'
      ];

  let globbing = (files) => {
    files.forEach(f => {
      gulp.src(`${f}/*.scss`, {cwd: `${ PATH.src.scss }/`})
        .pipe(sassGlobbing(
          {
            path: `_${f}.scss`
          },
          {
            useSingleQuotes: true,
            signature: '/* generated with gulp-sass-globbing */'
          }
        ))
        //.pipe($.sass())
        .pipe(gulp.dest(`${ PATH.src.scss }/generated/`))
    });
  };

  return () => {
    globbing(files);
  }
}
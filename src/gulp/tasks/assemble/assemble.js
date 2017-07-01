const ignore = require('gulp-ignore');
const through = require('through2');

const prettify = require('gulp-prettify');
const assemble = require('assemble');
const app = assemble();
const prettifyrc = require('./prettifyrc.json');
const yaml = require('js-yaml');

module.exports = (gulp, PATH, $) => {

  app.dataLoader('yml', (str, fp) => {
    return yaml.safeLoad(str);
  });
  app.data(`${ PATH.src.hbs }/data/config.yml`);

  return () => {

    app.layouts(`${ PATH.src.hbs }/layouts/*.hbs`);
    app.pages(`${ PATH.src.hbs }/**/*.hbs`);
    app.partials(`${ PATH.src.hbs }/partials/**/*.hbs`);
    // app.dataLoader('yml', (str, fp) => {
    //   return yaml.safeLoad(str);
    // });

    // app.data(`${ PATH.src.hbs }/data/config.yml`);

    return app.toStream('pages')
      .pipe(through.obj((chunk, enc, cb) => {

        chunk.data['assets'] = PATH.assets;
        //chunk.data['config'] = require(`${ PATH.src.hbs }/data/config.yml`);
        //console.log(chunk.data);
        //console.log(JSON.stringify(chunk));

        return cb(null, chunk);
      }))
      .pipe(app.renderFile())
      .pipe($.rename({
        extname: '.html'
      }))
      .pipe(prettify( prettifyrc ))
      .pipe(ignore.exclude(['**/layouts/*.html', '**/partials/*.html']))
      .pipe(app.dest(`${ PATH.static_html }/`))
  }
}
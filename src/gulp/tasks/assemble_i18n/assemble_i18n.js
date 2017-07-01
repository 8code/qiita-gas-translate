const fs = require('fs-extra');
const path = require('path');
const foreach = require('gulp-foreach');
const through = require('through2');
const ignore = require('gulp-ignore');

const assemble = require('assemble');
const prettify = require('gulp-prettify');
const prettifyrc = require('./prettifyrc.json');
const app = assemble();
const yaml = require('js-yaml');

var PAGELANG, TRANSLATION,
LOCALES = {
  'ja' : 'ja_JP',
  'en' : 'en_US',
  'ko' : 'ko_KR',
  'zh-cn' : 'zh_CN',
  'zh-tw' : 'zh_TW',
  'es' : 'es_ES',
  'de' : 'de_DE',
  'fr' : 'fr_FR',
  'th' : 'th_TH',
  'nl' : 'nl_NL'
};


module.exports = (gulp, PATH, $) => {

  app.dataLoader('yml', (str, fp) => {
    return yaml.safeLoad(str);
  });
  app.data(`${ PATH.src.hbs }/data/config.yml`);

  return () => {

    var LOOP_COUNT = 0;

    gulp.src(`${ PATH.gulp.languages }/*.json`)
      .pipe(foreach((stream, file) => {

        // 翻訳データを取得
        PAGELANG = path.basename(file.path, '.json');
        TRANSLATION = JSON.parse(fs.readFileSync(`${ file.base }${ PAGELANG }.json`))[PAGELANG];
        app.layouts(`${ PATH.src.hbs }/layouts/*.hbs`);
        app.pages(`${ PATH.src.hbs }/**/*.hbs`);
        app.partials(`${ PATH.src.hbs }/partials/**/*.hbs`);

        return app.toStream('pages')
          .pipe(through.obj((chunk, enc, cb) => {

            chunk.data['assets'] = PATH.assets;
            chunk.data['layoutsDir'] = `${ PATH.src.hbs }/layouts`;
            chunk.data['partialsDir'] = `${ PATH.src.hbs }/partials`;
            chunk.data['dataDir'] = `${ PATH.src.hbs }/data`;
            chunk.data['lang'] = PAGELANG;
            chunk.data['langNum'] = LOOP_COUNT;
            chunk.data['locale'] = LOCALES[PAGELANG];
            chunk.data['slug'] = path.basename(chunk.path, '.hbs');
            chunk.data['absolutePath'] = chunk.path.substring(chunk.path.indexOf('hbs/') + 4, chunk.path.length);
            chunk.data['relativePath'] = '../'.repeat([chunk.data['absolutePath'].split('/').length - 1]) + (PAGELANG === 'ja' ? '' : '../');
            chunk.data['__'] = TRANSLATION;

            LOOP_COUNT = LOOP_COUNT + 1;
            return cb(null, chunk);
          }))
          .pipe(app.renderFile())
          .pipe($.rename({
            extname: '.html'
          }))
          .pipe(prettify( prettifyrc ))
          .pipe(ignore.exclude(['**/layouts/*.html', '**/partials/*.html']))
          .pipe(app.dest(`${ PATH.static_html }/${ (PAGELANG == 'ja' ? '' : `${ PAGELANG }`) }`))
      }))
  }
}
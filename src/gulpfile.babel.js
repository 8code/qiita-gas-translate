import gulp from 'gulp';
import fs from 'fs-extra';
import gulpLoadPlugins from 'gulp-load-plugins';
import PackageManager from 'front-package-manager';

const cyan    = '\u001b[36m';
const reset   = '\u001b[0m';
//const pkg = require('./package.json');
const conf = require('./config.json');

const $ = gulpLoadPlugins({
  pattern: ['gulp-*', 'gulp.*', 'fs-extra'],
  rename: { 'fs-extra': 'fs' }
})

const packageManager = new PackageManager({
  uses: conf.uses,
  globalPlugins: $,
  taskRunner: gulp,
  taskConfig: conf,
  taskPrefix: 'gulp-module-task-',
  taskPath: './gulp/tasks'
});

packageManager.checkPackages();


/**
 * spread2json
 */
gulp.task('spread2json', packageManager.getTask('spread2json'))


/**
 * assemble
 */
gulp.task('assemble', packageManager.getTask('assemble'))


/**
 * assemble_i18n
 */
gulp.task('assemble_i18n', packageManager.getTask('assemble_i18n'))


/**
 * javascript
 */
gulp.task('browserify', packageManager.getTask('browserify'))


/**
 * globbing
 */
gulp.task('sass_globbing', packageManager.getTask('sass_globbing'))


/**
 * scss
 */
gulp.task('sass', packageManager.getTask('sass'))


/**
 * imagemin
 */
gulp.task('imagemin', packageManager.getTask('imagemin'))


/**
 * compress
 */
gulp.task('compress', packageManager.getTask('compress'))


/**
 * spritesmith
 */
gulp.task('sprite', packageManager.getTask('sprite_smith'))


/**
 * serve
 * e.g. hostsで[127.0.0.1 localhost]が有効になっている必要があります。
 */
gulp.task('serve', packageManager.getTask('serve'))


/**
 * watch
 */
gulp.task('watch', () => {
  gulp.watch(`${ conf.src.hbs }/**/*.{hbs,yml,json}`, ['assemble_i18n']);
  gulp.watch(`${ conf.src.scss }/**/*.scss`, ['sass']);
  gulp.watch(`${ conf.src.js }/**/*.js`, ['browserify']);
})

gulp.task('default', ['serve', 'sass_globbing', 'watch']);
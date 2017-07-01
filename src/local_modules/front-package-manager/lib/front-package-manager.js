'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RED = '\x1B[31m';
var GREEN = '\x1B[32m';
var YELLOW = '\x1B[33m';
var MAGENTA = '\x1B[35m';
var CYAN = '\x1B[36m';
var RESET = '\x1B[0m';
var FS = require('fs-extra');
var EXEC_SYNC = require('child_process').execSync;

var PROJECT_ROOT = process.env.PWD;
var PKG_PATH = require.resolve(PROJECT_ROOT + '/package.json');
var PKG = require(PKG_PATH);

var packageManager = function () {
  function packageManager(opt) {
    _classCallCheck(this, packageManager);

    this.uses = opt.uses || '';
    this.globalPlugins = opt.globalPlugins || '';
    this.taskRunner = opt.taskRunner || '';
    this.taskConfig = opt.taskConfig || '';
    this.taskPrefix = opt.taskPrefix || '';
    this.taskPath = opt.taskPath || '';
  }

  _createClass(packageManager, [{
    key: 'checkPackages',
    value: function checkPackages() {
      var _this = this;

      var _pkgStore = void 0,
          _installArr = [],
          _moduleArr = [];

      if (!PKG.localDependencies) {
        PKG['localDependencies'] = {};
      }
      _pkgStore = JSON.parse(JSON.stringify(PKG));

      console.log(CYAN + 'front-package-manager: Check active pakages.' + RESET);

      Object.keys(this.uses).forEach(function (key) {
        if (_this.uses[key]) {
          if (!PKG.localDependencies[_this.taskPrefix + key]) {
            var _packagePath = require.resolve(PROJECT_ROOT + '/' + _this.taskPath + '/' + key + '/package.json');
            var _package = require(_packagePath) || ' ';

            _moduleArr.push(_this.taskPrefix + key);
            _installArr.push(_this.taskPath + '/' + key);
            PKG.localDependencies[_this.taskPrefix + key] = _package.version || ' ';
          }
        } else {
          delete PKG.localDependencies[_this.taskPrefix + key];
        }
      });

      //console.log(CYAN + 'front-package-manager: Start installing additional packages.' + RESET);
      //return execSync('npm --prefix $(npm root)../ i ' + _installArr.join(' '), {stdio: [0, 1, 2]});
      if (_installArr.length) {
        return EXEC_SYNC('ls $(npm root) | grep -x -e ' + _moduleArr.join(' -e ') + '; if [ $? == "1" ]; then npm --prefix $(npm root)/../ i ' + _installArr.join(' ') + '; fi;', { stdio: [0, 1, 2] });
      }

      try {
        FS.writeFileSync(PKG_PATH, JSON.stringify(PKG, null, 2));
      } catch (e) {
        console.log(e);
      }
    }
  }, {
    key: 'getTask',
    value: function getTask(task) {
      if (!this.uses[task]) {
        return;
      }

      //let taskPath = `./gulp/tasks/${ task }`;
      // if(FS.existsSync(taskPath) && FS.statSync(taskPath).isDirectory) {
      //   taskPath = `${taskPath}/${ task }`;
      // }
      console.log(CYAN + '\'getTask: ' + task + ' is active.' + RESET);
      var _taskPath = require.resolve(PROJECT_ROOT + '/' + this.taskPath + '/' + task + '/' + task);
      return require(_taskPath)(this.taskRunner, this.taskConfig, this.globalPlugins);
    }
  }]);

  return packageManager;
}();

exports.default = packageManager;
;
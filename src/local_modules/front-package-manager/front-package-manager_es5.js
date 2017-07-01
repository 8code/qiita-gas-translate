'use strict';

var RED     = '\u001b[31m';
var GREEN   = '\u001b[32m';
var YELLOW  = '\u001b[33m';
var MAGENTA = '\u001b[35m';
var CYAN    = '\u001b[36m';
var RESET   = '\u001b[0m';
var FS = require('fs-extra');
var EXEC_SYNC = require('child_process').execSync;

var PROJECT_ROOT = process.env.PWD;
var PKG_PATH = require.resolve(PROJECT_ROOT + '/package.json');
var PKG = require(PKG_PATH);


var packageManager = function(opt) {
  this.uses = opt.uses || '';
  this.globalPlugins = opt.globalPlugins || '';
  this.taskRunner = opt.taskRunner || '';
  this.taskConfig = opt.taskConfig || '';
  this.taskPrefix =  opt.taskPrefix || '';
  this.taskPath = opt.taskPath || '';
};

packageManager.prototype.checkPackages = function() {

  var _pkgStore,
      _installArr = [],
      _moduleArr = [];

  if(!PKG.localDependencies) { PKG['localDependencies'] = {}; }
  _pkgStore = JSON.parse(JSON.stringify(PKG));

  console.log(CYAN + 'front-package-manager: Check active pakages.' + RESET);

  var _self = this;
  Object.keys(this.uses).forEach(function(key) {
    if(_self.uses[key]) {
      if(!PKG.localDependencies[_self.taskPrefix + key]){
        var _packagePath = require.resolve(PROJECT_ROOT + '/' + _self.taskPath + '/' + key + '/package.json');
        var _package = require(_packagePath) || ' ';

        _moduleArr.push(_self.taskPrefix + key);
        _installArr.push(_self.taskPath + '/' + key);
        PKG.localDependencies[_self.taskPrefix + key] = _package.version || ' ';
      }
    } else {
      delete PKG.localDependencies[_self.taskPrefix + key];
    }
  });

  try {
    FS.writeFileSync(PKG_PATH, JSON.stringify(PKG, null, 2));
  } catch(e) {
    console.log(e);
  }

  //console.log(CYAN + 'front-package-manager: Start installing additional packages.' + RESET);
  //return execSync('npm --prefix $(npm root)../ i ' + _installArr.join(' '), {stdio: [0, 1, 2]});
  if(_installArr.length) {
    return execSync('ls $(npm root) | grep -x -e ' + _moduleArr.join(' -e ') + '; if [ $? == "1" ]; then npm --prefix $(npm root)/../ i ' + _installArr.join(' ') + '; fi;', {stdio: [0, 1, 2]});
  }
};

packageManager.prototype.getTask = function(task) {
  if(!this.uses[task]) {
    return;
  }

  //let taskPath = `./gulp/tasks/${ task }`;
  // if(FS.existsSync(taskPath) && FS.statSync(taskPath).isDirectory) {
  //   taskPath = `${taskPath}/${ task }`;
  // }
  console.log(CYAN + 'getTask: ' + task + ' is active.' + RESET);
  var _taskPath = require.resolve(PROJECT_ROOT + '/' + this.taskPath + '/' + task + '/' + task);
  return require(_taskPath)(this.taskRunner, this.taskConfig, this.globalPlugins);
};

module.exports = packageManager;
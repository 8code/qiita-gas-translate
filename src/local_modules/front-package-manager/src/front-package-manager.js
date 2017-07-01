'use strict';

const RED     = '\u001b[31m';
const GREEN   = '\u001b[32m';
const YELLOW  = '\u001b[33m';
const MAGENTA = '\u001b[35m';
const CYAN    = '\u001b[36m';
const RESET   = '\u001b[0m';
const FS = require('fs-extra');
const EXEC_SYNC = require('child_process').execSync;

const PROJECT_ROOT = process.env.PWD;
const PKG_PATH = require.resolve(`${PROJECT_ROOT}/package.json`);
const PKG = require(PKG_PATH);


export default class packageManager {

  constructor(opt) {
    this.uses = opt.uses || '';
    this.globalPlugins = opt.globalPlugins || '';
    this.taskRunner = opt.taskRunner || '';
    this.taskConfig = opt.taskConfig || '';
    this.taskPrefix =  opt.taskPrefix || '';
    this.taskPath = opt.taskPath || '';
  }

  checkPackages() {
    let _pkgStore,
        _installArr = [],
        _moduleArr = [];

    if(!PKG.localDependencies) { PKG['localDependencies'] = {}; }
    _pkgStore = JSON.parse(JSON.stringify(PKG));

    console.log(`${CYAN}front-package-manager: Check active pakages.${RESET}`);

    Object.keys(this.uses).forEach((key) => {
      if(this.uses[key]) {
        if(!PKG.localDependencies[this.taskPrefix + key]) {
          var _packagePath = require.resolve(`${PROJECT_ROOT}/${this.taskPath}/${key}/package.json`);
          var _package = require(_packagePath) || ' ';

          _moduleArr.push(this.taskPrefix + key);
          _installArr.push(`${this.taskPath}/${key}`);
          PKG.localDependencies[this.taskPrefix + key] = _package.version || ' ';
        }
      } else {
        delete PKG.localDependencies[this.taskPrefix + key];
      }
    });

    //console.log(CYAN + 'front-package-manager: Start installing additional packages.' + RESET);
    //return execSync('npm --prefix $(npm root)../ i ' + _installArr.join(' '), {stdio: [0, 1, 2]});
    if(_installArr.length) {
      return EXEC_SYNC(`ls $(npm root) | grep -x -e ${_moduleArr.join(' -e ')}; if [ $? == "1" ]; then npm --prefix $(npm root)/../ i ${_installArr.join(' ')}; fi;`, {stdio: [0, 1, 2]});
    }

    try {
      FS.writeFileSync(PKG_PATH, JSON.stringify(PKG, null, 2));
    } catch(e) {
      console.log(e);
    }
  }

  getTask(task) {
    if(!this.uses[task]) {
      return;
    }

    //let taskPath = `./gulp/tasks/${ task }`;
    // if(FS.existsSync(taskPath) && FS.statSync(taskPath).isDirectory) {
    //   taskPath = `${taskPath}/${ task }`;
    // }
    console.log(`${CYAN}'getTask: ${task} is active.${RESET}`);
    var _taskPath = require.resolve(`${PROJECT_ROOT}/${this.taskPath}/${task}/${task}`);
    return require(_taskPath)(this.taskRunner, this.taskConfig, this.globalPlugins);
  }

};
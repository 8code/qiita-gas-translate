const red     = '\u001b[31m';
const yellow  = '\u001b[33m';
const cyan    = '\u001b[36m';
const reset   = '\u001b[0m';

export default function (module) {
  var _arr, _mod;
  _arr = typeof module === 'string' ? [ module ] : module;

  try {
    _arr.forEach((m, i) => {
      _mod = m;
      console.log(`${yellow}checkModule: Check installed module '${m}'...(Setup)${reset}`);
      var _test = require(m);
    })
  } catch(e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      console.log(`${red}checkModule: '${_mod}' is not installed.${reset}`);
      var execSync = require('child_process').execSync;
      return execSync(`npm i ${ _arr.join(' ') }`, {stdio: [0, 1, 2]} );
    }
  }
}
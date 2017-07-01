var s2j = {
  convertSheet: {},
  getData: {}
};


// https://gist.github.com/daichan4649/50b988f66193c5bf0ffe#file-main-gs
s2j.convertSheet = function(sheet) {
  // first line(title)
  var colStartIndex = 1;
  var rowNum = 1;
  var firstRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  var firstRowValues = firstRange.getValues();
  var titleColumns = firstRowValues[0];

  // after the second line(data)
  var lastRow = sheet.getLastRow();
  var rowValues = [];
  for(var rowIndex=2; rowIndex<=lastRow; rowIndex++) {
    var colStartIndex = 1;
    var rowNum = 1;
    var range = sheet.getRange(rowIndex, colStartIndex, rowNum, sheet.getLastColumn());
    var values = range.getValues();
    rowValues.push(values[0]);
  }

  // create json
  var json = {};
  for(var i=1; i<titleColumns.length; i++) {
    json[titleColumns[i]] = {};
    for(var j=0; j<rowValues.length; j++) {
      var line = rowValues[j];
      if(line[0]) {
        if(/\//.test(line[0])) {
          var subline = line[0].split('/');
          if(!json[titleColumns[i]][subline[0]]) json[titleColumns[i]][subline[0]] = {};
          json[titleColumns[i]][subline[0]][subline[1]] = line[i];
        } else {
          json[titleColumns[i]][line[0]] = line[i];
        }
      }
    }
  }
  return json;
}

s2j.getData = function(data) {
  var book = SpreadsheetApp.openById(data.sheetId);
  var sheet = book.getSheetByName(data.sheetName);
  var json = this.convertSheet(sheet);

  Logger.log(JSON.stringify(json));
  return json;
}

/**
 * API
 */
function spread2json(f, data) {
  //var f = 'getData';
  //var data = { sheetId: '1og709ajh6JPG-uJA2nJCkFoq0tFITKX50gym4EL8ymE', sheetName: 'translate' };

  return s2j[f](data);
}
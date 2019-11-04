function check_consistency(){
  var sheet, range, m, check, m2;
  sheet = SpreadsheetApp.getActive().getSheets()[0];
  range = sheet.getRange('E2:F');
  m = range.getValues();
  check = m.every(function(r){return is_date(r[0])});
  Logger.log(check);
  m.forEach(function(r, i){
    if (!is_date(r[0])) Logger.log(i+1);
  });
}


function fix_switch_error(){
  var sheet, range, m, check, m2;
  sheet = SpreadsheetApp.getActive().getSheets()[0];
  range = sheet.getRange('E122:F1191');
  m = range.getValues();
  check = m.every(function(r){return is_date(r[1])});
  Logger.log(check);
  m2 = m.map(function(r){return [r[1], r[0]]});
  check = m2.every(function(r){return is_date(r[0])});
  Logger.log(check);
  range.setValues(m2);
}



function show_all_triggers() {
   var triggers;
 triggers =  ScriptApp.getProjectTriggers();
 triggers.forEach(function(element) {
   log(element.getHandlerFunction());
 });
}

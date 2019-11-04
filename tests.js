
function test_raw_filtering(){
  var matrix, m, m2;
  matrix = get.raw_summary();
  clog(matrix.length);
  m = apply.feed_filter(matrix);
  clog(m.length);
  m2 = remove.repeating_links(m);
  clog(m2.length);
}


function test_supplement(){
  try {
    supplement.summary(get.filtered());
  } catch(e){
    Logger.log(JSON.stringify(e));
  }
}


function test_last_row() {
  var sheet;
  sheet = SpreadsheetApp.getActive().getSheetByName(SUMMARY);
  Logger.log(sheet.getLastRow());
}

var update = {}

update.raw_summary = function(){
  var matrix, sheet;
  sheet = SpreadsheetApp.getActive().getSheetByName(RAW);
  matrix = get.consolidated_matrix();
  log('new raw summary: ' + matrix.length);
  sheet.clear();
  matrix_to_sheet(matrix, sheet, 2);
}

update.filtered = function(){
  var matrix, res, sheet;
  matrix = get.raw_summary();
  res = remove.repeating_links(apply.feed_filter(matrix));
  sheet = SpreadsheetApp.getActive().getSheetByName(FILTERED);
  log('new filtered: ' + res.length);
  sheet.clear();
  matrix_to_sheet(res, sheet, 2);
}
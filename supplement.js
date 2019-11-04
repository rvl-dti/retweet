var supplement = {};

supplement.summary = function(matrix) {
  var sheet, summary, res, vh, m;
  sheet = SpreadsheetApp.getActive().getSheetByName(SUMMARY);
  summary = get.summary_tail(sheet);//taking new order of columns
  if (matrix.length) {
    vh = mp.m_to_vh(matrix, HEADER);//converting to hashtable
    m = mp.vh_to_m(vh, NEW_HEADER);//converting back to matrix with new order
    res = substract_intersection(m, summary);
    insert_matrix_to_sheet(res, sheet, 2);
  }
  else {res = []};
  log(res.length + ' rows inserted');
}

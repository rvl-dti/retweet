var get = {};

get.row = function(name, item) {
  var title, url, author, date, guid, result, current_time;
  title = item.getChildText('title');
  title = title.replace('&amp;', '&');
  url = decodeURIComponent(item.getChildText('link'));
  author = item.getChildText('author');
  date = new Date(item.getChildText('pubDate'));
  guid = item.getChildText('guid');
  current_time = (new Date()).toLocaleTimeString();
  result = [current_time, name, title, url, author, date, guid];
  return result;
}

get.filters = function() {
  var sheet, matrix;
  sheet = SpreadsheetApp.getActive().getSheetByName(FILTERS);
  matrix = get_matrix_s(sheet);
  return matrix;
}

get.summary_tail =  function(sheet) {
  var matrix, sheet, last_row, n;
  if (!sheet) {sheet = SpreadsheetApp.getActive().getSheetByName(SUMMARY);}
  last_row = sheet.getLastRow();
  matrix = [];
  if (last_row > 1) {
    n = ((last_row - 1) > TAIL) ? TAIL: last_row - 1;
    matrix = sheet.getRange(2, 1, n, sheet.getLastColumn()).getValues();
  }
  return matrix;
}

get.raw_summary = function() {
  var matrix, sheet;
  sheet = SpreadsheetApp.getActive().getSheetByName(RAW);
  matrix = get_matrix_s(sheet);
  return matrix;
}

get.consolidated_matrix = function(){
  var result, feeds, matrix;
  result = [];
  feeds = get.feeds();
  feeds.forEach(function(row) {
    log('Retreiving ' + row[0]);
    matrix = get.feed_matrix(row[0], row[1]);
    if (matrix.length) {log('Data from ' + row[0] + ' retrived. ' + matrix.length + ' records');}
    else {
      log('No data retrived');
    }
    result = concatenate_matrix(result, matrix);
  });
  if (result.length) {result.sort(twit_sort);}
  return result;
}

get.feeds = function() {
  var ss, sheet, matrix;
  ss = SpreadsheetApp.getActive();
  sheet = ss.getSheetByName(FEEDLIST);
  matrix = get_matrix_s(sheet);
  return matrix;
}

get.remote_xml = function(url){
    var x, res;
    x = fetch({url: url + '&rand=' + new Date().getTime()});
    if (ifdef(x[1])) {res = x[1].replace(/&/g, '&amp;')}
    else {log(x[0].type + ' ' + x[0].err)};
    return res;
}

get.feed_matrix = function(name, url) {
  var xml, doc, root, channel, items, result;
  result = [];
  xml = get.remote_xml(url);
  if (xml) {
  try {
    doc = XmlService.parse(xml);
  } catch(e) {
    log('Error in get_feed_matrix: ' + e.message);
    return [];
  }
    root = doc.getRootElement();
    channel = root.getChild('channel');
    items = channel.getChildren('item');
    items.forEach(function(item){
      result.push(get.row(name, item));
    });
  }
  return result;
}

get.filtered = function() {
  var matrix, sheet;
  sheet = SpreadsheetApp.getActive().getSheetByName(FILTERED);
  matrix = get_matrix_s(sheet);
  return matrix;
}
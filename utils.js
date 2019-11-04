clog = function(x){Logger.log(x);};

function contain_date(string) {
  var found, patterns;
  found = false;
  patterns = ['\\d{2}/\\d{2}', '\\d{2}/\\d{2}/\\d{2}','\\d{2}/\\d/\\d{2}', 
    '\\b(?:January|February|March|Apr|May|June|July|August|September|October|November|December)\\b(\\s*)(\\d{1,2})',
    '\\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\b(\\s*)(\\d{1,2})'
  ];
  found = patterns.some(function(pattern) {
    var regexp, test;
    regexp = new RegExp(pattern, 'i');
    test = regexp.test(string); 
    return test;
  });
  return found;
}

//::a -> a
function identity(x){return x};

function ifdef(x){return !ifundef(x)};

function ifundef(x){
  if (typeof x == 'undefined') return true;
  if (x == null) return true;
  else return false;
};

//::{url: String, options: GUrlFetchAppOptions, f: Function} -> Either Error String
function fetch(x) {
  var res, res_code, f;
  try {
    if (ifdef(x.option)){res = UrlFetchApp.fetch(x.url, x.options)}
    else {res = UrlFetchApp.fetch(x.url)}

    res_code = res.getResponseCode();
    if (res_code == 200) {
      if (x.f == undefined) {f = identity} else {f = x.f}
      return [null, f(res.getContentText())];
    }
    else {
      return [{type: 'Bad response code', err: res}, null];
    }
  } catch(e) {
    return [{type: 'UrlFetchApp.fetch error', err: e}, null];
  }
}


function is_date(a) {return {}.toString.call(a) === '[object Date]'};

function add_fields(obj, v) {
  v.forEach(function(field) {obj[field.toUpperCase()] = field});
  return obj;
}


function log(string, level) {
    var sheet, matrix, last, level_in;
  if (!LOGGING) return;
  if (level !== undefined) {
    level_in = LOG_LEVELS.indexOf(level)>-1;
  }
  else {level_in = true;}
  if (!level_in) return;
  sheet = SpreadsheetApp.getActive().getSheetByName('log');
  matrix =[ [ new Date(), Session.getEffectiveUser(), string]];
  insert_matrix_to_sheet(matrix, sheet, 1);
  last = sheet.getLastRow();
  if (last>= LOG_LENGTH) {sheet.deleteRow(last);}
  sheet.getRange(1, 1).activate().getValue();
  
}

function twit_sort(a, b) {
  var time_a, time_b;
  time_a = new Date(a[5]).getTime();
  time_b = new Date(b[5]).getTime();
  if (time_a < time_b) return 1;
  if (time_a > time_b ) return -1;
  return 0;   
}

function reset() {
   auth();
   remove_triggers();
   form_initial_menu();
}

function remove_triggers() {
 var triggers;
 triggers =  ScriptApp.getProjectTriggers();
 triggers.forEach(function(element) {
   ScriptApp.deleteTrigger(element);
 });
}

function trigger_installed(func_name, triggers) {
 var triggers, res, i;
 res = false;
 if (triggers) {triggers =  ScriptApp.getProjectTriggers();}
 for(i=0;i<triggers.length;i++) {
   if (triggers[i].getHandlerFunction() == func_name) {res = true;break;}
 }
  return res;
}


function put_header(sheet, header) {
  var range;
  range = sheet.getRange(1, 1, 1, header.length);
  range.setValues([header]);
}

function reinstall_triggers() {
  var user;
  remove_triggers();
  install_triggers();
}

function get_row_digest(row, skip) {
  var string;
  string = '';
  if (skip == undefined) {skip = 0;}
  row.forEach(function(item, i) {
    if ((i+1)>skip) {string+=item.toString().trim();}
  });
  return get_md5(string);
}


function row_in_matrix(row, matrix) {
  var row_digest, found;
  row_digest = get_row_digest(row, 2);
  found = matrix.some(function(arr) {
    var digest;
    digest = get_row_digest(arr, 2);
    return (digest == row_digest);
  });
  return found;
}


function substract_intersection(m1, m2) {
  var res;
  res = [];
  if (m2.length) {
    m1.forEach(function(row) {
      if (! row_in_matrix(row, m2)) {res.push(row);}
    });
  }
  else {res = m1}
  return res;
}

function insert_matrix_to_sheet(matrix, sheet, start_row) {
  var range;
  if (matrix.length) {
    sheet.insertRows(start_row, matrix.length);
    range = sheet.getRange(start_row, 1, matrix.length, matrix[0].length);
    range.setValues(matrix);
  }
}

function remove_duplicates(matrix) {
  var res, obj;
  res = [];obj = {};
  matrix.forEach(function(row) {
    var string, prop;
    string = '';
    row.forEach(function(item) {
      string+= item.toString();
    });
    prop = get_md5(string);
    Logger.log(prop);
    if (obj[prop] == undefined) {
      obj[prop] = true;
      res.push(row);
    }
  });
  return res;
}


function get_md5(string) {
  var digest;
  digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string);
  return (Utilities.base64Encode(digest));
}


function matrix_to_sheet(matrix, sheet, start_row) {
  //sheet must exists! 
  var range;
  if (matrix.length) {
    range = sheet.getRange(start_row, 1, matrix.length, matrix[0].length);
    range.setValues(matrix);
  }
}

function concatenate_matrix(m1, m2) {
  var n1, n2, i, res;
  n1 = m1.length;
  n2 = m2.length;
  for (i = n1;i<(n1 + n2);i++) {
    m1.push(m2[i - n1].slice());
  }
  return m1;
}


function get_matrix(sheet) {
  var range = sheet.getDataRange();
  var values = range.getValues();
  return values;
}


function get_matrix_s(sheet) {
  //gets all data range without first row (where headers are placed)
  var values = get_matrix(sheet);
  values.shift();
  return values;
}
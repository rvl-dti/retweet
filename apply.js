var apply = {};

apply.feed_filter = function(matrix) {
  var res, filters;
  res = []; filters = get.filters();
  matrix.forEach(function(row) {
    var skip;
    skip = false;
    //Logger.log(row);
    filters.forEach(function(filter) {
      var column, target, pattern, regexp, position, action, replacement, reg2;
      column = COLUMNS.indexOf(filter[0]);
      target = row[column]; pattern = filter[2].toString().trim();
      position = filter[3]; action = filter[4];
      replacement = filter[5];
      //Logger.log('target: ' + target + ', pattern: ' + pattern + ', action: ' + action + ', replacement: |' + replacement + '|');
      switch (position) {
        case 'begin':
          pattern = '^' + pattern;
          break;
        case 'any':
        default: 
      }
      if (pattern == '{{date}}') {
        if (contain_date(target)) {skip = true;}
      }
      else {
        regexp = new RegExp(pattern);
        if (regexp.test(target)) {
          switch (action) {
            case 'replace':
              //Logger.log('REPLACING');
              reg2 = new RegExp(pattern, 'g');
              target = target.replace(reg2, replacement);
              row[column] = target;
              break;
            case 'skip':
            default:
              skip = true;
          }
        }
      }
    });
    if (! skip) {res.push(row);}
  });
  return res;
}
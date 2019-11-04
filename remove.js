var remove = {};

remove.repeating_links = function(matrix) {
  var res, obj;
  res = [];obj = {};
  matrix.forEach(function(row) {
    var prop;
    prop = row[3];
    if (obj[prop] == undefined) {
      obj[prop] = true;
      res.push(row);
    }
  });
  return res;
}
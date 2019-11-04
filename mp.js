//matrix module 1.2 from yyk@mail.ru
(function () {
  //v - vector, tm - tower matrix (vertical), bm - bridge matrix(horizontal);
  var get_md5, get_row_digest, vh_to_m, m_to_vh, csv_to_m, row_in_matrix, empty_matrix, add_car, v_tm, m_v, 
  delete_columns, matrix_intersection, add_only_unique, substract_intersection, expand_matrix, add_column_to_matrix,
  detect_empty_columns, squeeze_matrix, get_column, trim_matrix, remove_duplicates, sort_by_column, apply_filter, 
  shuffle, summarize_column, concatenate_matrix, rotate_clockwise;
  
  rotate_clockwise = function(m){
    var m_, i, j;
    m_= [];
    for(i=0;i<m[0].length;i++){
      m_[i] = [];
      for(j=0;j<m.length;j++){
        m_[i][j] = m[j][i];
      };
    };
    return m_;
  }
  
  concatenate_matrix = function(m1, m2) {
    var n1, n2, i, res;
    if (empty_matrix(m1)) {return m2.map(function(row){return row;});}
    res = m1.map(function(row){return row;});
    if (empty_matrix(m2)) {return res;};
    n1 = m1.length;
    n2 = m2.length;
    for (i = n1;i<(n1 + n2);i++) {
      res.push(m2[i - n1].slice());
    }
    return res;
  }
  
  summarize_column = function(matrix, column) {
    var i, res;
    res = 0;
    for(i=0;i<matrix.length;i++) {
      res+=matrix[i][column];
    }
    return res;
  }
  
  shuffle = function(arr) {
    var n, res, i, arr_copy, rand;
    n = arr.length;
    arr_copy = arr.slice();
    res = [];
    for (i=0;i<n;i++) {
      res[i]=[];
      rand = get_random_int(0, n-1-i);
      res[i] = arr_copy[rand];
      arr_copy.splice(rand, 1);
    }
    return res;
  }
  
  apply_filter = function(matrix, field, fn) {
    var n = matrix.length;
    var res = [];
    for (var i=0;i<n;i++) {
      if (fn(matrix[i][field])) {
      res.push(matrix[i]);
      }
    }
    return res;
  }
  
  sort_by_column = function(matrix, column) {
    var res;
    res = matrix.sort(function (a, b) {
      if (a[column]<b[column]) return -1;
      if (a[column]>b[column]) return 1;
      if (a[column]==b[column]) return 0;
    });
    return res;
  }
  
  remove_duplicates = function(matrix) {
    var res, obj;
    res = [];obj = {};
    matrix.forEach(function(row) {
      var prop;
      prop = get_row_digest(row);
      if (obj[prop] == undefined) {
        obj[prop] = true;
        res.push(row);
      }
    });
    return res;
  }
  
  trim_matrix = function(matrix) {
    while(matrix[matrix.length - 1][0] === '') {
      matrix.pop();
    }
    return matrix;
  }
   
  get_column = function(matrix, column) {
    var res, i;
    res = [];
    for (i=0;i<matrix.length;i++) {
      res[i] = matrix[i][column];
    }
    return res;//returns array!
  }  

  
  squeeze_matrix = function(matrix, squeeze_data) {
    //input matrix, squeeze_data - array of Numbers or array of Numbers;
    var res;
    res = [];
    matrix.forEach(function(row) {
      var new_row;
      new_row = [];
      squeeze_data.forEach(function(item) {
        var string, sub;
        if (Array.isArray(item)) {
          sub = [];
          item.forEach(function(index) {
            if (row[index].trim() != '') {sub.push(row[index]);}     
          });
          string = sub.join(' | ');
        }
        else {
          string = row[item];
        }
        new_row.push(string);
      });
      res.push(new_row);
    });
    return res;
  }
  
  detect_empty_columns = function(matrix) {
    var counters;
    counters = new Array(matrix[0].length);
    matrix.forEach(function(row) {
      row.forEach(function(item, i) {
        if (item !== '') {counters[i] = true;}
      });
    });
    return counters;
  }
  
  add_column_to_matrix = function(matrix, value) {
    var i, n;
    n = matrix.length;
    for (i=0;i<n;i++) {
      matrix[i].push(value);
    }
    return matrix;
  }
  
  expand_matrix = function(m1, m2) {
    var res;
    res = [];
    if (m1.length !== m2.length) return;
    m1.forEach(function(row, i) {
      res.push(row.concat(m2[i]));
    });
    return res;
  }
  
  substract_intersection = function(m1, m2) {
    var res;
    if (empty_matrix(m2)) {return m1.map(function(x){return x;});};
    if (empty_matrix(m1)) {return [[]];};
    res = m1.filter(function(row) {
      return !row_in_matrix(row, m2);
    });
    return res;
  }
  
  add_only_unique = function(m1, m2) {
    //adds to m1 only unique rows from m2
    var diff, res;
    diff = mp.substract_intersection(m2, m1);
    res = mp.concatenate_matrix(m1, diff);
    return res;
  }
  
  matrix_intersection = function(m1, m2) {
    var res;
    res = [];
    if (m2.length) {
      m1.forEach(function(row) {
        if (row_in_matrix(row, m2)) {res.push(row);}
      });
    }
    return res;
  }
      
  delete_columns = function (matrix, from, to) {
      var i, result_matrix;
      result_matrix = [];
      for(i=0;i<matrix.length;i++) {
        matrix[i].splice(from, to-from+1); 
      }
      return matrix;
    }
  
  m_v = function(m) {
    //turns matrix to array concatenating rows
    var res, i, j, item;
    res = [];
    for (i=0;i<m.length;i++) {
        for (j=0;j<m[i].length;j++) {
            item = m[i][j];
            res.push(item);
        }
    }
  }
  v_tm = function(v) {
    var tm;
    tm = v.map(function(item){return [item];});
    return tm;
  }
  
  add_car = function(value, m) {
    var res;
    res = m.map(function(row) {
      return [value].concat(row);
    });
    return res;
  }
  
  empty_matrix = function (m) {return m.length == 1 && m[0].length == 0;}
  
  row_in_matrix =  function(row, matrix) {
      //check if given row matches some row in matrix
      var row_digest, found;
      row_digest = get_row_digest(row);
      found = matrix.some(function(arr) {
        var digest;
        digest = get_row_digest(arr);
        return (digest == row_digest);
      });
      return found;
  }
  
  csv_to_m = function (args, o) {
  //this function transforms cvs to matrix using time limits in arguments
  //input args: text - csv text, start - position to start from (form continious calculations), time_limit - time in seconds for process
  //output - transformed matrix, last index - last processed row, timeout - flag if the calculations reached the time limit
  var t1, t2, diff, od, i, a, r, f, p, q, s, timeout, start_index, block_full, offset;
  t1 = new Date().getTime();
  timeout = block_full = false;
  s = args.text;
  if (args.start == undefined) {start_index = 0;}
  else {start_index = args.start;};
  od = {
        'fSep': ',',
        'rSep': '\r\n',
        'quot': '"',
        'head': false,
        'trim': false
    }
    if (o) {
        for (i in od) {
            if (!o[i]) o[i] = od[i];
        }
    } else {
        o = od;
    }
    a = [['']];
    r = f = q = 0;
    for (p = start_index; p < s.length; p++) {
        switch (c = s.charAt(p)) {
        case o.quot:
            if (q && s.charAt(p + 1) == o.quot) {
                a[r][f] += o.quot;
                ++p;
            } else {
                q ^= 1;
            }
            break;
        case o.fSep:
            if (!q) {
                if (o.trim) {
                    a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                }
                a[r][++f] = '';
            } else {
                a[r][f] += c;
            }
            break;
        case o.rSep.charAt(0):
            if (!q && (!o.rSep.charAt(1) || (o.rSep.charAt(1) && o.rSep.charAt(1) == s.charAt(p + 1)))) {
                if (o.trim) {
                    a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                }
                t2 = new Date().getTime();
                diff = t2 - t1;
                timeout = diff > args.time_limit*1000;
                if (args.block_size) {
                  offset = o.head ? 1 : 0;
                  if ((r + 1) == (args.block_size + offset)) {block_full = true;}
                }
                if (timeout || block_full) {break;}
                a[++r] = [''];
                a[r][f = 0] = '';
                if (o.rSep.charAt(1)) {
                    ++p;
                }
            } else {
                a[r][f] += c;
            }
            break;
        default:
            a[r][f] += c;
        }
      if (timeout || block_full) {break;}
    }
    if (o.head) {
        a.shift()
    }
    if (a[a.length - 1].length < a[0].length) {
        a.pop()
    }
    
    return {matrix: a, last_index: p, timeout: timeout, block_full: block_full}
    }
    
    m_to_vh = function(m, headers) {
      //input: matrix with first row containing columns headers;
      //output: vector of hashtables (v_of_h) where keys of the hashes is columns headers
      var v_of_h, skip;
      skip = false;
      if (headers == undefined) {headers = m[0];skip = true;}
      if (headers.length !== m[0].length) {
        throw {message: 'headers not fit'};
      }
      v_of_h = [];
      m.forEach(function(r, i) {
        var h;
        if (!i && skip) return;
        h = {};
        headers.forEach(function(item, j) {
          h[item] = r[j];
        });
        v_of_h.push(h);
      });
      return v_of_h;
    }
    
    get_md5 = function(string) {
      var digest;
      digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string);
      return (Utilities.base64Encode(digest));
    }
      
    vh_to_m = function(v_of_o, headers) {
      //v_of_h - vector(array) of hashtables
      //returns matrix
      var matrix;
      matrix = [];
      v_of_o.forEach(function(obj) {
        var keys, row;
        keys = Object.keys(obj);
        row = [];
        headers.forEach(function(header) {
           if (~keys.indexOf(header)) {
             row.push(obj[header]);
           }
        });
        matrix.push(row);
      });
      return matrix;
    }
      
    get_row_digest = function(row) {
      var string;
      string = '';
      row.forEach(function(item) {
        string+=item.toString().trim();
      });
      return get_md5(string);
    }

    mp = {};
    mp.rotate_clockwise = rotate_clockwise;
    mp.concatenate_matrix = concatenate_matrix;
    mp.summarize_column = summarize_column;
    mp.shuffle = shuffle;
    mp.apply_filter = apply_filter;
    mp.sort_by_column = sort_by_column;
    mp.remove_duplicates = remove_duplicates;
    mp.trim_matrix = trim_matrix;
    mp.get_column =  get_column;
    mp.squeeze_matrix = squeeze_matrix;
    mp.detect_empty_columns = detect_empty_columns;
    mp.add_column_to_matrix = add_column_to_matrix;
    mp.expand_matrix = expand_matrix;
    mp.substract_intersection = substract_intersection;
    mp.add_only_unique = add_only_unique;
    mp.matrix_intersection = matrix_intersection;
    mp.delete_columns = delete_columns;
    mp.convert = {};
    mp.convert.v_tm = v_tm;
    mp.add_car = add_car;
    mp.empty_matrix = empty_matrix;
    mp.row_in_matrix = row_in_matrix;
    mp.csv_to_m = csv_to_m;
    mp.m_to_vh = m_to_vh;
    mp.vh_to_m = vh_to_m;  
})();
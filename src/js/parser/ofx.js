
module.exports = function(){

  var serialize = function(header, body) {
    var out = '';
    // header order could matter
    var headers = ['OFXHEADER', 'DATA', 'VERSION', 'SECURITY', 'ENCODING', 'CHARSET',
      'COMPRESSION', 'OLDFILEUID', 'NEWFILEUID'];

    headers.forEach(function(name) {
      out += name + ':' + header[name] + '\n';
    });
    out += '\n';

    out += objToOfx({ OFX: body });
    return out;
  }

  var objToOfx = function(obj) {
    var out = '';

    Object.keys(obj).forEach(function(name) {
      var item = obj[name];
      var start = '<' + name + '>';
      var end = '</' + name + '>';

      if (item instanceof Object) {
        if (item instanceof Array) {
          item.forEach(function(it) {
            out += start + '\n' + objToOfx(it) + end + '\n';
          });
          return;
        }
        return out += start + '\n' + objToOfx(item) + end + '\n';
      }
      out += start + item + '\n';
    });

    return out;
  }

  return {
    serialize: serialize
  };
}();


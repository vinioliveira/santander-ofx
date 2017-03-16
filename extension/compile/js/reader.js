var SantanderParser = {
  parse: function(document) {
    var extratoFrame = this.findIFrameByName(
      'iDetalhes',
      this.findIFrameByName(
        'iframePrinc',
        this.findFrameByName(
          'Corpo',
          this.findFrameByName('Principal', document)[0].contentWindow.document
        )[0].contentWindow.document
      )[0].contentWindow.document
    )[0];

    return this.colectExpenses(
      $('.lista:first tr.trClaro', extratoFrame.contentWindow.document)
    );
  },

  colectExpenses: function(trs) {
    return trs.map(function(index,tr){
      var tds = $('td', tr);
      return {
        date: $(tds[0]).text().trim(),
        desc: $(tds[1]).text().trim(),
        real: $(tds[2]).text().trim(),
        dolar: $(tds[3]).text().trim()
      };
    });
  },

  findFrameByName: function(name, document) {
    return $('frame[name=' + name + ']', document);
  },

  findIFrameByName: function(name, document){
    return $('iframe[name=' + name + ']', document)
  }
};

chrome.runtime.sendMessage({
    action: "getSource",
    source: SantanderParser.parse(document)
});

var santander = require('./parser/santander');
var downloader = require('./download');
var $ = require('jquery');

var readPage = function(){
  var message2 = document.querySelector('#message');

  chrome.tabs.executeScript(
    null
    , { file: 'compile/js/jquery-3.1.1.js' }
    ,function() {
      chrome.tabs.executeScript(
        null
        // , { code: 'chrome.runtime.sendMessage({ action: "getSource", source: santanderParser.parse(document.firstChild) })' }
        , { file: 'compile/js/reader.js' }
        , function() {
          if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
          }
      });
  });
};

var download = function(file, fileName){
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  var blob = new Blob([file], {type: "octet/stream"});
  var url = URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

var listener = function(request, sender) {
  if (request.action == "getSource") {
    var ofx = santander.ofx(request.source);
    download(ofx, 'santander.ofx');
  }
}

$(function() {
  $('.main-box .download').click(function(){
    readPage();
  });
})

chrome.runtime.onMessage.addListener(listener);

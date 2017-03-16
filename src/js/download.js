module.exports = {
  doDownload : function(contents){
    this.contents = contents;

    if (this.savedFileEntry) {
      this.exportToFileEntry(this.savedFileEntry);
    } else {
      chrome.fileSystem.chooseEntry( {
          type: 'saveFile',
          suggestedName: 'santander.ofx',
          accepts: [ { description: 'Open Financial XML (*.ofx)',
              extensions: ['ofx']} ],
          acceptsAllTypes: true
      }, this.exportToFileEntry);

    }
  },

  exportToFileEntry : function(fileEntry) {
    this.savedFileEntry = fileEntry;

    var status = document.getElementById('status');

    chrome.fileSystem.getDisplayPath(fileEntry, function(path) {
      fileDisplayPath = path;
      status.innerText = 'Exporting to '+ path;
    });


    fileEntry.createWriter(function(fileWriter) {
      var truncated = false;
      var blob = new Blob([this.contents]);

      fileWriter.onwriteend = function(e) {
        if (!truncated) {
          truncated = true;
          // You need to explicitly set the file size to truncate
          // any content that might have been there before
          this.truncate(blob.size);
          return;
        }
        status.innerText = 'Export to '+fileDisplayPath+' completed';
      };

      fileWriter.onerror = function(e) {
        status.innerText = 'Export failed: '+e.toString();
      };

      fileWriter.write(blob);

    });
  }
}

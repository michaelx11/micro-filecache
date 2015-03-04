var fs = require('fs');
var exec = require('child_process').exec;

exec('mkdir -p data');

// returns array of log entries {filename: "", index: ""}
function getLogEntries() {
  var logFile = fs.readFileSync('logfile.txt', {encoding: "utf-8"});
  var entries = logFile.trim().split("\n");
  var log = [];
  for (var i in entries) {
    var entry = entries[i].split(" -%%- ");
    var logEntry = {filename: entry[0], index: i};
    log.push(logEntry);
  }
  return log;
}

// returns index
function appendToLogFile(filename, filesize) {
  fs.appendFileSync("logfile.txt", filename + " -%%- " + filesize + "\n");
  return getLogEntries().length;
}

// synchronous
exports.uploadFile = function(filedata) {
  if (!filedata) {
    return -1;
  }
  var filename = filedata.originalFilename;
  var path = filedata.path;
  var numBytes = filedata.size;

  if (!filename || !path) {
    return -1;
  }

  var entryIndex = appendToLogFile(filename, numBytes);
  exec('cp ' + path + ' data/' + entryIndex);
  console.log('uploaded: ' + filename + ' index: ' + entryIndex);
  return entryIndex;
}

function serveFile(id, filename, res) {
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  var fileStream = fs.createReadStream('data/' + id);
  fileStream.pipe(res);
}

function serveError(res) {
  res.write('404 Not Found\n');
  res.end();
}

exports.getFile = function(id, req, res) {
  id--;
  var log = getLogEntries();
  if (id == 'head' | id == 'current') {
    if (log.length > 0) {
      id = log.length - 1;
    } else {
      id = -1;
    }
  }

  if (id >= 0 && id < log.length) {
    serveFile(id, log[id].filename, res);
    console.log('Served: ' + log[id].filename + ' at id: ' + id);
  } else {
    serveError(res);
  }
}

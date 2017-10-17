var bodyParser = require('body-parser');
var express = require('express');
var http = require('express');
var hbs = require('hbs');
var model = require('./model');
var morgan = require('morgan');

var app = express();

app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(morgan('dev'));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.post('/upload', function(req, res) {
  var index = model.uploadFile(req.files.filedata);
  res.end(index + "\n");
});

app.get('/list', function(req, res) {
  res.setHeader('Content-Type: text/plain'), 
  res.write(model.getList(req, res));
  res.end();
});

app.get('/:id', function(req, res) {
  model.getFile(req, res);
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

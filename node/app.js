var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var http = require('express');
var hbs = require('hbs');
var model = require('./model');
var morgan = require('morgan');

var app = express();

app.set('port', config.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(morgan('dev'));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  if (req.params.token === config.SECRET) {
    next();
  } else {
    res.status(403).send();
  }
});

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

var express = require('express');
var http = require('express');
var hbs = require('hbs');
var model = require('./model');

var app = express();

app.set('port', 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.cookieParser());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({ secret: 'SECRET' }));

app.use(app.router);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/upload', function(req, res) {
  var index = model.uploadFile(req.files.filedata);
  res.end(index + "\n");
});

app.get('/list', function(req, res) {
  res.send(model.getList(req, res));
});

app.get('/:id', function(req, res) {
  model.getFile(req, res);
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

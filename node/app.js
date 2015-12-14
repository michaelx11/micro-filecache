var express = require('express');
var fs= require('fs');
var https = require('https');
var hbs = require('hbs');

var model = require('./model');
var authConfig = require('./authConfig');

var app = express();

app.set('port', authConfig.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.cookieParser());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({ secret: 'SECRET' }));

app.use(authenticateWrapper);
app.use(app.router);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function authenticateWrapper(req, res, next) {
  req.clientCertCN = req.socket.getPeerCertificate().subject.CN;
  console.log("Verified request from: " + req.clientCertCN);
  next();
}

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

var options = {
  key: fs.readFileSync(authConfig.serverKey),
  cert: fs.readFileSync(authConfig.serverCert),
  ca: fs.readFileSync(authConfig.rootCACert),
  requestCert: true,
  rejectUnauthorized: true
};

httpsServer = https.createServer(options, app);

httpsServer.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

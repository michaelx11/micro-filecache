var bodyParser = require('body-parser');
var config = require('./config');
var connectMultiparty = require('connect-multiparty');
var crypto = require('crypto');
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
app.use(connectMultiparty());

TOKEN_EXPIRATION = 2 * 60 * 1000; // 2 minutes
// To be filled with a temporary token that lasts at most 5 minutes
var tempTokenObj = {
  creationTime: 0,
  token: null
};

// Check the token
app.use(function(req, res, next) {
  if (req.headers['x-auth'] === config.SECRET) {
    next();
  } else if (tempTokenObj.token && req.query.token === tempTokenObj.token) {
    if ((new Date()).getTime() - tempTokenObj.creationTime <= TOKEN_EXPIRATION) {
      next();
    } else {
      tempTokenObj.creationTime = 0;
      tempTokenObj.token = null;
      res.status(403).send();
    }
  } else {
    res.status(403).send();
  }
});

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/temp_auth', function(req, res) {
  crypto.randomBytes(4, function (ex, buf) {
    if (ex) {
      // Server error!
      res.status(500).send(ex);
      return;
    }
		let tempToken = buf.toString('hex');
    tempTokenObj.token = tempToken;
    tempTokenObj.creationTime = (new Date()).getTime();
    res.send("Token: " + tempToken + " expires in 5 minutes.\n");
  });
});

app.post('/upload', function(req, res) {
  var index = model.uploadFile(req.files.filedata);
  res.end(index + "\n");
});

app.get('/list', function(req, res) {
  res.setHeader('Content-Type', 'text/plain'), 
  res.write(model.getList(req, res));
  res.end();
});

app.get('/:id', function(req, res) {
  model.getFile(req, res);
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

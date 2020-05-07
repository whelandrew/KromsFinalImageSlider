var http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var mongoose = require('mongoose');
var passport = require('passport');

var numCPUs = require('os').cpus().length;
var debug = require('debug')('api:server');

var indexRouter 	= require('./routes/index');
var dbRouter 		= require('./routes/dropbox');
var authRouter		= require('./routes/auth');

var isDev = process.env.NODE_ENV !== 'production';
//var PORT = normalizePort(process.env.PORT || '9000');
var PORT = 'https://evening-thicket-69000.herokuapp.com/';
var session      = require('express-session');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected to database'));

require('./config/passport')(passport);

var app = express();

app.set('port', PORT);
app.set('trust proxy', 1);

var server = http.createServer(app);
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);	

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
	// named pipe
	return val;
  }

  if (port >= 0) {
	// port number
	return port;
  }

  return false;
}

function onError(error)
{
  if (error.syscall !== 'listen') {
	throw error;
  }

  var bind = typeof port === 'string'
	? 'Pipe ' + port
	: 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
	case 'EACCES':
	  console.error(bind + ' requires elevated privileges');
	  process.exit(1);
	  break;
	case 'EADDRINUSE':
	  console.error(bind + ' is already in use');
	  process.exit(1);
	  break;
	default:
	  throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
	? 'pipe ' + addr
	: 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cors());

app.use(session({
  secret: 'donotforgetmyname24601',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

//GET////
app.get('/dropboxLogin', passport.authenticate('dropbox-oauth2'));

app.get('/auth/dropbox/callback', 
  passport.authenticate('dropbox-oauth2', { failureRedirect: '/', params:{'response_type':'token'} }),
  function(req, res) 
  {
    // Successful authentication, redirect home.		
	res.render('index', { title:'Dropbox Login', body:res});
});

app.get('/loggedIn', function(request,response)
{
	let code = request.query.code;	
	//have bearer token
	console.log('/loggedIn');
	response.redirect('/Callback/?token='+code);
});

app.use('/db', dbRouter);
app.use('/auth', authRouter);
app.use('/', indexRouter);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
	response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
  
module.exports = app;
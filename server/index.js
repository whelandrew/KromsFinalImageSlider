var http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var fs = require('fs');
var numCPUs = require('os').cpus().length;
var jwt = require('express-jwt');
var jwksRsa = require('jwks-rsa');
var debug = require('debug')('api:server');

var indexRouter 	= require('./routes/index');
var usersRouter 	= require('./routes/users');
var dbRouter 		= require('./routes/dropbox');

var isDev = process.env.NODE_ENV !== 'production';
var PORT = normalizePort(process.env.PORT || '9000');

var app = express();

app.set('port', PORT);

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
app.set('view engine', 'jade');

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cors());

app.use('/db', dbRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

//GET////
// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
	response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

app.get("/getData", function(request, response, next) {
	console.log('getData');	
	let data = fs.readFileSync('./DBFolders.json'), folders;	
	try
	{
		folders = JSON.parse(data);				
		response.send(folders)
	}
	catch(err)
	{
		console.log(err);
		response.send(folders);
	}
});

//POST////
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
	cache: true,
	rateLimit: true,
	jwksRequestsPerMinute: 5,
	jwksUri: `https://dev-fm2wv99w.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: '7oOamgAhmy2W0XAq3wRnHgCmbagollKO',
  issuer: `https://dev-fm2wv99w.auth0.com/`,
  algorithms: ['RS256']
});

app.post("/saveData", function(request,response,next)
{		
	let data = JSON.stringify(request.body);			
	fs.writeFile('./DBFolders.json', data, 
		function (err) 
		{
			if (err)
				response.send(err);
			
			response.send(request.body);
		});
});



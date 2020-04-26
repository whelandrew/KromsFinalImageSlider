var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var fs = require('fs');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

var indexRouter 	= require('./routes/index');
var usersRouter 	= require('./routes/users');
var dbRouter 		= require('./routes/dropbox');

const isDev = process.env.NODE_ENV !== 'production';

if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
	var app = express();

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

	var database = [];

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
				
				//console.log(data);
				response.send(request.body);
			});
	});

	app.use('/', indexRouter);
	app.use('/users', usersRouter);
	app.use('/db', dbRouter);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  next(createError(404));
	});

	// error handler
	app.use(function(err, req, res, next) {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};

	  // render the error page
	  res.status(err.status || 500);
	  res.render('error');
	});
}

module.exports = app;

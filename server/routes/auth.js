const express = require('express');
const router = express.Router();
var fs = require('fs');
var jwt = require('express-jwt');
var jwksRsa = require('jwks-rsa');

router.get("/getData", function(request, response, next) {
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

router.post("/saveData", function(request,response,next)
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

module.exports = router;
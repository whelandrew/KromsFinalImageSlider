const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');
var fs = require('fs');
	
router.get("/getData", function(request, response, next) {	
	fs.readFile('DBFolders.json', (err, data) => {
	  if (err) {
		console.error(err)
		response.send(err);
	  }
	  else
		response.send(data);
	});
});	

router.post("/saveData", function(request,response,next)
{
	let data = JSON.stringify(request.body);
	fs.writeFile('DBFolders.json', data, { flag : 'w' },
		function (err) 
		{
			if (err)
				response.send(err);
			
			response.send(request.body);
		});
});

module.exports = router;
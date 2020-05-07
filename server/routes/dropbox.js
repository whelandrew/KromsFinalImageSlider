const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');
const app = require('../index.js');

router.post('/getToken', function(request, response)
{
	console.log('/getToken');	
	axios({
		method : 'post',
		url : 'https://api.dropboxapi.com/oauth2/token',
		params : 
		{
			code : request.body.code,
			grant_type : 'authorization_code',
			redirect_uri : 'https://evening-thicket-69000.herokuapp.com/loggedIn',
			client_id : 'h9fot2c8bxz7gcg',
			client_secret : '8and8ga191ii1kp'
		}
	})
	.then(function(res)
	{
		response.json(res.data);
	})
	.catch(function(error)
	{
		console.log(error);
		response.status(500).send(error);
	});
});

router.post('/profile', function(request, response, next)
{	
	console.log('profile');
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/users/get_account',
		data : 
		{
			account_id : "dbid:" + request.body
		},
		headers: {
				'Content-Type' : 'application/json', 
				'Authorization' : 'Bearer ' + request.body
			}
	})
	.then(function (res)
	{	
		response.send(res.data);		
	})
	.catch(function (error) {
		console.log(error);
		response.status(500).send(error);
	});
});

router.post('/getAllFolders', function (request, response, next)
{  		
	console.log('getAllFolders');	
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/files/list_folder',
		data:{
				'path': '',
				'recursive': false,
				'include_media_info': false,
				'include_deleted': false,
				'include_has_explicit_shared_members': false,
				'include_mounted_folders': true,
				'include_non_downloadable_files': false
			},
		headers: {
				'Content-Type' : 'application/json', 
				'Authorization' : request.body.bearer
			}
	})
	 .then(function (res)
	 {		
		response.send(JSON.stringify(res.data));				
	})
	.catch(function (error) {		
		console.log(error);
		response.status(500).send(error);
	});	
});	

router.post('/metaFileData', function(request, response, next)
{	
	console.log('metaFileData');
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/sharing/get_file_metadata',
		data : 
		{
			file : request.body.shared_folder_id,
			actions : []
		},
		headers: {
				'Content-Type' : 'application/json', 
				'Authorization' : request.body.token
			}
	})
	.then(function (res)
	{	
		response.send(res.data);		
	})
	.catch(function (error) {
		console.log(error);
		response.status(500).send(error);
	});
});

router.post('/moveFile', function(request, response, next)
{	
	console.log('moveFile');
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/files/move_v2',
		data : {
		from_path : request.body.fromFolder,
		to_path : request.body.toFolder,
		allow_shared_folder : false,
		autorename : false,
		allow_ownership_transfer : false
	},
		headers: {
				'Content-Type' : 'application/json', 
				'Authorization' : request.body.token
			}
	})
	.then(function (res)
	{
		response.send(res.data);
	})
	.catch(function (error) {
		console.log(error);
		response.status(500).send(error);
	});
});

router.post('/metaFileDataBatch', function(request, response, next)
{		
	let files = JSON.parse(request.body.files);

	console.log('metaFileDataBatch');
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/sharing/get_file_metadata/batch',
		data : {
				'files': files,
				'actions':[]
			},
		headers: {
				'Content-Type' : 'application/json', 
				'Authorization' : request.body.token
			}
	})
	.then(function (res)
	{
		response.send(res.data);		
	})
	.catch(function (error) {
		console.log(error);
		response.status(500).send(error);
	});
});

router.post('/getImages', function (request, response, next)
{
	console.log('getImages');
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/files/list_folder',
		data: {
			"path": request.body.getFrom,
			"recursive": false,
			"include_media_info": false,
			"include_deleted": false,
			"include_has_explicit_shared_members": false,
			"include_mounted_folders": true,
			"include_non_downloadable_files": true
		},
		headers: {
				'Content-Type' : 'application/json', 
				'Authorization' : request.body.token
			}
	})
	 .then(function (res)
	 {
		response.send(JSON.stringify(res.data.entries));
	})
	.catch(function (error) {
		console.log(error);
		response.status(500).send(error);
	});		
});	

module.exports = router;
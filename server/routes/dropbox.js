const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');
const app = require('../index.js');

const options = {
				'Content-Type' : 'application/json', 
				'Authorization' : "Bearer RvRO6h55szQAAAAAAAH2txU3jqcMgYHn-zdktTsTEKrHG39t0xdEjuUk-MxXr7Fy"
			};

router.get('/getAllFolders', function (request, response, next)
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
		headers: options
	})
	 .then(function (res)
	 {
		response.send(JSON.stringify(res.data));				
	})
	.catch(function (error) {		
		response.status(500).send(error);
	});	
});	

router.post('/metaFileData', function(request, response, next)
{
	let data = {
			file : request.body.shared_folder_id,
			actions : []
		};
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/sharing/get_file_metadata',
		data : data,
		headers: options
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
		headers: options
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
	let data = request.body;
	
	axios({
		method: 'post',
		url: 'https://api.dropboxapi.com/2/sharing/get_file_metadata/batch',
		data : {
				'files': data,
				'actions':[]
			},
		headers: options
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
		headers: options
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
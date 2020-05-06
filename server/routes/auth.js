const express = require('express');
const router = express.Router();
const User = require('../models/user');

function signUp(token)
{
	console.log('signUp');
}

//get all
router.get('/', async (req, res) =>
{
	try
	{
		const users = await User.find();
		res.json(users);
	}
	catch(err)
	{
		res.status(500).json({ message: err.message });
	}
});

//get one
router.get('/:id', getUser, (req, res) =>
{	
	res.json(res.user);
});

//create one
router.post('/', async (req, res) =>
{	
	console.log('post');
	console.log(req.body);
	
	const user = new User({
		account_id: req.body.account_id,
		bearer: req.body.bearer,
		toFolder : req.body.toFolder,
		fromFolder: req.body.fromFolder,
		fromFolderID: req.body.fromFolderID,
		noFolder: req.body.noFolder
	});	
	
	try
	{
		const newUser = await user.save();
		res.status(201).json(newUser);
	}
	catch(err)
	{
		res.status(400).json({ message : err.message });
	}
});

//update one
router.patch('/:id', getUser, async (req, res) => 
{
	if(req.body.folders != null) res.user.folders = req.body.folders;
	
	try 
	{
		const updatedUser = await res.user.save();
		res.json(updatedUser);
	}
	catch(err)
	{
		res.status(400).json({ message : err.message });
	}
});


//delete one
router.delete('/:id', getUser, async (req, res) => 
{
	try
	{
		await res.user.remove();
		res.json({ message: "Deleted!" });
	}
	catch(err)
	{
		res.status(500).json({ message: err.message });
	}
});

async function getUser(req, res, next)
{	
	console.log('getUser');
	console.log(req);
	try
	{
		user = await User.find({account_id:req.paramters.id});
		if(user === undefined || user === null) return res.status(404).json({ message: "Can't find subscriber" });
		res.user = user;
		next;
	}
	catch(err)
	{
		return res.status(500).json({ message: err.message });
	}
};

module.exports = router;
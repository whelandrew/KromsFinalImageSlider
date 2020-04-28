import React from 'react';
import { withRouter } from 'react-router-dom';
import DropboxChooser from 'react-dropbox-chooser';
import './DroboxChooser.css';
import auth0Client from '../Auth';
import axios from 'axios';
import icon from '../Assets/drobboxlogo.png';

const dotenv = require('dotenv');
dotenv.config();

class Dropbox extends React.Component {
  constructor(props) {
    super(props);
	
	this.getFiles = this.getFiles.bind(this);
	this.saveFolders = this.saveFolders.bind(this);
	this.onCancel = this.onCancel.bind(this);
	this.getFolderSet = this.getFolderSet.bind(this);
	this.setSaveToFolder = this.setSaveToFolder.bind(this);
	this.setNoFolder = this.setNoFolder.bind(this);

    this.state = 
	{      
		APP_KEY:'h9fot2c8bxz7gcg',
		database: null,
		folderSet:null,
		saveTo: null,
		noFolder: null,
		fromFolder: null		
    };
  }
	async componentDidMount() 
	{		
		try
		{
			const database = (await axios.get('/auth/getData')).data;	
			this.setState({database:{database}});	
		
			if(this.database !== undefined)
			{
				this.props.history.push({
					pathname:'/Carousel',
					state: {
						database:database
					}					
				});
			}
			else
			{
				this.getFolderSet();
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}

  setSaveToFolder(e)
  {
	let val = JSON.parse(e.target.value)
	let name = val.path_display;
	this.setState({saveTo:name});				
  }
  
  setNoFolder(e)
  {
	let val = JSON.parse(e.target.value)
	let name = val.path_display;		
	this.setState({noFolder:name});
  }
  
  async saveFolders(files)
  {
	console.log('saveFolders');	
	
	fetch('/db/metaFileData',
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
			{ 
				"shared_folder_id" : files[0].id,		
			})		
		})
		.then( res => { return res.json(); })
		.then( data =>
		{			
			let path = data.path_display.replace(data.name,'');			
			fetch('/auth/saveData',
			{
				method:'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(
				{ 
					"id" : auth0Client.getProfile().aud,
					"fromFolder" :
					{ 
						id: files[0].id, 
						name: path
					},
					"saveTo" : this.state.saveTo,
					"noFolder" : this.state.noFolder				
				}),
			})
			.then( res => { return res.json(); })
			.then( data => 
			{		
				this.props.history.push({
					pathname:'/Carousel',
					state: {
						database:data
					}					
				});
			});
		});
  }
  
  getFolderSet()
  {
	  console.log("getFolderSet");
	  fetch('/db/getAllFolders')
		.then( res => { return res.json(); })		
		.then( data => 
		{			
			if(data === undefined)
				console.log("no files found");
			else
			{				
				let folders = data.entries.filter(obj => {return obj['.tag']==='folder'});
				this.setState({folderSet:folders});			
			}
		}).catch(function(e) 
		{
			console.log(e);
		});
  }
  
  getFiles(files) 
  {
	  console.log(files);
  }
  
  onCancel()
  {
	  console.log("canceled");
  }

  render() {
	  if(this.state.database === undefined) this.getFolderSet();
    return (		
		 <div className="contentWindow">					 
			<div id="foldersBody" className='grid-container'>	
				{	this.state.folderSet === null 
				&& <h1> Loading... </h1>}
				{	this.state.folderSet != null	
					&& <ul>
						<div>
							<li> Choose A Folder To Keep Files </li>								
							{this.state.folderSet.map((item,key)=>								
							<li key={item.id}>
								<button className="grid-item btn btn-info" name={item.id} id={item.id} value={JSON.stringify(item)} onClick={this.setSaveToFolder}>{item.name}
								</button>
							</li>)}	
						</div>
						<div>
						<li> Choose A Folder To Move Unwanted Files Into </li>
							{this.state.folderSet.map((item,key)=>
								<li key={item.id}>
								<button className="grid-item btn btn-warning" name={item.id} id={item.id} value={JSON.stringify(item)} onClick={this.setNoFolder}>{item.name}</button>							
							</li>)}
						</div>
					</ul>
				}
			</div>
			{	this.state.saveTo != null
				&& this.state.noFolder != null	
				&& <div id='modal' className='modal'>
						<div className='modal-content'>
							<div>
								<span>Select one file from the folder that you want to get images from.</span>
								<DropboxChooser 
									id="chooser"
									appKey={this.state.APP_KEY}
									success={files => this.saveFolders(files)}
									cancel={() => this.onCancel()}
									multiselect={false} 
									folderselect={true}
									extensions={['images']}>
									<button size="lg" className='btn btn-info'><img src={icon} alt="Find A Folder In Dropbpx"/>Dropbox Chooser</button>				
								</DropboxChooser>
							</div>
						</div>
					</div>
		 }}
		</div>		
    )
  }
}

export default withRouter(Dropbox);
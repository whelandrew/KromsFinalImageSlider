import React from 'react';
import { withRouter } from 'react-router-dom';
import DropboxChooser from 'react-dropbox-chooser';
import './DroboxChooser.css';
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
		accountData: null,
		folderSet:null,
		saveTo: null,
		noFolder: null,
		fromFolder: null		
    };
  }
	async componentDidMount() 
	{		
		this.getFolderSet();
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
	
	fetch('http://localhost:9000/db/metaFileData',
	{
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(
		{ 
			"shared_folder_id" : files[0].id,
			"token" : this.props.location.state.access_token
		})		
	})
	.then( res => { return res.json(); })
	.then( data =>
	{	
		let path = data.path_display.replace(data.name,'');			
		fetch('/auth',
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body:JSON.stringify(
			{
				account_id: this.props.location.state.account_id,
				bearer: this.props.location.state.access_token,
				toFolder : this.state.saveTo,
				fromFolder: path,
				fromFolderID: files[0].id,
				noFolder: this.state.noFolder
			})
		})
		.then( res => { return res.json(); })
		.then( data => 
		{				
			console.log(data);		
			this.props.history.push({pathname:'/Carousel',state: {accountData:[data]}});			
		});		
	});
  }
  
  getFolderSet()
  {
	  console.log("getFolderSet");	  
	  fetch('http://localhost:9000/db/getAllFolders',
		{
				method:'POST',
				headers: {'Content-Type': 'application/json'},
				body:JSON.stringify({bearer:this.props.location.state.access_token})				
		})
		.then( res => { return res.json(); })
		.then( data => 
		{	
			if(data.entries.length < 1)
				console.log("no folders found");
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
    return (
		<div className="contentWindow">			
			<div id="foldersBody" className='grid-container'>					
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
			}
		</div>
    )
  }
}

export default withRouter(Dropbox);
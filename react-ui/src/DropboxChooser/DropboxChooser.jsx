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
			fromFolder: null,
			token:null,
			loggedIn: false
			
		};
	}
	
	async componentDidMount() 
	{	
		this.setState({loggedIn:this.props.location.state.loggedIn});
		this.setState({token:this.props.location.state.token});
		if(this.props.location.state.database !== undefined)
		{
			this.setState({database:this.props.location.state.database});
			this.props.history.push({
					pathname:'/Carousel',
					state: {
						database:this.props.location.state.database,
						token:this.props.location.state.token
					}					
				});
		}
		else
			this.getFolderSet(this.props.location.state.token);
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
		fetch('/db/metaFileData',
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
			{ 
				"shared_folder_id" : files[0].id,	
				"token" : this.state.token
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
					"fromFolder" :
					{ 
						id: files[0].id, 
						name: path
					},
					"saveTo" : this.state.saveTo,
					"noFolder" : this.state.noFolder,
					"token": this.state.token
				}),
			})
			.then( res => { return res.json(); })
			.then( data => 
			{		
				this.props.history.push({
					pathname:'/Carousel',
					state: {
						database:data,
						token:this.state.token
					}					
				});
			});
		});
	}	
  
	getFolderSet(token)
	{
		fetch('/db/getAllFolders', 
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body:JSON.stringify({"token": token})
		})
		.then( res => { return res.json(); })
		.then( data =>
		{				
			let folders = data.entries.filter(obj => {return obj['.tag']==='folder'});
			this.setState({folderSet:folders});		
			this.setState({loggedIn:true});
		}).catch(function(e) 
		{
			console.log(e);
		});
	}
  
	onCancel()
	{
		console.log("canceled");
	}

	render() {	
		return ( <div className="contentWindow">		
				{!this.state.loggedIn && <h1> Loading... </h1>}		
				
				{this.state.folderSet != null && 
					<div className="container">
						<div className="row">
							<div className="col-sm">
							  <span>Choose A Folder To Keep Files.</span>
							  {this.state.folderSet.map((item,key)=>								
								<div key={item.id}>
									<button className="grid-item btn btn-info" name={item.id} id={item.id} value={JSON.stringify(item)} onClick={this.setSaveToFolder}>{item.name}
									</button>
								</div>)}
							</div>
							<div className="col-sm">
							  <span>Choose A Folder To Move Unwanted Files Into.</span>
							  {this.state.folderSet.map((item,key)=>								
								<div key={item.id}>
									<button className="grid-item btn btn-info" name={item.id} id={item.id} value={JSON.stringify(item)} onClick={this.setNoFolder}>{item.name}
									</button>
								</div>)}
							</div>
						</div>
					</div>}	
				{this.state.saveTo != null &&
				 this.state.noFolder != null &&					
					<div id="chooser" className="modal">  
						<div className="modal-content">
							<h5 className='modal-title'> Dropbox Chooser </h5>
							<button type="button" className="close btn btn-warning" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
							<span> Select one file from the folder that you want to get images from.</span>
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
					}
			</div>)
	}
}

export default withRouter(Dropbox);
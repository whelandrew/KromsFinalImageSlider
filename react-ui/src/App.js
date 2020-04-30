import React from 'react';
import { Route, withRouter } from 'react-router-dom';

import NavBar from './NavBar/NavBar';
import Dropbox from './DropboxChooser/DropboxChooser';
import Carousel from './Carousel/Carousel';
import Callback from './Callback/Callback';

class App extends React.Component 
{
	constructor(props) 
	{
		super(props);
		
		this.state = 
		{
			token:null,
			database:null,
			loggedIn:false
		}
	}
  
	async componentDidMount() 
	{	
		if(this.props.location.pathname === '/Callback')
		{
			this.setState({token:this.props.history.location.state.token});
			this.setState({loggedIn:true});
			this.props.history.replace('/Dropbox',{token:this.props.history.location.state.token});
		}
		else
		{
			fetch('/auth/getData')
			.then(res => { return res.json(); })
			.then(res => 
			{ 
				if(res.hasOwnProperty('token'))
				{
					this.setState({token:res.token});
					this.setState({database:res});
					this.setState({loggedIn:true});
					this.props.history.replace('/Dropbox',{token:res.token, database:res, loggedIn:true});					
				}				
			});							
		}
	}	
	
	render() {
		return (
		<div>
			<NavBar state={ this.state }/>
			<div>		
				{	this.state.token !== null && 
					<Route exact path='/Dropbox' component={ Dropbox } state={ this.state }/>
				}
				<Route exact path='/Callback' component={ Callback }/>
				<Route exact path='/Carousel' component={ Carousel } state={ this.state }/>
			</div>		
		</div>
	);
  }
}

export default withRouter(App);
import React from 'react';
import './NavBar.css';
import logo from '.././Assets/logo.png';

export default class NavBar extends React.Component {
	constructor(props)
	{
		super(props);
		
		this.signOut = this.signOut.bind(this);
		this.signIn = this.signIn.bind(this);	
		
		this.state = { token : null }
	}	
	
	signOut()
	{
		this.props.location.hash = "";
		this.setState({token:null});		
		this.setState({isReady:false});
		this.props.history.replace('/');
	}
	
	signIn()
	{
		window.open('https://www.dropbox.com/oauth2/authorize?client_id=h9fot2c8bxz7gcg&response_type=token&redirect_uri=http://localhost:9000/Callback', '_self');
	}
	
	render()
	{					
		console.log(this.props.state);
		return(<div>
			<nav id='navbar' className="navbar navbar-dark bg-primary fixed-top">				
					<img id="brand" className="navbar-brand" src={logo} alt=""/> Krom's Image Slider
				<div>
					{!this.props.state.loggedIn && <button className="btn btn-info" onClick={this.signIn}>Sign In</button>}
					{this.props.state.loggedIn &&
						<div>
						  <button className="btn btn-dark" onClick={this.signOut}>Sign Out</button>
						</div>}
				</div>
			</nav>			
			{!this.props.state.loggedIn && 
				<div id="centerSignInButton">
					<button className="btn btn-info" onClick={this.signIn}>Sign In to Dropbox Start Sorting!</button>
				</div>}			
		</div>);
	}
}
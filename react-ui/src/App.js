import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import './App.css';
import logo from './Assets/logo.png';

import Callback from './Callback';
import Dropbox from './DropboxChooser/DropboxChooser';
import Carousel from './Carousel/Carousel';

class App extends React.Component 
{
	constructor(props) 
	{
		super(props);
		this.state = 
		{
			signedIn:false
		}
	}
	
	async componentDidMount() 
	{
		
		if (this.props.location.pathname === '/Callback/') 
		{			
			this.props.history.push({pathname: '/signup',search: this.props.location.search});
			this.setState({signedIn:true});
		}		
	}
  render() 
  {
	  return(<div>		
		<nav id='navbar' className="navbar navbar-dark bg-primary fixed-top">			
			<img src={logo} alt=""/> Krom's Image Slider				
		</nav>		
		
		<div id="contentWindow">
			{!this.state.signedIn && 
				<div id="signIn"> 
					<h1>Kroms Image Slider</h1> 
					<a href='/dropboxLogin' id="centerSignInButton"> 
						<button className="btn btn-info">Sign In</button> 
					</a> 
				</div>
			}
				
			<Route exact path='/signup' component={Callback}/>
			<Route exact path='/setfolders' component={Dropbox}/>
			<Route exact path='/Carousel' component={Carousel}/>
		
		</div>
	  </div>);
  }
}

export default withRouter(App);
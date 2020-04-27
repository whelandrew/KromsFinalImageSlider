import React from 'react';
import {Route, withRouter} from 'react-router-dom';

import auth0Client from './Auth';
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
			checkingSession: true,
		}
	}
  
	async componentDidMount() 
	{
		if (this.props.location.pathname === '/Callback') 
		{
			this.setState({checkingSession:false});
			return;
		}
		try 
		{
			await auth0Client.silentAuth();
			this.forceUpdate();
		} 
		catch (err) 
		{ 
			if (err.error !== 'login_required') 
			{
				console.log(err);
			}
		}
	}
	
  render() {
    return (
      <div>
		<NavBar />
			<div>
			{	auth0Client.isAuthenticated() 
				&& 	<Route exact path='/' component={Dropbox}/>
			}		
			<Route exact path='/Callback' component={Callback}/>
			<Route exact path='/Carousel' component={Carousel}/>
		</div>
      </div>
    );
  }
}

export default withRouter(App);
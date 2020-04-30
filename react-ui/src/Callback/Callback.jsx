import React from 'react';
import {withRouter} from 'react-router-dom';

class Callback extends React.Component {
	constructor(props)
	{
		super(props)
		this.state=
		{
			token:null
		}
	}
	
	async componentDidMount() 
	{
		try
		{		
			let hash = this.props.location.hash.replace('#access_token=','');			
			let auth_token = 'Bearer ' + hash.substr(0, hash.indexOf('&'));			
			this.props.history.replace('/',{token:auth_token});		
		}
		catch(e)
		{
			console.log(e);
			this.props.history.push('/');
		}
	}

	render() 
	{
		return (<p>Loading profile...</p>);
	}
}

export default withRouter(Callback);
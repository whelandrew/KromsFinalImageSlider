import React from 'react';
import {withRouter} from 'react-router-dom';

class Callback extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = 
		{
			token: null,
			account_id:null,
			uid:null,
			access_token:null
		}
	}
	
	async componentDidMount()
	{
		let token = this.props.location.search.replace('?token=','');
		this.setState({token:token});
		
		fetch('/db/getToken',
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({code:token})
		})
		.then(res => { return res.json()})
		.then(res => 
		{
			let bearer = 'Bearer ' + res.access_token;
			this.setState({account_id:res.account_id});
			this.setState({access_token:bearer});
			this.setState({uid:res.uid});
			
			//find out if account already exists
			fetch('/auth/?id='+res.account_id)
			.then(res => {return res.json()})
			.then(res =>
			{				
				if('account_id' in res[0])
				{
					//begin creating new account
					this.props.history.push({pathname: '/setfolders',state:this.state});
				}
				else
				{
					//send account info to Carousel
					this.props.history.push({pathname:'/Carousel',state: {accountData:res[0]}});
				}
				
			});
		});
	}
	
	render()
	{
		return (
			<div>
				<h1>Loading...</h1>
			</div>)
	}
}

export default withRouter(Callback);
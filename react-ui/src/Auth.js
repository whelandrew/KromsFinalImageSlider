import React from 'react';


export default class Auth extends React.Component
{
	constructor(props)
	{
		super(props);
		
		this.signOut = this.signOut.bind(this);
		this.signIn = this.signIn.bind(this);	
	}	
	
	componentDidMount()
	{
		const { clientID } = 'h9fot2c8bxz7gcg';
	}
	
	signIn()
	{
		fetch('https://www.dropbox.com/oauth2/authorize?client_id=h9fot2c8bxz7gcg&response_type=token&redirect_uri=http://localhost:9000/Callback')
		.then(data =>
		{
			console.log(data);
		});
	}
	
	signOut()
	{
		
	}
}



/*import React from 'react';

class Auth
{
	constructor()
	{
		this.silentAuth = this.silentAuth.bind(this);
		this.isAuthenticated = this.isAuthenticated.bind(this);
		this.signOut = this.signOut.bind(this);
		this.getProfile = this.getProfile.bind(this);
		this.signIn = this.signIn.bind(this);
		
		this.state = 
		{
			authorized :false,
			token:""
		}
	}
	
	async componentDidMount() 
	{		
	}
	
	silentAuth()
	{
	}
	
	isAuthenticated()
	{
		return this.state.authorized;
	}
	
	signIn()
	{		
		console.log('signIn');
		fetch('https://www.dropbox.com/oauth2/authorize?client_id=h9fot2c8bxz7gcg&response_type=code&redirect_uri=http://localhost:9000/Callback')
		.then( response => response.text() )
		.then(data =>
		{
			console.log(data);
		})
		.catch(err => {
			console.log(err);
		});
	}	
	
	signOut()
	{
	}
	
	getProfile()
	{
	}
}

const dbAuth = new Auth();

export default dbAuth;

/*
import auth0 from 'auth0-js';
require('dotenv').config();


class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: 'dev-fm2wv99w.auth0.com',
      audience: 'https://dev-fm2wv99w.auth0.com/userinfo',
      clientID: "7oOamgAhmy2W0XAq3wRnHgCmbagollKO",
      redirectUri: "http://localhost:9000/Callback",
      //redirectUri: "https://evening-thicket-69000.herokuapp.com/Callback",
      responseType: 'id_token',
      scope: 'openid profile'
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    this.auth0.logout({
      //returnTo: "https://evening-thicket-69000.herokuapp.com",      
      returnTo: "http://localhost:9000",      
      clientID: "7oOamgAhmy2W0XAq3wRnHgCmbagollKO",
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {		
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;
*/
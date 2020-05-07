import React from "react";

import "./Carousel.css";
import "./slick.css";
import "./slick-theme.css";

import { HeartFill, XSquareFill } from 'react-bootstrap-icons';
import Slider from "react-slick";

export default class Carousel extends React.Component 
{	
	constructor(props) {
		super(props);				

		this.getImages = this.getImages.bind(this);

		this.state = {
			images:null,			
			sliderProps:
			{
				dots: false,
				infinite: true,
				speed: 500,
				slidesToShow: 1,
				slidesToScroll: 1,
				loading: true
			}
		}
	}	
	
	async componentDidMount()
	{
		console.log('Carousel');		
		this.getImages();
	}
	
	rebuildSet(data, toFolder) 	
	{
		console.log("rebuildSet");	
		const sendToFolder = toFolder +'/' + data.result.name;
		const fromFolder = this.props.location.state.accountData[0].fromFolder + data.result.name;
		
		fetch('/db/moveFile', 
		{
			method: "POST",			
			headers: {'Content-Type': 'application/json'},
			body:JSON.stringify(
			{
				fromFolder:fromFolder,
				toFolder:sendToFolder,
				token:this.props.location.state.accountData[0].bearer
			})
		})
		.then( res => { return res.json(); })
		.then( data => {	
			let file = data.metadata;			
			let list = this.state.images;			
			for(let i=0;i<list.length;i++)
					if(list[i].result.name === file.name)
						list.splice(i,1);
					
			this.setState({images:list});			
			
		}).catch((error) => 
		{
			console.error('Error:', error);
		});
	}
	
	getImages() 
	{		
		console.log('getImages');	
		fetch('/db/getImages',
		{
			method:'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
			{
				getFrom:this.props.location.state.accountData[0].fromFolder,
				token:this.props.location.state.accountData[0].bearer
			}),
		})
		.then( res => { return res.json(); })
		.then( data => 
		{		
			console.log('batchMetaData');
			
			const cap = 50;
			if(data.length > cap) data = data.slice(0,cap);
			
			let idArr = [];
			data.forEach(i=>idArr.push(i.id));	
			idArr = JSON.stringify(idArr);
			
			fetch('/db/metaFileDataBatch',
			{
				method:'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(
					{
						files:idArr,
						token:this.props.location.state.accountData[0].bearer
					}
				)
			})
			.then( res => { return res.json(); })
			.then( data => 
			{				
				this.setState({images:data});				
			});		
		});
	}
	
	render() 
	{
		return (			
			<div>
				{	this.state.images === null
					&& <h1 key="loading" id="loading">Loading...</h1>
				}
				{	this.state.images != null
					&& <div key='carousel' id='carousel'>							
						<div key="carouselTopBar" id="carouselTopBar" className='grid-container'>		
							<p key="grid1" className="grid-item">Save to</p>
							<p key="grid2"className="grid-item">Get from</p>
							<p key="grid3"className="grid-item">Move to</p>
						</div>
						<Slider key="slider" {...this.state.sliderProps} id='SliderMain'>								
							{this.state.images.map((item,key)=>									
							<div id="item" key={item.id + item.name}>
									<h3 id="caption" key='{item.id}h3'>{item.result.path_display}</h3>
										<div className="row" key='{item.id}Row'>
											<div className="column" key='{item.id}yesCol'>
												<button id='yesButton' className="btn btn-success" key='{item.id}yesButton' onClick={()=>this.rebuildSet(item, this.props.location.state.accountData[0].toFolder)}>
													<HeartFill 
														key='{item.id}Like'
														alt="Like"
														size={150} 
														style={{"paddingTop":"50px",
														"fill":"white"}}>
													</HeartFill>
													<br key='{item.id}yesbr'/>
													<h4 key='{item.id}yesFolder'>{this.props.location.state.accountData[0].toFolder}</h4>
													{document.onkeydown = this.checkKey}
												</button>
												</div>
												<div className="column" key='{item.id}imgCol'>
												<button key='{item.id}a' href={item.result.preview_url} target='_blank'>
													<img key='{item.id}img' className="center" src={item.result.preview_url.replace('dl=0','dl=1')} alt="Oops! This one didn't load. Try refreshing."/>	
												</button>
												</div>
												<div className="column" key='{item.id}noCol'>
												<button id='noButton' className="btn btn-danger" key='{item.id}noButton' onClick={()=>this.rebuildSet(item, this.props.location.state.accountData[0].noFolder)}>
													<XSquareFill 
														key='{item.id}Dislike'
														alt="Dislike"
														size={150} 
														style={{"paddingTop":"50px",
														"fill":"white"}}>
													</XSquareFill>
													<br key='{item.id}nobr'/>
													<h4 className='nofolder' key='{item.id}noFolder'>{this.props.location.state.accountData[0].noFolder}</h4>
												</button>
											</div>
										</div>
								</div>
							)}
							</Slider>
					</div>
				}
			</div>
		);	
	}
}
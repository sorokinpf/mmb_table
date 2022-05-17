import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'

export default class CellsOptions extends React.Component {

	constructor() {
		super();
		this.state = {
			checked:'big_parts',
			free_checked: null,
		}
	}

	text_table = {
		default: 'По участкам выбора и линейным',
		days: 'По дням',
		big_parts: 'СК + ПФ',
		free: 'Свободный выбор'
	}

	componentDidMount() {
		let free_checked = this.props.points.map( item=> {
			return {id: item.levelpoint_id,
					checked: this.props.selected_points.map(x=>x.levelpoint_id)
							 .includes(item.levelpoint_id)
					}
		});
		this.setState({free_checked});
		//prepareData(this.onLoad);
	}

	applyClick = (e) => {
		let selected_points=[];
		switch(this.state.checked) {
		  case 'default':  
		  	selected_points = this.props.default_points;
		  	break;
		  case 'days':  
		  	let prom = this.props.points.filter( item => 
		  							item.levelpoint_name.includes('Финиш 1 этапа'))[0];
		  	selected_points = [this.props.points[0],prom,this.props.points[this.props.points.length-1]];
		  	break;
		  case 'big_parts':
		  	selected_points = this.props.points.filter( item => 
			
				item.levelpoint_name.includes ('Старт') || 
				item.levelpoint_name.includes ('иниш') ||
				item.levelpoint_name.includes ('Смена')

			)
		  	break;
		  case 'free':
		  	selected_points=this.props.points.filter( item => 
		  		this.state.free_checked.filter(x=>x.checked).map(x=>x.id).includes(item.levelpoint_id));
		  	break;
		}
		this.props.onPartsChange(selected_points);

	}

	onCheckBoxChange = (e) => {
		let new_free_checked = this.state.free_checked;
		let item = new_free_checked.filter(x=>x.id == e.target.id)[0];
		item.checked = !item.checked;
		this.setState({free_checked: new_free_checked});
	}

	radioBoxClicked = (e) => {
		if (e.target.id == this.state.checked)
			return;
		this.setState({checked: e.target.id})
		
		
	}



    render() {
    	let all_keys = Object.keys(this.text_table);
    	let checkboxes = all_keys.map( (item) => {
    		return (<div className="form-check mmb-checkbox" key={'cell_option_'+item}>
						<input className="form-check-input small " type="radio" value="" id={item} checked={this.state.checked==item} onChange={this.radioBoxClicked}/>
						<label className="form-check-label small" for="flexCheckDefault" id={item} onClick={this.radioBoxClicked}>
						{this.text_table[item]}
						</label>
					</div>)
    	})
    	let free = null;
    	if (this.state.checked=='free')
    	{	
    		//Найдем внутренние точки выбора (без краев) и соеденим в массив.
    		const inner_choose = this.props.choose_parts.map( part => part.slice(1,-1)).reduce( (prev,item) => prev.concat(item),[]);
    		free = this.props.points.map( item => {
    			if(inner_choose.includes(item.levelpoint_name))	{
    					return null;
    			}
    			return (<div className="form-check form-check-inline"><input key={'parts_options_'+item.levelpoint_id} 
    					className="form-check-input small" 
    					type="checkbox" 
    					value=""
    					checked={this.state.free_checked.filter(x=>x.id==item.levelpoint_id)[0].checked} 
    					id={item.levelpoint_id}
    					onChange={this.onCheckBoxChange}/>
    					<label class="form-check-label" for="inlineCheckbox1">
    						{item.levelpoint_name}
    					</label>			
    			</div>);
    		});
    	}

    	return (<div className="row">
	    			<div className="col-md-3 col-xs-0"></div>
	    			<div className="col-md-6 col-xs-12">
		    			<div className="container border rounded-3">
		    				<div className="row">
		    					<div className="col-md-3 col-xs-0"></div>

			    				<div className="col-md-6 col-xs-12 mmb-checkboxlist">
									{checkboxes}
								</div>
							</div>
							<div className="row">
								<div className="col-md-2"></div>
								<div className="col-md-8 col-xs-12 mmb-checkboxlist">
								{free}
								</div>
							</div>
							<div><button className="btn btn-primary apply-btn" onClick={this.applyClick}>Применить</button></div>
						</div>
					</div>
				</div>);

   }
}
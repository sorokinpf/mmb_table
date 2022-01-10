import React from 'react';
import ReactDOM from 'react-dom';
import {cell_table} from '../utils'
import './style.css'

export default class CellsOptions extends React.Component {

	constructor() {
		super();
		this.state = {
			checked: null
		}
	}

	componentDidMount() {
		this.setState({checked: this.props.cells});
		//prepareData(this.onLoad);
	}

	checkBoxClicked = (e) => {
		//debugger;
		//e.preventDefault();
		let new_checked = [...this.state.checked];
		if(!this.state.checked.includes(e.target.id))
		{
			new_checked = new_checked.concat([e.target.id])
		}
		else
		{
			new_checked = new_checked.filter(x=> x!=e.target.id);
		}
		console.log(new_checked)
		this.setState({checked: new_checked});
		return;
	}

	applyClick = (e) => {
		this.props.onCellsChange(this.state.checked);
	}



    render() {
    	if(!this.state.checked){ return <h1>Loading</h1>;}
    	let all_keys = Object.keys(cell_table);
    	let checkboxes = all_keys.map( (item) => {
    		return (<div className="form-check mmb-checkbox" key={'cell_option_'+item}>
						<input className="form-check-input small " type="checkbox" value="" id={item} checked={this.state.checked.includes(item)} onChange={this.checkBoxClicked}/>
						<label className="form-check-label small" htmlFor="flexCheckDefault">
						{cell_table[item]}
						</label>
					</div>)
    	})
    	return (
	    		<div className="row">
	    			<div className="col-md-3 col-xs-0"></div>
	    			<div className="col-md-6 col-xs-12">
		    			<div className="container border rounded-3">
		    				<div className="row">
		    					<div className="col-md-3 col-xs-0"></div>
	    						<div className="col-md-6 col-xs-12">
			    			
									{checkboxes}
									<div><button className="btn btn-primary btn-cells" onClick={this.applyClick}>Применить</button></div>
								</div>
							</div>
						</div>
					</div>
				</div>);

   }
}
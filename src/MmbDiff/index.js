import React from 'react';
import ReactDOM from 'react-dom';
import Options from '../Options';
import Table from '../Table';

export default class MmbDiff extends React.Component {

	constructor() {
		super();
		this.state = {
			inited: false,
			selected_points: null,
			cells: ['part_result','lag','coef','summ_lag','place','total_result','total_place'],
			main_team: null,
			selected_teams: [],
			order_by: null
		}
	}

	onCellsChange = (new_cells) => {
		this.setState({cells: new_cells});
	}

	onPartsChange = (new_parts) => {
		console.log('onPartsChange');
		console.log(new_parts);
		this.setState({selected_points:new_parts, order_by: null});
	}

	componentDidMount() {
		if (!this.state.main_team)
			this.setState({main_team: this.props.teams[1]});
			this.setState({selected_teams: [this.props.teams[4]]});
		if (!this.state.selected_points)
		{
			let selected_points = this.props.points.filter( item => 
			
				item.levelpoint_name.includes ('Старт') || 
				item.levelpoint_name.includes ('иниш') ||
				item.levelpoint_name.includes ('Смена')

			)
			console.log('selected');
			console.log(selected_points);
			
			this.setState({selected_points,order_by:null});
		}
		//this.setState({selected_teams: [this.props.teams[4]]});
		this.setState({inited: true});
		//prepareData(this.onLoad);
	}

    render() {
    	let default_points_names = ['Старт 1 этапа','4','13','22','24','Финиш 1 этапа','Старт 2 этапа','38','Финиш 2 этапа'];
    	let default_points = this.props.points.filter( item=>default_points_names.includes(item.levelpoint_name));
    	if (!this.state.inited)
    	{
    		return(<h1>Loading</h1>);
    	}
    	return (<div>
    				<h1>ММБ {this.props.title}</h1>
    				<Options teams={this.props.teams}
    					   points={this.props.points}
    					   default_points={default_points}
    					   selected_points={this.state.selected_points}
    					   selected_teams={this.state.selected_teams}
    					   main_team={this.state.main_team}    					   
    					   cells={this.state.cells}
    					   onCellsChange={this.onCellsChange}
    					   onPartsChange={this.onPartsChange}/>
    				<Table teams={this.props.teams}
    					   points={this.props.points}
    					   selected_points={this.state.selected_points}
    					   selected_teams={this.state.selected_teams}
    					   main_team={this.state.main_team}
    					   order_by={this.state.order_by}
    					   cells={this.state.cells}/>
    			</div>);

   }
}
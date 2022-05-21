import React from 'react';
import ReactDOM from 'react-dom';
import CellsOptions from '../CellsOptions'
import PartsOptions from '../PartsOptions'
import TeamsOptions from '../TeamsOptions'
import './style.css'
import { getSavedData } from '../service/DataService';

export default class Options extends React.Component {

	constructor() {
		super();
		this.state = {
			showParts: false,
			showTeams: false,
			showCells: false

		}
	}

	names = {parts: 'Настройки участков',
			 teams: 'Настройки команд',
			 cells: 'Настройки ячеек'}

	componentDidMount() {
		//prepareData(this.onLoad);
	}

	onDownload = () => {
		console.log("onDownload");
		//debugger;
		function download(filename, text) {
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	  element.setAttribute('download', filename);

	  element.style.display = 'none';
	  document.body.appendChild(element);

	  element.click();

	  document.body.removeChild(element);
		}
		download('mmb_table.json',JSON.stringify(getSavedData()));

	}

	onClick= (e) => {
		if(e.target.id==='exportButton')
		{
			this.onDownload();
			return;
		}
		this.setState({[e.target.id]: !this.state[e.target.id]})
	}

    render() {

    	const parts = this.state.showParts ? 
    	<div>
    		<PartsOptions points={this.props.points} 
    				      selected_points={this.props.selected_points} 
    				      default_points={this.props.default_points}
    				      onPartsChange={this.props.onPartsChange}
                          choose_parts={this.props.choose_parts}/>
    	</div> : <div/>;
    	const teams = this.state.showTeams ? 
    	<div>
    		<TeamsOptions teams={this.props.teams}
    					  main_team={this.props.main_team}
    					  selected_teams={this.props.selected_teams}
    					  onMainTeamChange={this.props.onMainTeamChange}
    					  onSelectedTeamsChange={this.props.onSelectedTeamsChange}/>
    	</div> : <div/>;
    	const cells = this.state.showCells ? 
    	<div>
    		<CellsOptions cells={this.props.cells}
    					  onCellsChange={this.props.onCellsChange}/>
    	</div> : <div/>; 

		const partsOptions = <div><div className="btn-group option-button"><a className="btn btn-outline-primary btn-sm dropdown-toggle" href="#" role="button" id="showParts" aria-expanded="false" onClick={this.onClick}>{this.names.parts}</a></div> {parts}</div>
    	const teamsOptions = <div><div className="btn-group option-button"><a className="btn btn-outline-primary btn-sm dropdown-toggle" href="#" role="button" id="showTeams" aria-expanded="false" onClick={this.onClick}>{this.names.teams}</a></div> {teams}</div>
    	const cellsOptions = <div><div className="btn-group option-button"><a className="btn btn-outline-primary btn-sm dropdown-toggle" href="#" role="button" id="showCells" aria-expanded="false" onClick={this.onClick}>{this.names.cells}</a></div> {cells}</div>
    	const exportButton = <div><div className="btn-group option-button"><a className="btn btn-outline-primary btn-sm btn-xs" href="#" role="button" id="exportButton" aria-expanded="false" onClick={this.onClick}>Export JSON</a></div></div>
    	
    	return (<div>
    				<div>{partsOptions}</div>
    				<div>{teamsOptions}</div>
    				<div>{cellsOptions}</div>
    				<div>{exportButton}</div>
    			</div>);

   }
}
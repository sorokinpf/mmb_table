import React from 'react';
import ReactDOM from 'react-dom';
import CellsOptions from '../CellsOptions'
import PartsOptions from '../PartsOptions'
import TeamsOptions from '../TeamsOptions'
import './style.css'

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

	onClick= (e) => {
		this.setState({[e.target.id]: !this.state[e.target.id]})
	}

    render() {

    	const parts = this.state.showParts ? 
    	<div>
    		<PartsOptions points={this.props.points} 
    				      selected_points={this.props.selected_points} 
    				      default_points={this.props.default_points}
    				      onPartsChange={this.props.onPartsChange}/>
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
    	
    	return (<div>
    				<div>{partsOptions}</div>
    				<div>{teamsOptions}</div>
    				<div>{cellsOptions}</div>
    			</div>);

   }
}
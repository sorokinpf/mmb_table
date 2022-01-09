import React from 'react';
import ReactDOM from 'react-dom';
import CellsOptions from '../CellsOptions'
import PartsOptions from '../PartsOptions'
import TeamsOptions from '../TeamsOptions'
export default class TeamsDropdown extends React.Component {

	constructor() {
		super();
		this.state = {
			input_team: ''
		}
	}

	names = {parts: 'Настройки участков',
			 teams: 'Настройки команд',
			 cells: 'Настройки ячеек'}

	componentDidMount() {
		//prepareData(this.onLoad);
	}

	onTextChange = (e) => {
		this.setState({input_team: e.target.value});
	}

	onSelectInput= (e) => {
		const selected_team = this.props.teams.filter(team => team.team_id == e.target.id)[0];
		this.props.onSelected(selected_team);
	}

    render() {

    	let options = this.props.teams;

		if (this.state.input_team)
		{
			const search = this.state.input_team.toLowerCase();
			options = options.filter( team => team.team_name.toLowerCase().includes(search) || 
				team.users.some( user => user.user_name.toLowerCase().includes(search)));    			
		}

		options = options.map( team => {
			return (<li><a  className="dropdown-item" 
							href="#" 
							id={team.team_id} 
							key={'team_option_'+team.team_id+this.props.id}
							onClick={this.onSelectInput}>
							{team.team_name}
						</a>
					</li>)
		})

    	
    	return (<div className="dropdown">
						  <button className="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
						    {this.props.text}
						  </button>
						  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
						    <div className="container">
						    	<div className="input-group">
								    <input  type="text" 
								    		id="input_team" 
								    		value={this.state.input_team} 
								    		className="form-control" 
								    		placeholder="Поиск команды" 
								    		onChange={this.onTextChange}/>
								    <span className="input-group-text"><i className="fa fa-search"></i></span>
								    <div className="input-group-append">
									  <button className="btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa fa-question-circle"></i></button>
									</div>
								    
								    

								</div>
						    </div>
						    {options}
						  </ul>
				</div>);

   }
}
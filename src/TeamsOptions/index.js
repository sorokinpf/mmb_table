import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

export default class TeamsOptions extends React.Component {

	constructor(props) {
		super();
		this.state = {
			selected_teams: props.selected_teams,
			main_team: props.main_team,
			change_main_team: false,
			input_main_team: '',
			selected_main_team: ''
		}
	}

	componentDidMount() {
		//prepareData(this.onLoad);
	}

	componentDidUpdate() {

	}

	onMainTeamClick = () => {
		this.setState({change_main_team: !this.state.change_main_team});
	}

	onSelectMainTeam = (e) => {
		const new_main_team = this.props.teams.filter( 
						team => team.team_id==this.state.selected_main_team)[0];
		this.setState({selected_main_team: '',
					   change_main_team: false,
					   input_main_team: '',
					   main_team: new_main_team
						});
		this.props.onMainTeamChange(new_main_team);
	}

	onMainTeamChange = (e) => {
		this.setState({selected_main_team: e.target.value});
	}

	onTextChange = (e) => {
		this.setState({[e.target.id]: e.target.value});
	}

	onRemoveSelectedTeam = (e) => {
		let new_selected_teams = this.props.selected_teams
					.filter( team => team.team_id !== e.target.id);

		this.props.onSelectedTeamsChange(new_selected_teams);
	}

    render() {
    	let change_main_team = null
    	if (this.state.change_main_team){

    		let options = this.props.teams;

    		if (this.state.input_main_team)
    		{
    			const search = this.state.input_main_team.toLowerCase();
    			options = options.filter( team => team.team_name.toLowerCase().includes(search) || 
    				team.users.some( user => user.user_name.toLowerCase().includes(search)));    			
    		}

    		options = options.map( team => {
    			return (<option key={'main_team_option_'+team.team_id} value={team.team_id}>{team.team_name}</option>)
    		})

    		


    		change_main_team = 
    				(<div className="offset-1 col-md-10">
    					
    					<div className="input-group">
						    <input  type="text" 
						    		id="input_main_team" 
						    		value={this.state.input_main_team} 
						    		className="form-control" 
						    		placeholder="Поиск команды" 
						    		onChange={this.onTextChange}/>
						    <span className="input-group-text"><i className="fa fa-search"></i></span>
						    <div className="input-group-append">
							  <button className="btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa fa-question-circle"></i></button>
							</div>
						    
						    

						</div>
					  
    					<select className="form-select" 
    							size="5" 
    							aria-label="size 3 select example"
    							onChange={this.onMainTeamChange}>
						  {options}
						</select>
						<button className="btn btn-primary" 
								style={{marginTop:'4px'}}
								onClick={this.onSelectMainTeam}>
								Выбрать
						</button>
    				</div>);
    	}

    	const modal_div = (<div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
								  <div className="modal-dialog">
								    <div className="modal-content">
								      <div className="modal-header">
								        <h5 className="modal-title" id="exampleModalLabel">Поиск команды</h5>
								        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								      </div>
								      <div className="modal-body">
								        Вы можете искать как по названию команды, так и по имени участника команды.								      </div>
								      
								    </div>
								  </div>
								</div>);

    	let selected_teams_list = this.props.selected_teams.map( (team) => {
    		return (<li className="list-group-item" 
    					key={'selected_team_options_'+team.team_id}>
    					{team.team_name}
    					<i id={team.team_id} 
    						className="fa fa-remove text-danger"
    						onClick={this.onRemoveSelectedTeam}></i>
    				</li>
    			)
    	})

    	return (<div className="offset-3 col-md-6">
	    			<div className="container border rounded-3">
	    				Основная команда: 
						<button className="btn btn-outline-primary text-nowrap btn-sm" 
								style={{'marginLeft': "5px", marginTop: '4px', marginBottom: '4px'}}
								onClick={this.onMainTeamClick}>
						  {this.state.main_team.team_name}
						</button>
						{modal_div}
	    				{change_main_team}
	    				<hr/>
	    				<div>
		    				Выбранные команды:
		    				<ul className="list-group">
							  {selected_teams_list}
							</ul>
						</div>

					    <div className="dropdown">
						  <button className="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
						    Выбрать еще одну команду для анализа
						  </button>
						  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
						    <div className="container">
						    	<div className="input-group">
								    <input  type="text" 
								    		id="input_main_team" 
								    		value={this.state.input_main_team} 
								    		className="form-control" 
								    		placeholder="Поиск команды" 
								    		onChange={this.onTextChange}/>
								    <span className="input-group-text"><i className="fa fa-search"></i></span>
								    <div className="input-group-append">
									  <button className="btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa fa-question-circle"></i></button>
									</div>
								    
								    

								</div>
						    </div>
						    <li><a className="dropdown-item" href="#">Action</a></li>
						    <li><a className="dropdown-item" href="#">Another action</a></li>
						    <li><a className="dropdown-item" href="#">Something else here</a></li>
						    <li><a className="dropdown-item" href="#">Action</a></li>
						    <li><a className="dropdown-item" href="#">Another action</a></li>
						    <li><a className="dropdown-item" href="#">Something else here</a></li>
						    <li><a className="dropdown-item" href="#">Action</a></li>
						    <li><a className="dropdown-item" href="#">Another action</a></li>
						    <li><a className="dropdown-item" href="#">Something else here</a></li>
						  </ul>
						</div>
	    			</div>
	    		</div>);

   }
}
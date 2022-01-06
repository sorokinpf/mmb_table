import React from 'react';
import ReactDOM from 'react-dom';
import {zip,cell_table} from '../utils';
import './style.css';

export default class Table extends React.Component {

	constructor() {
		super();
		this.state = {

		}
	}

	componentDidMount() {
		//
	}

	secondsToTime(seconds,diff=false) {
		let result = diff ? '+' : '';
		if(seconds<0){
			result = '-';
			seconds = -seconds;
		}
		if(seconds==0){
			result = diff ? '-' : '';
		}
		let hours = Math.floor(seconds/3600);
		seconds = seconds - hours*3600;
		let minutes = Math.floor(seconds/60);
		seconds = seconds - minutes*60;
		const formatter =  new Intl.NumberFormat('ru-RU',{minimumIntegerDigits:2});
		let vals = [hours,minutes,seconds].map( (item) => formatter.format(item) );
		//debugger
		result += `${vals[0]}:${vals[1]}:${vals[2]}`;
		return result;
	}

	getTeamPoints(team,selected_points) {
		
		let res =  selected_points.map( x=> 
			team.team_points.filter( (item ) => 
			item.levelpoint_id == x.levelpoint_id)[0]
		);
		//debugger;
		return res.filter(x => !!x)
		/*let team_points = team.team_points.filter( (item) => 
						selected_points.map(x=>x.levelpoint_id).
							includes(item.levelpoint_id) );
		return team_points;*/
	}

	getTeamResults(team,selected_points) {
		let team_points = this.getTeamPoints(team,selected_points);
		return zip(team_points.slice(0,-1),team_points.slice(1,)).map( (item) => 
			item[1].teamlevelpoint_result_seconds - item[0].teamlevelpoint_result_seconds
		);


	}

    render() {
    	let main_team = this.props.main_team;
    	let selected_teams = this.props.selected_teams;
		let other_teams = this.props.teams.filter( (item) => 
			 !(selected_teams.map(x=>x.team_id).includes(item.team_id) 
					 || main_team.team_id==item.team_id)
		)

		let starts = this.props.selected_points.slice(0,-1);
		let finishes = this.props.selected_points.slice(1,);

		//Делаем заголовочки
		
		let column_names = zip(starts,finishes).map( (item) => {
			return (<td key={'head_col'+item[0].levelpoint_name}>
						{item[0].levelpoint_name + ' - '}<br/>{item[1].levelpoint_name}
					</td>);
		});

		let header = (<tr>
						<td key={'head_col_team_name'}>Команда</td>
						{column_names}
						<td key={'head_col_summary'}>Итого</td>
					 </tr>);

		let teams = [main_team,...selected_teams,...other_teams];

		let main_team_results = this.getTeamResults(main_team,this.props.selected_points);
		let main_team_points = this.getTeamPoints(main_team,this.props.selected_points);

		let rows = teams.map( (team) => {

			let team_results = this.getTeamResults(team,this.props.selected_points);
			let team_points = this.getTeamPoints(team,this.props.selected_points);

			//Считаем отставание и коэфициент на участке
			let values = zip(team_results,main_team_results).map( (item) => {
				return {lag: item[1]-item[0], coef: item[0]==0 ? '-' : item[1]/item[0]}				
			});

			//Считаем суммарное отставание после участка
			let values2 = zip(team_points.slice(1),main_team_points.slice(1)).map( (item) => {
				return {summ_lag: item[1].teamlevelpoint_result_seconds - item[0].teamlevelpoint_result_seconds}
			});

			//Добавим время прохождения участка
			let values3 = zip(team_points.slice(0,-1), team_points.slice(1)).map( (item) => {
				return {part_result: item[1].teamlevelpoint_result_seconds - item[0].teamlevelpoint_result_seconds,
						total_result: item[1].teamlevelpoint_result_seconds}
			});

			//debugger;

			values = zip(values,values2,values3).map( (item) => Object.assign(item[0],item[1],item[2]));

			return {values,team,coef: main_team.team_result_seconds/team.team_result_seconds, 
					total_lag: main_team.team_result_seconds-team.team_result_seconds};


		} );

		//Добавим места по участкам
		for (let i=0;i<this.props.selected_points.length-1;i++)
		{
			let part_results = rows.map( x => {return {part_result: x.values[i] ? x.values[i].part_result : 999999999, id: x.team.team_id}});
			part_results.sort( (a,b) => a.part_result - b.part_result );
			//debugger;
			part_results.map( (item,place) => {
				
				let target_row = rows.filter( x => x.team.team_id == item.id)[0];
				if (target_row.values[i])
					target_row.values[i]['place']=place+1;
			});

			let total_results = rows.map( x => {return {total_result: x.values[i] ? x.values[i].total_result : 999999999, id: x.team.team_id}});
			total_results.sort( (a,b) => a.total_result - b.total_result );
			//debugger;
			total_results.map( (item,place) => {
				
				let target_row = rows.filter( x => x.team.team_id == item.id)[0];
				if (target_row.values[i])
					target_row.values[i]['total_place']=place+1;
			});
		}
		
		if(!!this.props.order_by)
		{
			let order_col = this.props.selected_points.map( (x,i) => 
				x.levelpoint_id == this.props.order_by.levelpoint_id ? i : null)
				.filter( x => x )[0];
			if (order_col)
				order_col = order_col-1;
			rows.sort ( (a,b) => {
				if (!a.values[order_col])
					if(!b.values[order_col])
						return 0;
					else					
						return 33;					
				else
					if(!b.values[order_col])
						return -33;
				return a.values[order_col].place - b.values[order_col].place});
			//debugger;
		}

		//debugger;


		let trs = rows.map( (row) => {
			let values = row.values.map( (item,i) => {
				let cell_values = {part_result: this.secondsToTime(item.part_result),
							   lag: this.secondsToTime(item.lag,true),
							   coef: item.coef=='-'? item.coef : item.coef.toFixed(3),
							   summ_lag: this.secondsToTime(item.summ_lag,true), 
							   place: item.place,
							   total_result: this.secondsToTime(item.total_result),
							   total_place: item.total_place
							};

				let cells = this.props.cells.map( (item) => {
					return (<div key={'table_item_cell_'+row.team.team_id+item+i}
								 data-tooltip={cell_table[item]}>
								 {cell_values[item]}
						   </div>);
				});				
				
				return (<td key={'table_item_'+row.team.team_id+i}>
							{cells}				
						</td>
					);
				}
			);
			let place = row.team.place;
			if (row.team.team_minlevelpointorderwitherror)
				place = '-';
			if (!row.team.team_result)
				place = '-';

			let users = row.team.users.map( (item) => {
				return (<div><small key={'table_row_users_'+row.team.team_id + item.user_id}>
							{item.user_name}
						</small><br/></div>)
			})


			return (<tr key={'table_row_'+row.team.team_id}>
						<td key={'table_item_name_'+row.team.team_id}>
							{row.team.team_name}<br/>
							{users}
						</td>
						{values}
						<td key={'table_item_summary_'+row.team.team_id}>
						Место: { place }<br/>
						Результат: {row.team.team_result}<br/>
						Отставание: {this.secondsToTime(row.total_lag)}<br/>
						Коэффициент: {row.coef.toFixed(3)}
						</td>

					</tr>

				)
		})










		
    	return (<div>
    				<table>
    					<thead>
    						{header}
    					</thead>
    					<tbody>
    						{trs}
    					</tbody>
    				</table>
    			</div>);

   }
}
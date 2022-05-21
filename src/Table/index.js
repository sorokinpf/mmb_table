import React from 'react';
import ReactDOM from 'react-dom';
import {zip,cell_table} from '../utils';
import { saveTableData } from '../service/DataService';
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
		if(seconds==='-')
			return '-';
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
		result += `${vals[0]}:${vals[1]}:${vals[2]}`;
		return result;
	}

	onOrderByClick = (e) => {
		
		if (this.props.order_by && e.target.id == this.props.order_by.levelpoint_id)
			this.props.onOrderByChange(null);
		else{			
			const new_order_by = this.props.points.filter( 
									point => point.levelpoint_id == e.target.id)[0];
			this.props.onOrderByChange(new_order_by);
		}
	}

	getTeamPoints(team,selected_points) {
		
		let res =  selected_points.map( x=> 
			team.team_points.filter( (item ) => 
			item.levelpoint_id == x.levelpoint_id)[0]
		);
		return res; // res.filter(x => !!x)
		/*let team_points = team.team_points.filter( (item) => 
						selected_points.map(x=>x.levelpoint_id).
							includes(item.levelpoint_id) );
		return team_points;*/
	}

	getTeamResults(team,selected_points) {
		let team_points = this.getTeamPoints(team,selected_points);
		return zip(team_points.slice(0,-1),team_points.slice(1,)).map( (item) => {
			if(!item[0] || !item[1]){
				return null;
			}
			return item[1].teamlevelpoint_result_seconds - item[0].teamlevelpoint_result_seconds;
		}
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
			let btn_class = 'btn btn-outline-primary btn-sm';
			if (this.props.order_by && 
				this.props.order_by.levelpoint_id == item[1].levelpoint_id)
				btn_class = 'btn btn-primary btn-sm';
			return (<td className="value-col" key={'head_col'+item[0].levelpoint_name}>
						
				          <div className="d-flex flex-column flex-grow-1">
				          	<span>{item[0].levelpoint_name + ' - '}<br/>{item[1].levelpoint_name}</span>
				          </div>
				          <div className="">
				            <button className={btn_class} id={item[1].levelpoint_id}
				            		onClick={this.onOrderByClick}>
				            	<i id={item[1].levelpoint_id} className="fa fa-sort-amount-asc"></i>
				            </button>
				          </div>
				        
					</td>);
		});

		let header = (<tr>
						<td className="team-col" key={'head_col_team_name'}>Команда</td>
						{column_names}
						<td className="result-col" key={'head_col_summary'}>Итого</td>
					 </tr>);

		let teams = [main_team,...selected_teams,...other_teams];

		let main_team_results = this.getTeamResults(main_team,this.props.selected_points);
		let main_team_points = this.getTeamPoints(main_team,this.props.selected_points);

		let rows = teams.map( (team) => {

			let team_results = this.getTeamResults(team,this.props.selected_points);
			let team_points = this.getTeamPoints(team,this.props.selected_points);

			//Считаем отставание и коэфициент на участке
			let values = zip(team_results,main_team_results).map( (item) => {
				return {lag: (item[1]!=null && item[0]!=null) ? item[1]-item[0] : '-', coef: (item[1] && item[0] && item[0]!=0) ? item[1]/item[0] : '-'}				
			});

			//Считаем суммарное отставание после участка
			let values2 = zip(team_points.slice(1),main_team_points.slice(1)).map( (item) => {
				return {summ_lag: (item[1]!==null && item[0]!=null) ? item[1].teamlevelpoint_result_seconds - item[0].teamlevelpoint_result_seconds : '-'}
			});

			//Добавим время прохождения участка
			let values3 = zip(team_points.slice(0,-1), team_points.slice(1)).map( (item) => {
				return {part_result: (item[1]!=null && item[0]!=null) ? item[1].teamlevelpoint_result_seconds - item[0].teamlevelpoint_result_seconds : '-',
						total_result: item[1]!=null ? item[1].teamlevelpoint_result_seconds : '-'}
			});

			//Найдем участки выбора и если они есть, добавим путь на участке
			let choose_st_f = this.props.choose_parts.map( part => [part[0],part[part.length-1]]);
			let values4 = zip(this.props.selected_points.slice(0,-1),this.props.selected_points.slice(1)).map( ([point1,point2]) => {
					//debugger;
					const choosen_part = choose_st_f.filter( ([c1,c2]) => (point1.levelpoint_name == c1) && (point2.levelpoint_name == c2));
					if (!choosen_part.length) {
						return {path: null};
					}
					return {path: team.choose_parts.filter( part=> part.key == choosen_part[0].join('-'))[0].path};
			});


			values = zip(values,values2,values3,values4).map( (item) => Object.assign(item[0],item[1],item[2],item[3]));

			return {values,team,coef: team.team_result_seconds!=0 ? main_team.team_result_seconds/team.team_result_seconds : '-', 
					total_lag: main_team.team_result_seconds-team.team_result_seconds};


		} );

		//Добавим места по участкам
		const bad_value = 999999999;
		for (let i=0;i<this.props.selected_points.length-1;i++)
		{
			let part_results = rows.map( x => {return {part_result: x.values[i] ? x.values[i].part_result : bad_value, id: x.team.team_id}});
			part_results.sort( (a,b) => a.part_result - b.part_result );
			part_results.map( (item,place) => {
				
				let target_row = rows.filter( x => x.team.team_id == item.id)[0];
				if (target_row.values[i] && target_row.values[i].part_result != '-')
					target_row.values[i]['place']=place+1;
				else
					target_row.values[i]['place']='-'
			});

			let total_results = rows.map( x => {return {total_result: x.values[i] ? x.values[i].total_result : bad_value, id: x.team.team_id}});
			total_results.sort( (a,b) => a.total_result - b.total_result );
			total_results.map( (item,place) => {

				let target_row = rows.filter( x => x.team.team_id == item.id)[0];
				if (target_row.values[i] && target_row.values[i].total_result != '-')
					target_row.values[i]['total_place']=place+1;
				else
					target_row.values[i]['total_place']='-'
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
		}



		let trs = rows.map( (row) => {
			let tr_class = '';
			if (row.team.team_id == this.props.main_team.team_id)
				tr_class = 'main-row';
			if (this.props.selected_teams.some( team => team.team_id == row.team.team_id))
				tr_class = 'selected-row';
			let values = row.values.map( (item,i) => {
				//debugger;
				let cell_values = {part_result: this.secondsToTime(item.part_result),
							   lag: this.secondsToTime(item.lag,true),
							   coef: item.coef=='-'? item.coef : item.coef.toFixed(3),
							   summ_lag: this.secondsToTime(item.summ_lag,true), 
							   place: item.place,
							   total_result: this.secondsToTime(item.total_result),
							   total_place: item.total_place,
							   path: <div className='path-div'>{item.path}</div>
							};

				let cells = this.props.cells.map( (item) => {
					return (<div key={'table_item_cell_'+row.team.team_id+item+i}
								 data-tooltip={cell_table[item]}>
								 {cell_values[item]}
						   </div>);
				});				
				
				return (<td className="value-col" key={'table_item_'+row.team.team_id+i}>
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

			let res = row.team.team_result;
			let lag = this.secondsToTime(row.total_lag);
			let coef = row.coef.toFixed(3);
			if(!res){
				res = lag = coef = '-';
			}


			return (<tr key={'table_row_'+row.team.team_id} className={tr_class}>
						<td className="team-col" key={'table_item_name_'+row.team.team_id}>
							{row.team.team_name}<br/>
							{users}
						</td>
						{values}
						<td className="result-col" key={'table_item_summary_'+row.team.team_id}>
						Место: { place }<br/>
						Рез-т: { res }<br/>
						Отс-е: { lag }<br/>
						Коэфф: { coef }
						</td>

					</tr>

				)
		})

		let trs_for_download = rows.map( (row) => {
			let users = row.team.users.map( (item) => {
				return (item.user_name)
			})
			let place = row.team.place;
			if (row.team.team_minlevelpointorderwitherror)
				place = '-';
			if (!row.team.team_result)
				place = '-';

			let res = row.team.team_result;
			let lag = this.secondsToTime(row.total_lag);
			let coef = row.coef.toFixed(3);
			if(!res){
				res = lag = coef = '-';
			}
			return {team_name:row.team.team_name,
				team_runners:users,
				place,
				res,
				lag,
				coef,
				values:row.values
				
			};
		});

		let column_names_for_save = zip(starts,finishes).map( (item) => {
			return item[0].levelpoint_name + ' - '+ item[1].levelpoint_name;			
		});

		let to_save = {
			headers: column_names_for_save,
			table_data: trs_for_download
		};

		saveTableData(to_save);

		//debugger;











		
    	return (<div>
    				<table className="table">
    					<thead className="thead-dark">
    						{header}
    					</thead>
    					<tbody>
    						{trs}
    					</tbody>
    				</table>
    			</div>);

   }
}
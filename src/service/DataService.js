
const loadFile = (filename, param_name) => {
	return fetch('/' + filename)
		.then( (res) => { res.json().then( (body) => {

				save(body,param_name);
			})
		})
}

var all_data = { maindata : null, TeamLevelPoints: null, wpt: '', 
				teams: null,points: null, points_details: null};

var globalOnPrepare = null;

const parseData = () => 
{
	var maindata = all_data.maindata;
	var points_details = all_data.TeamLevelPoints.TeamLevelPoints;

	let timeToSeconds = (time) => {
		if (!time) return 9999999999999;
		let parts = time.split(':').map( item => parseInt(item) );
		return parts[0]*3600 + parts[1]*60 + parts[2];

	}

	//Пересчитаем время взятия в секунды, а также общее время тоже переведем в секунды
	points_details.map( (point) => {
		point.teamlevelpoint_durationdecimal = parseFloat(point.teamlevelpoint_durationdecimal)*60.;
		point.teamlevelpoint_result_seconds = timeToSeconds(point.teamlevelpoint_result);
		});

	//Посчитаем время в секундах
	var teams = maindata.Teams;
	teams.map( (item) => {
		item.team_result_seconds = timeToSeconds(item.team_result);
	})

	let good_teams = teams.filter( (item) => !!item.team_result && !item.team_minlevelpointorderwitherror);
	let bad_teams = teams.filter( (item) => !item.team_result || item.team_minlevelpointorderwitherror);

	//Отсортируем команды
	good_teams.sort( (a,b) => a.team_result_seconds - b.team_result_seconds)

	//Добавим занятое место
	good_teams.map( (item,i) => item.place = i+1 );

	teams = good_teams.concat(bad_teams);

	//Добавим в каждую команду её КПшки
	teams.forEach( (item,i,arr) => { 
		var team_points = points_details.filter( point => point.team_id === item.team_id );
		item['team_points'] = team_points;
	})

	//Добавим чуваков
	teams.map( (item) => {
		let user_ids = maindata.TeamUsers.filter( x=>x.team_id == item.team_id).map(x=>x.user_id);
		let users = maindata.Users.filter( x => user_ids.includes(x.user_id));
		item['users']=users;
	})


	let points = maindata['Levels'];

	points.map( (item) => item.levelpoint_order = parseInt(item.levelpoint_order));
	points.sort( (a,b) => a.levelpoint_order - b.levelpoint_order);

	all_data['teams'] = teams;
	all_data['points_details'] = points_details;
	all_data['points'] = points;
};

const save = (data,param_name) => {
	all_data[param_name] = data;
	console.log(param_name + ' is loaded');
	if ( (all_data['maindata']) && (all_data['TeamLevelPoints']))
	{
		parseData();
		console.log('prepared!');
		globalOnPrepare();
	}
}

const prepareData = (onPrepare) => {
	globalOnPrepare = onPrepare;
	loadFile('maindata.json', 'maindata' );
	loadFile('TeamLevelPoints.json', 'TeamLevelPoints');
}

const getAllData = () => { return all_data };
const getMainData = () => { return all_data.maindata };
const getTeamLevelPoints = () => {return all_data.TeamLevelPoints };


export { prepareData, getMainData, getTeamLevelPoints, getAllData } ;
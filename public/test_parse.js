var maindata = require('./maindata.json');
var points_details = require('./TeamLevelPoints.json').TeamLevelPoints;

let timeToSeconds = (time) => {
	if (!time) return 9999999999999;
	parts = time.split(':').map( item => parseInt(item) );
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

//Отсортируем команды
teams.sort( (a,b) => a.team_result_seconds - b.team_result_seconds)

//Добавим в каждую команду её КПшки
teams.forEach( (item,i,arr) => { 
	var team_points = points_details.filter( point => point.team_id === item.team_id );
	item['team_points'] = team_points;
})

let points = maindata['Levels'];

points.map( (item) => item.levelpoint_order = parseInt(item.levelpoint_order));
points.sort( (a,b) => a.levelpoint_order - b.levelpoint_order);

console.log(points);
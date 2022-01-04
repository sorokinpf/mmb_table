
const loadFile = (filename, param_name) => {
	return fetch('/' + filename)
		.then( (res) => { res.json().then( (body) => {

				save(body,param_name);
			})
		})
}

var all_data = { maindata : null, TeamLevelPoints: null, wpt: '' };

var globalOnPrepare = null;

const save = (data,param_name) => {
	all_data[param_name] = data;
	console.log(param_name + ' is loaded');
	if ( (all_data['maindata']) && (all_data['TeamLevelPoints']))
	{
		console.log('prepared!');
		globalOnPrepare();
	}
}

const prepareData = (onPrepare) => {
	globalOnPrepare = onPrepare;
	loadFile('maindata.json', 'maindata' );
	loadFile('TeamLevelPoints.json', 'TeamLevelPoints');
}

const getMainData = () => { return all_data.maindata };
const getTeamLevelPoints = () => {return all_data.TeamLevelPoints };


export { prepareData, getMainData, getTeamLevelPoints } ;
import React from 'react';
import ReactDOM from 'react-dom';
import { prepareData, getMainData, getTeamLevelPoints, getAllData} from './service/DataService';
import MmbDiff from './MmbDiff'

export default class WithData extends React.Component {

	constructor() {
		super();
		this.state = {
			loaded: false
		}
	}

	onLoad = () => { 
		console.log('onLoad called');
		this.setState({loaded:true});
	}

	componentDidMount() {
		prepareData(this.onLoad);
	}

    render() {


    	let data = getAllData();
    	console.log('from withData');
    	if (!this.state.loaded)
    		return (<h1>Loading</h1>);
    	else
    		return (<MmbDiff teams={ data.teams } 
    						 points={ data.points }
    						 title={data.maindata.Raids[0].raid_name}/>);

   }
}
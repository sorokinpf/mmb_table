import React from 'react';
import ReactDOM from 'react-dom';
import { prepareData, getMainData, getTeamLevelPoints } from './service/LoadService';
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
    	console.log('from withData');
    	if (!this.state.loaded)
    		return (<h1>Loading</h1>);
    	else
    		return (<MmbDiff mainData={ getMainData() } 
    						 teamLevelPoints={ getTeamLevelPoints() }/>);

   }
}
import React from 'react';
import ReactDOM from 'react-dom';

export default class MmbDiff extends React.Component {

	constructor() {
		super();
		this.state = {
			
		}
	}

	componentDidMount() {
		//prepareData(this.onLoad);
	}

    render() {
    	console.log('points');
    	console.log(Object.keys(this.props.teamLevelPoints));
    	return (<h1>MmbDiff</h1>);

   }
}
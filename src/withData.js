import React from 'react';
import ReactDOM from 'react-dom';
import { analyzeChooseParts, prepareData, getAllData} from './service/DataService';
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
    	let default_points_names = ['Старт 1 этапа','4','13','22','24','Финиш 1 этапа','Старт 2 этапа','38','Финиш 2 этапа'];
    	let choose_parts = [['4','5','6','7','8','9','10','11','12','13'],
    						['13','14','15','16','17','18','19','20','21','22'],
    						['24','25','26','27','28','29','30','31','32','Финиш 1 этапа'],
    						['38','39','40','41','42','43','44','45','46','47','48','Финиш 2 этапа']];


    	
    	if (!this.state.loaded)
    		return (<h1>Loading</h1>);
    	else {
    		analyzeChooseParts(choose_parts);
    		let data = getAllData();
    	
    		return (<MmbDiff teams={ data.teams } 
    						 points={ data.points }
    						 title={data.maindata.Raids[0].raid_name}
    						 default_points_names={default_points_names}
    						 choose_parts={choose_parts}
    						 />);
    	}

   }
}
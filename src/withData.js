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
    	let default_points_names = ['Старт 1 этапа','2','14','16','26','Смена карт','32','42','Финиш 1 этапа','49','60','Финиш 2 этапа'];
    	let choose_parts = [['2','3','4','5','6','7','8','9','10','11','12','13','14'],
    						['16','17','18','19','20','21','22','23','24','25','26'],
    						['32','33','34','35','36','37','38','39','40','41','42'],
    						['49','50','51','52','53','54','55','56','57','58','59','60']];


    	
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
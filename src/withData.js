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
    	let default_points_names = ['Старт 1 этапа','13','Смена карт','32','34','43','Финиш 1 этапа','46','67','Финиш 2 этапа'];
    	let choose_parts = [['Старт 1 этапа','1,','2','3','4','5','6','7','8','9','10','11','12','13'],
    						['Смена карт','24','25','26','27','28','29','30','31','32'],
    						['34','35','36','37','38','39','40','41','42','43'],
    						['46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67']];


    	
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
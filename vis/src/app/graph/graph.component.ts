
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import ForceGraph3D from '3d-force-graph';

type GraphData = {
	nodes: { id: string, group: number}[]
	links : {source: string, target: number}[]
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

	data!:GraphData;

	graph!: any
		
	// Constructor.
	constructor(private dataService: DataService) {
	}

	//On Initialization of the component.
	ngOnInit(): void {

		this.dataService.currentGraphData.subscribe((response) => {
			response.subscribe((data)=>{
				this.data = data
				this.graph = ForceGraph3D()
				(document.getElementById('graph')!)
					.graphData(this.data);
				
			})
		})

		// const N = 300;
		// const gData = {
		// 	nodes: [...Array(N).keys()].map(i => ({ id: i })),
		// 	links: [...Array(N).keys()]
		// 	.filter(id => id)
		// 	.map(id => ({
		// 		source: id,
		// 		target: Math.round(Math.random() * (id-1))
		// 	}))
		// };

		const gData = {'nodes': [{'id': '1', 'name': '.', 'val': 0}, {'id': '2', 'name': 'plot.py', 'val': 1}, {'id': '3', 'name': 'main.py', 'val': 1}, {'id': '4', 'name': 'rand_qs.py', 'val': 1}, {'id': '5', 'name': 'README.md', 'val': 1}, {'id': '6', 'name': 'ms.py', 'val': 1}, {'id': '7', 'name': 'min-cut-apprx', 'val': 0}, {'id': '10', 'name': '600.csv', 'val': 1}, {'id': '11', 'name': 'cut_vs_iter_600.png', 'val': 1}, {'id': '12', 'name': '450.csv', 'val': 1}, {'id': '13', 'name': 'cut_vs_iter_550.png', 'val': 1}, {'id': '14', 'name': 'cut_vs_iter_800.png', 'val': 1}, {'id': '15', 'name': 'plot.py', 'val': 1}, {'id': '16', 'name': '500.csv', 'val': 1}, {'id': '17', 'name': 'cut_vs_iter_1000.png', 'val': 1}, {'id': '18', 'name': '950.csv', 'val': 1}, {'id': '19', 'name': 'cut_vs_iter_350.png', 'val': 1}, {'id': '20', 'name': 'cut_vs_iter_750.png', 'val': 1}, {'id': '21', 'name': 'cut_vs_iter_700.png', 'val': 1}, {'id': '22', 'name': 'out', 'val': 1}, {'id': '23', 'name': 'cut_vs_iter_250.png', 'val': 1}, {'id': '24', 'name': 'cut_vs_iter_200.png', 'val': 1}, {'id': '25', 'name': 'cut_vs_iter_900.png', 'val': 1}, {'id': '26', 'name': '650.csv', 'val': 1}, {'id': '27', 'name': 'runtime.png', 'val': 1}, {'id': '28', 'name': '400.csv', 'val': 1}, {'id': '29', 'name': 'cut_vs_iter_300.png', 'val': 1}, {'id': '30', 'name': '550.csv', 'val': 1}, {'id': '31', 'name': 'run.sh', 'val': 1}, {'id': '32', 'name': '1000.csv', 'val': 1}, {'id': '33', 'name': 'cut_vs_iter_950.png', 'val': 1}, {'id': '34', 'name': '350.csv', 'val': 1}, {'id': '35', 'name': '700.csv', 'val': 1}, {'id': '36', 'name': '250.csv', 'val': 1}, {'id': '37', 'name': '850.csv', 'val': 1}, {'id': '38', 'name': 'cut_vs_iter_400.png', 'val': 1}, {'id': '39', 'name': '200.csv', 'val': 1}, {'id': '40', 'name': 'runtime_log.png', 'val': 1}, {'id': '41', 'name': 'cut_vs_iter_450.png', 'val': 1}, {'id': '42', 'name': '300.csv', 'val': 1}, {'id': '43', 'name': '800.csv', 'val': 1}, {'id': '44', 'name': '750.csv', 'val': 1}, {'id': '45', 'name': 'cut_vs_iter_650.png', 'val': 1}, {'id': '46', 'name': 'cut_vs_iter_850.png', 'val': 1}, {'id': '47', 'name': 'kragers.cpp', 'val': 1}, {'id': '48', 'name': '900.csv', 'val': 1}, {'id': '49', 'name': 'cut_vs_iter_500.png', 'val': 1}, {'id': '50', 'name': 'run1', 'val': 0}, {'id': '51', 'name': '600.csv', 'val': 1}, {'id': '52', 'name': 'cut_vs_iter_600.png', 'val': 1}, {'id': '53', 'name': 'cut_vs_iter_1000.png', 'val': 1}, {'id': '54', 'name': 'cut_vs_iter_200.png', 'val': 1}, {'id': '55', 'name': 'runtime.png', 'val': 1}, {'id': '56', 'name': '1000.csv', 'val': 1}, {'id': '57', 'name': '200.csv', 'val': 1}, {'id': '8', 'name': '__pycache__', 'val': 0}, {'id': '51', 'name': 'rand_qs.cpython-310.pyc', 'val': 1}, {'id': '52', 'name': 'ms.cpython-310.pyc', 'val': 1}, {'id': '53', 'name': 'input_gen.cpython-310.pyc', 'val': 1}, {'id': '54', 'name': 'plot.cpython-310.pyc', 'val': 1}, {'id': '9', 'name': '.git', 'val': 0}, {'id': '55', 'name': 'config', 'val': 1}, {'id': '56', 'name': 'index', 'val': 1}, {'id': '57', 'name': 'HEAD', 'val': 1}, {'id': '58', 'name': 'packed-refs', 'val': 1}, {'id': '59', 'name': 'description', 'val': 1}, {'id': '60', 'name': 'refs', 'val': 0}, {'id': '66', 'name': 'tags', 'val': 0}, {'id': '67', 'name': 'remotes', 'val': 0}, {'id': '69', 'name': 'origin', 'val': 0}, {'id': '70', 'name': 'HEAD', 'val': 1}, {'id': '68', 'name': 'heads', 'val': 0}, {'id': '70', 'name': 'master', 'val': 1}, {'id': '61', 'name': 'branches', 'val': 0}, {'id': '62', 'name': 'objects', 'val': 0}, {'id': '69', 'name': 'pack', 'val': 0}, {'id': '71', 'name': 'pack-652db6720399ae8423522277de21bc7b7da47ede.idx', 'val': 1}, {'id': '72', 'name': 'pack-652db6720399ae8423522277de21bc7b7da47ede.pack', 'val': 1}, {'id': '70', 'name': 'info', 'val': 0}, {'id': '63', 'name': 'logs', 'val': 0}, {'id': '71', 'name': 'HEAD', 'val': 1}, {'id': '72', 'name': 'refs', 'val': 0}, {'id': '73', 'name': 'remotes', 'val': 0}, {'id': '75', 'name': 'origin', 'val': 0}, {'id': '76', 'name': 'HEAD', 'val': 1}, {'id': '74', 'name': 'heads', 'val': 0}, {'id': '76', 'name': 'master', 'val': 1}, {'id': '64', 'name': 'info', 'val': 0}, {'id': '73', 'name': 'exclude', 'val': 1}, {'id': '65', 'name': 'hooks', 'val': 0}, {'id': '74', 'name': 'pre-receive.sample', 'val': 1}, {'id': '75', 'name': 'commit-msg.sample', 'val': 1}, {'id': '76', 'name': 'prepare-commit-msg.sample', 'val': 1}, {'id': '77', 'name': 'pre-rebase.sample', 'val': 1}, {'id': '78', 'name': 'update.sample', 'val': 1}, {'id': '79', 'name': 'applypatch-msg.sample', 'val': 1}, {'id': '80', 'name': 'pre-applypatch.sample', 'val': 1}, {'id': '81', 'name': 'fsmonitor-watchman.sample', 'val': 1}, {'id': '82', 'name': 'push-to-checkout.sample', 'val': 1}, {'id': '83', 'name': 'post-update.sample', 'val': 1}, {'id': '84', 'name': 'pre-commit.sample', 'val': 1}, {'id': '85', 'name': 'pre-merge-commit.sample', 'val': 1}, {'id': '86', 'name': 'pre-push.sample', 'val': 1}], 'links': [{'source': '1', 'target': '2'}, {'source': '1', 'target': '3'}, {'source': '1', 'target': '4'}, {'source': '1', 'target': '5'}, {'source': '1', 'target': '6'}, {'source': '1', 'target': '7'}, {'source': '7', 'target': '10'}, {'source': '7', 'target': '11'}, {'source': '7', 'target': '12'}, {'source': '7', 'target': '13'}, {'source': '7', 'target': '14'}, {'source': '7', 'target': '15'}, {'source': '7', 'target': '16'}, {'source': '7', 'target': '17'}, {'source': '7', 'target': '18'}, {'source': '7', 'target': '19'}, {'source': '7', 'target': '20'}, {'source': '7', 'target': '21'}, {'source': '7', 'target': '22'}, {'source': '7', 'target': '23'}, {'source': '7', 'target': '24'}, {'source': '7', 'target': '25'}, {'source': '7', 'target': '26'}, {'source': '7', 'target': '27'}, {'source': '7', 'target': '28'}, {'source': '7', 'target': '29'}, {'source': '7', 'target': '30'}, {'source': '7', 'target': '31'}, {'source': '7', 'target': '32'}, {'source': '7', 'target': '33'}, {'source': '7', 'target': '34'}, {'source': '7', 'target': '35'}, {'source': '7', 'target': '36'}, {'source': '7', 'target': '37'}, {'source': '7', 'target': '38'}, {'source': '7', 'target': '39'}, {'source': '7', 'target': '40'}, {'source': '7', 'target': '41'}, {'source': '7', 'target': '42'}, {'source': '7', 'target': '43'}, {'source': '7', 'target': '44'}, {'source': '7', 'target': '45'}, {'source': '7', 'target': '46'}, {'source': '7', 'target': '47'}, {'source': '7', 'target': '48'}, {'source': '7', 'target': '49'}, {'source': '7', 'target': '50'}, {'source': '50', 'target': '51'}, {'source': '50', 'target': '52'}, {'source': '50', 'target': '53'}, {'source': '50', 'target': '54'}, {'source': '50', 'target': '55'}, {'source': '50', 'target': '56'}, {'source': '50', 'target': '57'}, {'source': '1', 'target': '8'}, {'source': '8', 'target': '51'}, {'source': '8', 'target': '52'}, {'source': '8', 'target': '53'}, {'source': '8', 'target': '54'}, {'source': '1', 'target': '9'}, {'source': '9', 'target': '55'}, {'source': '9', 'target': '56'}, {'source': '9', 'target': '57'}, {'source': '9', 'target': '58'}, {'source': '9', 'target': '59'}, {'source': '9', 'target': '60'}, {'source': '60', 'target': '66'}, {'source': '60', 'target': '67'}, {'source': '67', 'target': '69'}, {'source': '69', 'target': '70'}, {'source': '60', 'target': '68'}, {'source': '68', 'target': '70'}, {'source': '9', 'target': '61'}, {'source': '9', 'target': '62'}, {'source': '62', 'target': '69'}, {'source': '69', 'target': '71'}, {'source': '69', 'target': '72'}, {'source': '62', 'target': '70'}, {'source': '9', 'target': '63'}, {'source': '63', 'target': '71'}, {'source': '63', 'target': '72'}, {'source': '72', 'target': '73'}, {'source': '73', 'target': '75'}, {'source': '75', 'target': '76'}, {'source': '72', 'target': '74'}, {'source': '74', 'target': '76'}, {'source': '9', 'target': '64'}, {'source': '64', 'target': '73'}, {'source': '9', 'target': '65'}, {'source': '65', 'target': '74'}, {'source': '65', 'target': '75'}, {'source': '65', 'target': '76'}, {'source': '65', 'target': '77'}, {'source': '65', 'target': '78'}, {'source': '65', 'target': '79'}, {'source': '65', 'target': '80'}, {'source': '65', 'target': '81'}, {'source': '65', 'target': '82'}, {'source': '65', 'target': '83'}, {'source': '65', 'target': '84'}, {'source': '65', 'target': '85'}, {'source': '65', 'target': '86'}]}

		}
}

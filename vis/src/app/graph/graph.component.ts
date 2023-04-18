
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import ForceGraph3D from '3d-force-graph';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

		
		 // Constructor.
		 constructor(private dataService: DataService) {
		}
	
		//On Initialization of the component.
		ngOnInit(): void {

			const N = 300;
			const gData = {
			  nodes: [...Array(N).keys()].map(i => ({ id: i })),
			  links: [...Array(N).keys()]
				.filter(id => id)
				.map(id => ({
				  source: id,
				  target: Math.round(Math.random() * (id-1))
				}))
			};
		
			const Graph = ForceGraph3D()
			  (document.getElementById('graph')!)
				.graphData(gData);

		}
}

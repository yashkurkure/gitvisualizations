import { Injectable } from '@angular/core';
import { GraphViewConfig } from './types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

	// All graph configs
	graphViewConfigs: GraphViewConfig[] = [
		{value: 'none', viewValue: 'Default'},
		{value: 'td', viewValue: 'DAG: Up-Down'},
		{value: 'bu', viewValue: 'DAG: Down-Up'},
		{value: 'lr', viewValue: 'DAG: Left-Right'},
		{value: 'rl', viewValue: 'DAG: Right- Left'},
		{value: 'zout', viewValue: 'DAG: Zout'},
		{value: 'zin', viewValue: 'DAG: Zin'},
		{value: 'radialout', viewValue: 'Radial Out'},
		{value: 'radialin', viewValue: 'Radial In'},
	];


	// Default graph view config
	defualtGraphViewConfig: GraphViewConfig = { value: 'none', viewValue: 'Default'}

	// Observable setup for graph view config
	// The observbable is responsible for keeping track of the current graph view config
	private graphViewConfigBS = new BehaviorSubject<GraphViewConfig>(this.defualtGraphViewConfig)
	graphViewConfigObservable = this.graphViewConfigBS.asObservable()
	
	constructor() { }

	// Get the current graph view config
	getGraphViewConfig(): GraphViewConfig {
		return this.graphViewConfigBS.getValue();
	}

	// Update the graph view config
	updateGraphViewConfig(gvcnew: GraphViewConfig) {
		this.graphViewConfigBS.next(gvcnew);
	}
}

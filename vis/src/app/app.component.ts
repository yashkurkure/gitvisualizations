import { Component, OnInit } from '@angular/core';
import { GraphViewConfig } from './types';
import { MatSelectChange } from '@angular/material/select';
import { GraphService } from './graph.service';

/**
 * Root Component
 * 
 * - Responsible for toolbar UI.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

	// Constructor
	constructor(
		private graphService: GraphService,
		) { }

	// All graph view configs
	graphViewConfigs: GraphViewConfig[] = this.graphService.graphViewConfigs;

	// Selected graph view configs
	selectedGraphViewConfig: GraphViewConfig = this.graphService.defualtGraphViewConfig;

	ngOnInit(): void {
		this.graphService
		.graphViewConfigObservable
		.subscribe((newgvc: GraphViewConfig)=>{
			this.selectedGraphViewConfig = newgvc;
		});
	}

	// Handler for mat-selection of graph view configs.
	onGraphViewConfigChanged(event: MatSelectChange){
		
		let graphViewConfig: GraphViewConfig = event.value; 
		console.log("New Graph View Config:", graphViewConfig.viewValue);

		// Send update to service
		this.graphService.updateGraphViewConfig(graphViewConfig);
	}
}

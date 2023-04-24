import { Component, OnInit } from '@angular/core';
import { GraphService } from '../graph.service';

@Component({
  selector: 'app-pathinput',
  templateUrl: './pathinput.component.html',
  styleUrls: ['./pathinput.component.css']
})
export class PathinputComponent implements OnInit{
	
	constructor(private graphService: GraphService) {}
	
	ngOnInit(): void {
		
	}

	// Path List
	//selectedPathsQuery: Set<string> = new Set(['A']);
	selectedPathsQuery: string[] = ['A'];
	loadedpaths: Set<string> = new Set(['A', 'B', 'C']);

	// Query List
	selectedFilesDirsQuery: string[] = ["A"]
	loadedFileDirs: string[] = ["A", "B" , "C"]


	// Handler for path list selection change
	onPathSelectionChanged(event: any) {
		console.log(this.selectedPathsQuery);
	}

	onFilesDirSelectionChanged(event: any) {
		
	}

}

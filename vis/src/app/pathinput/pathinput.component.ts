import { Component } from '@angular/core';

@Component({
  selector: 'app-pathinput',
  templateUrl: './pathinput.component.html',
  styleUrls: ['./pathinput.component.css']
})
export class PathinputComponent {

	// Path List
	selectedPaths: string[] = ["A"]
	paths: string[] = ["A", "B" , "C"]

	// Query List
	selectedFilesDirs: string[] = ["A"]
	fileDirs: string[] = ["A", "B" , "C"]

	onFilesDirSelectionChanged(event: any) {

	}

	onPathSelectionChanged(event: any) {

	}

}

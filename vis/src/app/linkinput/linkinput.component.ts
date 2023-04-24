import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
	selector: 'app-linkinput',
	templateUrl: './linkinput.component.html',
	styleUrls: ['./linkinput.component.css']
})
export class LinkinputComponent implements OnInit{

	constructor(private dataService: DataService) { }

	// Form control for the github url input
	githubUrlInputForm = new FormGroup({
		githubUrlInput: new FormControl(),
	  });

	// subscribed to data service
	currentGithubUrl!: string;

	// subscribed to data service
	currentSelectedFiles!: string;

	// Store the history of urls enterted
	githubUrls: string[] = ["A", "B", "C"];

	ngOnInit(): void {
		this.dataService.currentGithubUrl.subscribe(newGithubUrl=>{
			this.currentGithubUrl = newGithubUrl;
		});

		this.dataService.currentselectedFiles.subscribe(newSelectedFiles=>{
			this.currentSelectedFiles = newSelectedFiles;
		});
	}

	/**
	 * Handler for the github input text box.
	 * @param event 
	 */
	onLoadGithubUrl(event: any) {

		// Get the input from the form field
		const input: string = this.githubUrlInputForm.get('githubUrlInput')!.value;

		// Add the new url to history
		this.githubUrls.push(input)

		// Update the value of the current selected url
		this.dataService.updateGithubUrl(input)

		// Reset the input text box
		this.githubUrlInputForm.get('githubUrlInput')!.reset();
	}
}

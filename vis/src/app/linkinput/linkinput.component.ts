import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
	selector: 'app-linkinput',
	templateUrl: './linkinput.component.html',
	styleUrls: ['./linkinput.component.css']
})
export class LinkinputComponent implements OnInit{

	constructor(private dataService: DataService) { }

	firstNameAutofilled!: boolean;
	lastNameAutofilled!: boolean;

	// subscribed to data service
	currentGithubUrl!: string;

	// subscribed to data service
	currentSelectedFiles!: string;

	ngOnInit(): void {
		this.dataService.currentGithubUrl.subscribe(newGithubUrl=>{
			this.currentGithubUrl = newGithubUrl;
		});

		this.dataService.currentselectedFiles.subscribe(newSelectedFiles=>{
			this.currentSelectedFiles = newSelectedFiles;
		});
	}

	onKey(event: any) {
		console.log("New link entered")
		this.dataService.updateGithubUrl(event.target.value);
	}
}

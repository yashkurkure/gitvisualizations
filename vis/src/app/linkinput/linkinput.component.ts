import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
	selector: 'app-linkinput',
	templateUrl: './linkinput.component.html',
	styleUrls: ['./linkinput.component.css']
})
export class LinkinputComponent implements OnInit{

	constructor(private dataService: DataService, private _snackBar: MatSnackBar) { }

	onRepositorySelectionChanged(event: any) {

		let reponame: string = event[0];

		console.log("Option changed: ", reponame);

		this.updateSelectedRepositoryfromName(reponame)
	}

	// Form control for the github url input
	githubUrlInputForm = new FormGroup({
		githubUrlInput: new FormControl(),
	  });

	// subscribed to data service
	currentGithubUrl!: string;

	// Store the history of urls enterted
	githubUrls = new Map<string, string>;

	// Store the history of the repository names
	repositories: string[] = []

	// Current selected repository name
	@ViewChild('repolist') repoMatSelectionList!: MatSelectionList;
	repository: string = ""
	selected_reposotories: string[] = [this.repository]

	you_are_viewing: string = "";

	ngOnInit(): void {
		this.dataService.currentGithubUrl.subscribe(newGithubUrl=>{
			this.you_are_viewing = this.extractGitHubRepoPath(newGithubUrl)!
			console.log("Fetched url: ", newGithubUrl)
			if(!this.containsRepositoryURL(newGithubUrl)) {
				this.addRepository(newGithubUrl);
				this.updateSelectedRepositoryfromUrl(newGithubUrl);
			} else {
				this.updateSelectedRepositoryfromUrl(newGithubUrl);
			}
			
		});
		this.repositories = [this.extractGitHubRepoPath(this.dataService.getCurrentGithubUrl())!]
		this.repository = this.extractGitHubRepoPath(this.dataService.getCurrentGithubUrl())!
		this.selected_reposotories = [this.repository]
		this.githubUrls.set(this.repository, this.dataService.getCurrentGithubUrl())
	}

	onLoadGithubUrlFromList(event: any) {
		console.log("onLoadGithubUrlFromList:",this.repository)
		let newGithubUrl = this.githubUrls.get(this.repository)!
		this.dataService.updateGithubUrl(newGithubUrl)
	}

	/**
	 * Handler for the github input text box.
	 * @param event 
	 */
	onLoadGithubUrl(event: any) {

		// Get the input from the form field
		const input: string = this.githubUrlInputForm.get('githubUrlInput')!.value;

		// Check the validity of the guthub url
		var isGithubUrl = require('is-github-url');
		if(isGithubUrl(input, { strict: true })) {

			if(this.containsRepositoryURL(input)) {
				this.addRepository(input);
				this.dataService.updateGithubUrl(input)
			}

		} else {
			this._snackBar.open("Invalid Github Repository", "CLOSE", {
				duration: 3000
			});
		}

		// Reset the input text box
		this.githubUrlInputForm.get('githubUrlInput')!.reset();
	}

	extractGitHubRepoPath(url: string) {
		if (!url) return null;
		const match = url.match(
		  /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+).git/
		);
		if (!match || !(match.groups?.['owner'] && match.groups?.['name'])) return null;
		return `${match.groups?.['owner']}/${match.groups?.['name']}`;
	}

	addRepository(input: string) {

		const reponame: string = this.extractGitHubRepoPath(input)!;

			// Check url duplicates
			if (!this.repositories.includes(reponame)) {

				// Add the new url to history
				this.repositories.push(reponame)

				// NOTE: So that virtual scrolling detects changes
				this.repositories = [...this.repositories]

				// Add the url to the map repo_name -> repo_url
				this.githubUrls.set(reponame, input);

			}

	}

	containsRepositoryURL(input: string) {
		const reponame: string = this.extractGitHubRepoPath(input)!;
		return !this.repositories.includes(reponame)
	}

	containsRepositoryName(input: string) {
		return !this.repositories.includes(input)
	}

	updateSelectedRepositoryfromUrl(input: string){
		console.log("updating selected option")
		const reponame: string = this.extractGitHubRepoPath(input)!;
		this.repository = reponame;
		this.selected_reposotories = [this.repository]

	}

	updateSelectedRepositoryfromName(input: string){
		this.repository = input;
		this.selected_reposotories = [this.repository]
		this.currentGithubUrl = input
	}


}

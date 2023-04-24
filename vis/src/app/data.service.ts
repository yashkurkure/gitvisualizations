import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { from } from 'rxjs';
import { FileTree, GraphDataRaw} from './types';



// TODO: Readings
// Observable: https://www.tektutorialshub.com/angular/angular-observable-tutorial-using-rxjs/
// HttpClient: https://www.tektutorialshub.com/angular/angular-http-get-example-using-httpclient/

// TODO: a logger service would be nice
// import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {


	graphUrl = 'api/graph';
	fileTreeUrl = 'api/filetree'

	defaultGithubUrl = "https://github.com/yashkurkure/cs501-hw2.git"
	private githubUrl = new BehaviorSubject<string>("https://github.com/yashkurkure/cs501-hw2.git")
	currentGithubUrl = this.githubUrl.asObservable()

	private selectedFiles = new BehaviorSubject<string>("No Files/Dirs selected")
	currentselectedFiles = this.selectedFiles.asObservable()

	private currentGraphData2!: GraphDataRaw;
	private graphData = new BehaviorSubject<Observable<GraphDataRaw>>(this.http.get<GraphDataRaw>(this.graphUrl, {params: new HttpParams().append("githuburl", "https://github.com/yashkurkure/cs501-hw2.git")}));
	currentGraphData = this.graphData.asObservable()

	// private currentFileTree!: FileTree;
	// private fileTreeBS = new BehaviorSubject<Observable<FileTree>>(this.http.get<FileTree>(this.graphUrl, {params: new HttpParams().append("githuburl", "https://github.com/yashkurkure/cs501-hw2.git")}));
	// fileTreeObservable = this.fileTreeBS.asObservable()

	defaultFileTree: FileTree = {name: "", isFile: false, path: "", children: []};
	currentFileTree: FileTree = {name: "", isFile: false, path: "", children: []};
	private fileTreeBS: BehaviorSubject<FileTree> = new BehaviorSubject<FileTree>(this.defaultFileTree);
	public fileTreeObservable: Observable<FileTree> = this.fileTreeBS.asObservable();

	constructor(private http: HttpClient) {

		// this.fileTreeBS.getValue().subscribe((data: FileTree) => {
		// 	this.currentFileTree = data;

		// })

		// this.graphData.getValue().subscribe((data: GraphDataRaw)=>{
		// 	this.currentGraphData2 = data;
		// });

		let params = new HttpParams();
		params = params.append("githuburl", this.defaultGithubUrl)
		let httpObservable = this.http.get<FileTree>(this.fileTreeUrl, {params: params});
		httpObservable.subscribe((data: FileTree)=>{
			if(data) {
				this.fileTreeBS.next(data);
				this.currentFileTree = data;
			}
		})
	}

	


	updateGithubUrl(githubUrl: string): void {
		this.githubUrl.next(githubUrl)

		let params = new HttpParams();
		params = params.append("githuburl", githubUrl)

		this.graphData.next(this.http.get<GraphDataRaw>(this.graphUrl, {params: params}));
		this.updateFileTree(githubUrl)
	}

	updateFileTree(githubUrl: string): void {

		let params = new HttpParams();
		params = params.append("githuburl", githubUrl)

		let httpObservable = this.http.get<FileTree>(this.fileTreeUrl, {params: params});
		httpObservable.subscribe((data: FileTree)=>{
			if(data) {
				this.fileTreeBS.next(data);
				this.currentFileTree = data;
			}
		})
		
	}

	updateSelectedFiles(selectedFiles: string): void {
		this.selectedFiles.next(selectedFiles);
	}

	getCurrentGithubUrl(): string {
		return this.githubUrl.getValue();
	}

	getCurrentFileTree(): FileTree {
		let copy = Object.assign({}, this.currentFileTree)
		return copy;
	}

	getCurrentGraphDataRaw(): GraphDataRaw {
		let copy = Object.assign({}, this.currentGraphData2)
		return copy;
	}
}

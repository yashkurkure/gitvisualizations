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

	defaultGithubUrl = "https://github.com/yashkurkure/cs501-hw2.git";
	currentGithubUrl = this.defaultGithubUrl;
	private githubUrlBS = new BehaviorSubject<string>(this.defaultGithubUrl)
	githubUrlObservable = this.githubUrlBS.asObservable()



	defualtGraphDataRaw: GraphDataRaw = {
		nodes: [
			{id: 1, name: ".", leaf: 0},
			{id: 2, name: "dir1", leaf: 0},
			{id: 3, name: "dir2", leaf: 0},
			{id: 4, name: "dir3", leaf: 0},
			{id: 5, name: "file1", leaf: 1},
			{id: 6, name: "file2", leaf: 1},
			{id: 7, name: "file3", leaf: 1},
			{id: 8, name: "file4", leaf: 1},
		],
		links: [
			{source: 1, target: 2},
			{source: 1, target: 3},
			{source: 1, target: 5},

			{source: 2, target: 6},

			{source: 3, target: 7},
			{source: 3, target: 4},

			{source: 4, target: 8},
		]
	};
	currentGraphDataRaw: GraphDataRaw = this.defualtGraphDataRaw;
	private graphDataRawBS: BehaviorSubject<GraphDataRaw> = new BehaviorSubject<GraphDataRaw>(this.defualtGraphDataRaw);
	public graphDataRawObservable: Observable<GraphDataRaw> = this.graphDataRawBS.asObservable()

	defaultFileTree: FileTree = {name: "", isFile: false, path: "", children: []};
	currentFileTree: FileTree = {name: "", isFile: false, path: "", children: []};
	private fileTreeBS: BehaviorSubject<FileTree> = new BehaviorSubject<FileTree>(this.defaultFileTree);
	public fileTreeObservable: Observable<FileTree> = this.fileTreeBS.asObservable();

	defaultGraphPaths: string[] = []
	currentGraphPaths: string[] = []
	private graphPathsBS: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.defaultGraphPaths);
	public graphPathsObservable: Observable<string[]> = this.graphPathsBS.asObservable();

	constructor(private http: HttpClient) {

		// Initialize the file tree
		let params1 = new HttpParams();
		params1 = params1.append("githuburl", this.defaultGithubUrl)
		let httpObservable1 = this.http.get<FileTree>(this.fileTreeUrl, {params: params1});
		httpObservable1.subscribe((data: FileTree)=>{
			if(data) {
				this.fileTreeBS.next(data);
				this.currentFileTree = data;
			}
		})

		// Initialize the graph data
		let params2 = new HttpParams();
		params2 = params2.append("githuburl", this.defaultGithubUrl)
		let httpObservable2 = this.http.get<GraphDataRaw>(this.graphUrl, {params: params2});
		httpObservable2.subscribe((data: GraphDataRaw)=>{
			if(data) {
				this.graphDataRawBS.next(data);
				this.currentGraphDataRaw = data;
			}
		})

		// Keep track of the current github url
		this.githubUrlObservable.subscribe((data: string) => {
			this.currentGithubUrl = data;
		});

		// Keep track of the current data
		this.graphDataRawObservable.subscribe((data: GraphDataRaw) => {
			this.currentGraphDataRaw = data;
		});
	}

	
	updateGithubUrl(githubUrl: string): void {
		this.githubUrlBS.next(githubUrl)

		let params = new HttpParams();
		params = params.append("githuburl", githubUrl)

		let httpObservable = this.http.get<GraphDataRaw>(this.graphUrl, {params: params});
		httpObservable.subscribe((data: GraphDataRaw)=>{
			if(data) {
				this.graphDataRawBS.next(data);
				this.currentGraphDataRaw = data;
			}
		})

		this.githubUrlBS.next(githubUrl);
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

	updateGraphPaths(paths: string[]) {
		this.graphPathsBS.next(paths);
		// update the graph data
	}

	getCurrentGithubUrl(): string {
		return this.githubUrlBS.getValue();
	}

	getCurrentFileTree(): FileTree {
		let copy = Object.assign({}, this.currentFileTree)
		return copy;
	}

	getCurrentGraphDataRaw(): GraphDataRaw {
		let copy = Object.assign({}, this.currentGraphDataRaw)
		return copy;
	}

	getCurrentGraphPaths(): string[] {
		let copy = Object.assign([], this.currentGraphPaths)
		return copy;
	}


}

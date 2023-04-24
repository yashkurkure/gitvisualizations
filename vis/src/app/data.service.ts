import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { from } from 'rxjs';
import { GraphDataRaw} from './types';



// TODO: Readings
// Observable: https://www.tektutorialshub.com/angular/angular-observable-tutorial-using-rxjs/
// HttpClient: https://www.tektutorialshub.com/angular/angular-http-get-example-using-httpclient/

// TODO: a logger service would be nice
// import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

	constructor(private http: HttpClient) { }

	graphUrl = 'api/graph';

	private githubUrl = new BehaviorSubject<string>("https://github.com/yashkurkure/cs501-hw2.git")
	currentGithubUrl = this.githubUrl.asObservable()

	private selectedFiles = new BehaviorSubject<string>("No Files/Dirs selected")
	currentselectedFiles = this.selectedFiles.asObservable()

	private graphData = new BehaviorSubject<Observable<GraphDataRaw>>(this.http.get<GraphDataRaw>(this.graphUrl, {params: new HttpParams().append("githuburl", "https://github.com/yashkurkure/cs501-hw2.git")}));
	currentGraphData = this.graphData.asObservable()


	updateGithubUrl(githubUrl: string): void {
		this.githubUrl.next(githubUrl)

		let params = new HttpParams();
		params = params.append("githuburl", githubUrl)

		this.graphData.next(this.http.get<GraphDataRaw>(this.graphUrl, {params: params}));
	}

	updateSelectedFiles(selectedFiles: string): void {
		this.selectedFiles.next(selectedFiles);
	}

	getCurrentGithubUrl(): string {
		return this.githubUrl.getValue()
	}
}

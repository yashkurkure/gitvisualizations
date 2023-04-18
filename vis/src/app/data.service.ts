import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  getGraph(gitlink: string): Observable<Object> {

	let params = new HttpParams();
	params = params.append("githuburl", gitlink)
	return this.http.get<Object>(this.graphUrl, {params: params});
  }
}

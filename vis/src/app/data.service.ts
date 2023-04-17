import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getGraph(gitlink: string): string {
	let randomNumber = Math.random()*1000
	return "service works" + gitlink + randomNumber
  }
}

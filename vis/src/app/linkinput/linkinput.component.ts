import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
	selector: 'app-linkinput',
	templateUrl: './linkinput.component.html',
	styleUrls: ['./linkinput.component.css']
})
export class LinkinputComponent implements OnInit{

	constructor(private dataService: DataService) { }

	value: Object = {};
	errorMessage: string = '';
	loading: boolean = false;


	ngOnInit(): void {
	}

	onKey(event: any) { // without type info
		this.getGraph(event.target.value);
	}

	getGraph(url: string): void{

		// Only after we subscribe to the observable, the http get 
		// request is sent to the back end server.
		this.dataService.getGraph(url).subscribe(
			(response) => {                           //next() callback
				this.value = response;
			});
	}

}

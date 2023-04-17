import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
	selector: 'app-linkinput',
	templateUrl: './linkinput.component.html',
	styleUrls: ['./linkinput.component.css']
})
export class LinkinputComponent implements OnInit{

	constructor(private dataService: DataService) { }

	value = '';

	ngOnInit(): void {
	}

	onKey(event: any) { // without type info
		this.value = this.getGraph(event.target.value);
	}

	getGraph(url: string): string{
		return this.dataService.getGraph(url);
	}

}

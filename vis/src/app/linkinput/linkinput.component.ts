import { Component } from '@angular/core';

@Component({
  selector: 'app-linkinput',
  templateUrl: './linkinput.component.html',
  styleUrls: ['./linkinput.component.css']
})
export class LinkinputComponent {

	value = '';

  onKey(event: any) { // without type info
    this.value = event.target.value;
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vis';
  tabIndex = 0 ;

  changeTab(event: any){
    console.log(event.index)
    this.tabIndex = event.index;
  }
}

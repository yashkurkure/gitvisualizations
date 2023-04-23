import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatIconModule} from '@angular/material/icon'; 

const MaterialComponents = [
	MatTabsModule,
	MatToolbarModule,
	MatIconModule
];

@NgModule({
  exports: [MaterialComponents],
  imports: [MaterialComponents]
})
export class MaterialModule { }

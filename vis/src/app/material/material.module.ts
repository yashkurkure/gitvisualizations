import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatIconModule} from '@angular/material/icon';
import {TextFieldModule} from '@angular/cdk/text-field'; 
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTreeModule} from '@angular/material/tree'; 
import {MatProgressBarModule} from '@angular/material/progress-bar';

const MaterialComponents = [
	MatTabsModule,
	MatToolbarModule,
	MatIconModule,
	TextFieldModule,
	MatFormFieldModule,
	MatButtonModule,
	MatInputModule,
	MatCardModule,
	MatDividerModule,
	MatListModule,
	MatSnackBarModule,
	ScrollingModule,
	MatCheckboxModule,
	MatMenuModule,
	MatSelectModule,
	MatTreeModule,
	MatProgressBarModule,
];

@NgModule({
  exports: [MaterialComponents],
  imports: [MaterialComponents]
})
export class MaterialModule { }

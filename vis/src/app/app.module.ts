import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';
import { LinkinputComponent } from './linkinput/linkinput.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs'; 

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    LinkinputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule,
 	BrowserAnimationsModule,
	MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

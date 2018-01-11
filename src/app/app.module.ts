import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SelectorComponent } from './selector/selector.component';
import { BaseMapSelectorComponent } from './base-map-selector/base-map-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SelectorComponent,
    BaseMapSelectorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

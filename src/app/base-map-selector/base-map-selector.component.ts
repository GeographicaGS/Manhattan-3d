import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-base-map-selector',
  templateUrl: './base-map-selector.component.html',
  styleUrls: ['./base-map-selector.component.scss']
})
export class BaseMapSelectorComponent implements OnInit {

  invert = true;
  rotation = -180;

  @Output() onChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  toggleSelector() {
    this.invert = !this.invert;
    this.rotation -= 180;
    this.onChange.emit(this.invert ? 'moon' : 'sun');
  }

}

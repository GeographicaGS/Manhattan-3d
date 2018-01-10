import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  @Input() values = [];
  @Output() onSelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  select(value) {
    this.onSelected.emit(value);
  }

}

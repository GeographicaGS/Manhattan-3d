import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  selected: string;
  @Output() onSelected = new EventEmitter<string>();
  private _values = [];
  @Input() set values(values) {
    this._values = values;
    if (values.length > 0) {
      this.selected = values[0].title;
    }
  }

  constructor() { }

  ngOnInit() {
  }

  select(elem) {
    this.selected = elem.title;
    this.onSelected.emit(elem.value);
  }

}

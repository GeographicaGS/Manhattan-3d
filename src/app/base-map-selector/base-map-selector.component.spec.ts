import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMapSelectorComponent } from './base-map-selector.component';

describe('BaseMapSelectorComponent', () => {
  let component: BaseMapSelectorComponent;
  let fixture: ComponentFixture<BaseMapSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMapSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMapSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

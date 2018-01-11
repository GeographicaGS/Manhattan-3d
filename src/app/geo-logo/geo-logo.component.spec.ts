import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoLogoComponent } from './geo-logo.component';

describe('GeoLogoComponent', () => {
  let component: GeoLogoComponent;
  let fixture: ComponentFixture<GeoLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

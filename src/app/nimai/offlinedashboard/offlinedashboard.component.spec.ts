import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinedashboardComponent } from './offlinedashboard.component';

describe('OfflinedashboardComponent', () => {
  let component: OfflinedashboardComponent;
  let fixture: ComponentFixture<OfflinedashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinedashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineSecDashboardDetailsComponent } from './offline-sec-dashboard-details.component';

describe('OfflineSecDashboardDetailsComponent', () => {
  let component: OfflineSecDashboardDetailsComponent;
  let fixture: ComponentFixture<OfflineSecDashboardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineSecDashboardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineSecDashboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

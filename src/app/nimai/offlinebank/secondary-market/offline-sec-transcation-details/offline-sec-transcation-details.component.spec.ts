import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineSecTranscationDetailsComponent } from './offline-sec-transcation-details.component';

describe('OfflineSecTranscationDetailsComponent', () => {
  let component: OfflineSecTranscationDetailsComponent;
  let fixture: ComponentFixture<OfflineSecTranscationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineSecTranscationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineSecTranscationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

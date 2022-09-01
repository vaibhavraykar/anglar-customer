import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineSecActiveTranscationComponent } from './offline-sec-active-transcation.component';

describe('OfflineSecActiveTranscationComponent', () => {
  let component: OfflineSecActiveTranscationComponent;
  let fixture: ComponentFixture<OfflineSecActiveTranscationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineSecActiveTranscationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineSecActiveTranscationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

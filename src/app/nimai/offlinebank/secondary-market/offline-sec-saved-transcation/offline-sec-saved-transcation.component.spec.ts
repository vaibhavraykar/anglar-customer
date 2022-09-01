import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineSecSavedTranscationComponent } from './offline-sec-saved-transcation.component';

describe('OfflineSecSavedTranscationComponent', () => {
  let component: OfflineSecSavedTranscationComponent;
  let fixture: ComponentFixture<OfflineSecSavedTranscationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineSecSavedTranscationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineSecSavedTranscationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

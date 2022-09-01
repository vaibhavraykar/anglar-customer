import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineActiveTranscationComponent } from './offline-active-transcation.component';

describe('OfflineActiveTranscationComponent', () => {
  let component: OfflineActiveTranscationComponent;
  let fixture: ComponentFixture<OfflineActiveTranscationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineActiveTranscationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineActiveTranscationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

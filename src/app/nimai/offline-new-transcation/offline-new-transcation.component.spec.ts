import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineNewTranscationComponent } from './offline-new-transcation.component';

describe('OfflineNewTranscationComponent', () => {
  let component: OfflineNewTranscationComponent;
  let fixture: ComponentFixture<OfflineNewTranscationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineNewTranscationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineNewTranscationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

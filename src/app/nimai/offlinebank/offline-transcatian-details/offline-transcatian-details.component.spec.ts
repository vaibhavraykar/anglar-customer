import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineTranscatianDetailsComponent } from './offline-transcatian-details.component';

describe('OfflineTranscatianDetailsComponent', () => {
  let component: OfflineTranscatianDetailsComponent;
  let fixture: ComponentFixture<OfflineTranscatianDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineTranscatianDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineTranscatianDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

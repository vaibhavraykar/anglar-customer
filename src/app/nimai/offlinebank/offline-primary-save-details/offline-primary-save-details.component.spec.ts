import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePrimarySaveDetailsComponent } from './offline-primary-save-details.component';

describe('OfflinePrimarySaveDetailsComponent', () => {
  let component: OfflinePrimarySaveDetailsComponent;
  let fixture: ComponentFixture<OfflinePrimarySaveDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinePrimarySaveDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePrimarySaveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

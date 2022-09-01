import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineBankComponent } from './offline-bank.component';

describe('OfflineBankComponent', () => {
  let component: OfflineBankComponent;
  let fixture: ComponentFixture<OfflineBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

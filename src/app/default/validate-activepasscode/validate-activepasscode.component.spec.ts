import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateActivepasscodeComponent } from './validate-activepasscode.component';

describe('ValidateActivepasscodeComponent', () => {
  let component: ValidateActivepasscodeComponent;
  let fixture: ComponentFixture<ValidateActivepasscodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateActivepasscodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateActivepasscodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePasscodeComponent } from './validate-passcode.component';

describe('ValidatePasscodeComponent', () => {
  let component: ValidatePasscodeComponent;
  let fixture: ComponentFixture<ValidatePasscodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatePasscodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatePasscodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

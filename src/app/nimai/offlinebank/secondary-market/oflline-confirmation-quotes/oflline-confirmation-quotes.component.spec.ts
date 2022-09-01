import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfllineConfirmationQuotesComponent } from './oflline-confirmation-quotes.component';

describe('OfllineConfirmationQuotesComponent', () => {
  let component: OfllineConfirmationQuotesComponent;
  let fixture: ComponentFixture<OfllineConfirmationQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfllineConfirmationQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfllineConfirmationQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

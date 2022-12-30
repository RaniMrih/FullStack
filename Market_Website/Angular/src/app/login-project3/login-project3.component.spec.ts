import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProject3Component } from './login-project3.component';

describe('LoginProject3Component', () => {
  let component: LoginProject3Component;
  let fixture: ComponentFixture<LoginProject3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginProject3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginProject3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

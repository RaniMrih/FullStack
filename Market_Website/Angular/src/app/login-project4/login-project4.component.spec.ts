import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProject4Component } from './login-project4.component';

describe('LoginProject4Component', () => {
  let component: LoginProject4Component;
  let fixture: ComponentFixture<LoginProject4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginProject4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginProject4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

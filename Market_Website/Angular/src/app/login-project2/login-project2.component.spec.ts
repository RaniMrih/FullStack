import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProject2Component } from './login-project2.component';

describe('LoginProject2Component', () => {
  let component: LoginProject2Component;
  let fixture: ComponentFixture<LoginProject2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginProject2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginProject2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

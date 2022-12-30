import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProjectComponent } from './login-project.component';

describe('LoginProjectComponent', () => {
  let component: LoginProjectComponent;
  let fixture: ComponentFixture<LoginProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

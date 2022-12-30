import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotAdminComponent } from './user-not-admin.component';

describe('UserNotAdminComponent', () => {
  let component: UserNotAdminComponent;
  let fixture: ComponentFixture<UserNotAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNotAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

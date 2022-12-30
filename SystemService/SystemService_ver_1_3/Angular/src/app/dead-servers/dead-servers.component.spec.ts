import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadServersComponent } from './dead-servers.component';

describe('DeadServersComponent', () => {
  let component: DeadServersComponent;
  let fixture: ComponentFixture<DeadServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeadServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

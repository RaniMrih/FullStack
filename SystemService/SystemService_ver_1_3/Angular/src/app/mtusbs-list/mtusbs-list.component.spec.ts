import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtusbsListComponent } from './mtusbs-list.component';

describe('MtusbsListComponent', () => {
  let component: MtusbsListComponent;
  let fixture: ComponentFixture<MtusbsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtusbsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtusbsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalimageComponent } from './modalimage.component';

describe('ModalimageComponent', () => {
  let component: ModalimageComponent;
  let fixture: ComponentFixture<ModalimageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalimageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

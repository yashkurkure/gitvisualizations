import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkinputComponent } from './linkinput.component';

describe('LinkinputComponent', () => {
  let component: LinkinputComponent;
  let fixture: ComponentFixture<LinkinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkinputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

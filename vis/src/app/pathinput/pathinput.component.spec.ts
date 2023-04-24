import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathinputComponent } from './pathinput.component';

describe('PathinputComponent', () => {
  let component: PathinputComponent;
  let fixture: ComponentFixture<PathinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathinputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

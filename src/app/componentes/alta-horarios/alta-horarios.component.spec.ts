import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaHorariosComponent } from './alta-horarios.component';

describe('AltaHorariosComponent', () => {
  let component: AltaHorariosComponent;
  let fixture: ComponentFixture<AltaHorariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaHorariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

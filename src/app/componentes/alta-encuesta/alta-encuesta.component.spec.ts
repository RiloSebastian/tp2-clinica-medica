import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaEncuestaComponent } from './alta-encuesta.component';

describe('AltaEncuestaComponent', () => {
  let component: AltaEncuestaComponent;
  let fixture: ComponentFixture<AltaEncuestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaEncuestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaMensajeRechazoComponent } from './alta-mensaje-rechazo.component';

describe('AltaMensajeRechazoComponent', () => {
  let component: AltaMensajeRechazoComponent;
  let fixture: ComponentFixture<AltaMensajeRechazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaMensajeRechazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaMensajeRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

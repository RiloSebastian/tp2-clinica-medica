import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMensajesComponent } from './tabla-mensajes.component';

describe('TablaMensajesComponent', () => {
  let component: TablaMensajesComponent;
  let fixture: ComponentFixture<TablaMensajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaMensajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaMensajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

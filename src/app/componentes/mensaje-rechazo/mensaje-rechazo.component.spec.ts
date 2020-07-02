import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeRechazoComponent } from './mensaje-rechazo.component';

describe('MensajeRechazoComponent', () => {
  let component: MensajeRechazoComponent;
  let fixture: ComponentFixture<MensajeRechazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeRechazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

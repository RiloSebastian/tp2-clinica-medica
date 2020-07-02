import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeReseniaComponent } from './mensaje-resenia.component';

describe('MensajeReseniaComponent', () => {
  let component: MensajeReseniaComponent;
  let fixture: ComponentFixture<MensajeReseniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeReseniaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeReseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

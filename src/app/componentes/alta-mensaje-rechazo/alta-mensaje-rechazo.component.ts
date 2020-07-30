import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificacionService } from '../../servicios/notificacion.service';
import { TurnoService } from '../../servicios/turno.service';
declare var $: any;

@Component({
	selector: 'app-alta-mensaje-rechazo',
	templateUrl: './alta-mensaje-rechazo.component.html',
	styleUrls: ['./alta-mensaje-rechazo.component.css']
})

export class AltaMensajeRechazoComponent implements OnInit {
	@Input() turnoSeleccionado: any;
	@Input() flag: boolean;
	@Output() flagChange = new EventEmitter<boolean>();
	@ViewChild('ngForm', { static: false }) form: any;

	public mensajeForm = new FormGroup({
		remitente: new FormControl(null, Validators.required),
		destinatario: new FormControl(null, Validators.required),
		nombreRemitente: new FormControl(null, Validators.required),
		nombreDestinatario: new FormControl(null, Validators.required),
		asunto: new FormControl(null, Validators.required),
		motivo: new FormControl(null, Validators.required),
		referencia: new FormControl(null, Validators.required),
		captcha: new FormControl(null, Validators.required)
	})
	public submit: boolean = false;
	public enviado: boolean = null;

	constructor(public turnos: TurnoService, public notificaciones: NotificacionService) { }

	ngOnInit(): void {
		this.mensajeForm.controls.remitente.setValue(this.turnoSeleccionado.profesional);
		this.mensajeForm.controls.destinatario.setValue(this.turnoSeleccionado.paciente);
		this.mensajeForm.controls.nombreRemitente.setValue(this.turnoSeleccionado.nombreProfesional);
		this.mensajeForm.controls.nombreDestinatario.setValue(this.turnoSeleccionado.nombrePaciente);
		this.mensajeForm.controls.asunto.setValue('Cancelado');
		this.mensajeForm.controls.referencia.setValue('/Turnos');
	}

	enviarMensaje(mensaje) {
		this.submit = true;
		if (mensaje.status === 'VALID') {
			this.turnos.cambiarEstado(this.turnoSeleccionado.id, 'Cancelado').then(() => {
				this.notificaciones.guardarNotificacion(mensaje.value);
				this.resetearForm();
			});
		} else {
			this.enviado = false;
			setTimeout(() => {
				this.enviado = null;
			}, 3500);
		}
	}

	resetearForm() {
		if (this.form !== undefined) {
			this.form.resetForm();
		}
		this.mensajeForm.reset();
		this.submit = false;
		$('#modalTurno').modal('hide');
		this.flagChange.emit(false);
	}


}

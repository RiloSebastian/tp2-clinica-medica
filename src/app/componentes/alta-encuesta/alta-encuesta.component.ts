import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EncuestaService } from '../../servicios/encuesta.service';
import { NotificacionService } from '../../servicios/notificacion.service';
import { TurnoService } from '../../servicios/turno.service';
declare var $: any;

@Component({
	selector: 'app-alta-encuesta',
	templateUrl: './alta-encuesta.component.html',
	styleUrls: ['./alta-encuesta.component.css']
})
export class AltaEncuestaComponent implements OnInit {
	@Input() turnoSeleccionado: any;
	@Input() flag: boolean;
	@Output() flagChange = new EventEmitter<boolean>();
	@ViewChild('ngForm', { static: false }) form: any;

	public encuestaForm = new FormGroup({
		id: new FormControl(null, Validators.required),
		fecha: new FormControl(null, Validators.required),
		paciente: new FormControl(null, Validators.required),
		profesional: new FormControl(null, Validators.required),
		nombreProfesional: new FormControl(null, Validators.required),
		nombrePaciente: new FormControl(null, Validators.required),
		primeraVez: new FormControl(null, Validators.required),
		profesionalInadecuado: new FormControl(null, Validators.required),
		profesionalSucio: new FormControl(null, Validators.required),
		profesionalImpreciso: new FormControl(null, Validators.required),
		probabilidadDeOtroTurno: new FormControl(null, Validators.required),
		calificacionGeneral: new FormControl(null, Validators.required),
		conclusionesFinales: new FormControl(null, Validators.required),
		captcha: new FormControl(null, Validators.required)
	});
	public estrellaValue = 3;
	public probabilidadVolver = 3;
	public submit: boolean = false;
	public generado = null;

	constructor(public encuestas: EncuestaService, public notificaciones: NotificacionService, public turnos: TurnoService) { }

	ngOnInit(): void {
		this.encuestaForm.controls.id.setValue(this.turnoSeleccionado.id);
		this.encuestaForm.controls.fecha.setValue(this.turnoSeleccionado.fecha);
		this.encuestaForm.controls.paciente.setValue(this.turnoSeleccionado.paciente);
		this.encuestaForm.controls.profesional.setValue(this.turnoSeleccionado.profesional);
		this.encuestaForm.controls.nombreProfesional.setValue(this.turnoSeleccionado.nombreProfesional);
		this.encuestaForm.controls.nombrePaciente.setValue(this.turnoSeleccionado.nombrePaciente);
		this.encuestaForm.controls.primeraVez.setValue('Si');
		this.encuestaForm.controls.profesionalInadecuado.setValue('No');
		this.encuestaForm.controls.profesionalSucio.setValue('No');
		this.encuestaForm.controls.profesionalImpreciso.setValue('No');
		this.cambiarProbabilidad();
		this.calificar(this.estrellaValue);
	}

	cambiarPrimeraVez(valor) {
		this.encuestaForm.controls.primeraVez.setValue(valor);
	}

	cambiarProbabilidad() {
		let x: string = '';
		switch (this.probabilidadVolver) {
			case 1:
				x = 'Muy Baja';
				break;
			case 2:
				x = 'Baja';
				break;
			case 3:
				x = 'Intermedia';
				break;
			case 4:
				x = 'Alta';
				break;
			case 5:
				x = 'Muy Alta';
				break;
		}
		this.encuestaForm.controls.probabilidadDeOtroTurno.setValue(x);
	}

	calificar(value) {
		let x: string = '';
		switch (parseInt(value)) {
			case 1:
				x = '1/5';
				break;
			case 2:
				x = '2/5';
				break;
			case 3:
				x = '3/5';
				break;
			case 4:
				x = '4/5';
				break;
			case 5:
				x = '5/5';
				break;
		}
		this.estrellaValue = parseInt(value);
		this.encuestaForm.controls.calificacionGeneral.setValue(x);
	}

	cambiarSituaciones(situacion) {
		if (this.encuestaForm.value['profesional' + situacion] === 'Si') {
			this.encuestaForm.controls['profesional' + situacion].setValue('No');
		} else {
			this.encuestaForm.controls['profesional' + situacion].setValue('Si');
		}
	}


	enviarEncuesta(encuesta) {
		this.submit = true;
		if (encuesta.status === 'VALID') {
			this.encuestas.guardarEncuesta(encuesta.value).then(() => {
				this.turnos.guardarResenia(this.turnoSeleccionado.id);
				this.enviarNotificacion(this.turnoSeleccionado.id);
				this.resetearForm();
			});
		} else {
			this.generado = false;
			setTimeout(() => {
				this.generado = null;
			}, 3500);
		}
	}

	resetearForm() {
		if (this.form !== undefined) {
			this.form.resetForm();
		}
		this.encuestaForm.reset();
		this.submit = false;
		$('#modalTurno').modal('hide');
		this.flagChange.emit(false);
	}

	enviarNotificacion(idTurno){
		let notificacion:any = {
			remitente: this.encuestaForm.value.paciente,
			destinatario: this.encuestaForm.value.profesional,
			nombreRemitente: this.encuestaForm.value.nombrePaciente,
			nombreDestinatario: this.encuestaForm.value.nombreProfesional,
			asunto: 'Encuesta',
			referencia: '/Listados'
		}
		this.notificaciones.guardarNotificacion(notificacion);
	}
}

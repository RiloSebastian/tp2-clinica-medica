import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { TurnoService } from '../../servicios/turno.service';
import { HistoriaClinicaService } from '../../servicios/historia-clinica.service';
import { NotificacionService } from '../../servicios/notificacion.service';
import { InformeService } from '../../servicios/informe.service';
import { Turno } from '../../clases/turno';
declare var $: any;

@Component({
	selector: 'app-alta-historia-clinica',
	templateUrl: './alta-historia-clinica.component.html',
	styleUrls: ['./alta-historia-clinica.component.css']
})
export class AltaHistoriaClinicaComponent implements OnInit {
	@Input() turnoSeleccionado: any;
	@Input() flag: boolean;
	@Output() flagChange = new EventEmitter<boolean>();
	@ViewChild('ngForm', { static: false }) form: any;
	public paciente: any = {};
	public edad: number = 0;
	public generado = null;
	public historiaForm = new FormGroup({
		id: new FormControl(null, Validators.required),
		fecha: new FormControl(null, Validators.required),
		paciente: new FormControl(null, Validators.required),
		profesional: new FormControl(null, Validators.required),
		nombreProfesional: new FormControl(null, Validators.required),
		especialidad: new FormControl(null, Validators.required),
		nombrePaciente: new FormControl(null, Validators.required),
		edadPaciente: new FormControl(null, Validators.required),
		temperaturaPaciente: new FormControl(null, Validators.required),
		presionPaciente: new FormControl(null, Validators.required),
		atributosDinamicos: new FormControl(null, Validators.maxLength(3)),
		detallePaciente: new FormControl(null, Validators.required),
		captcha: new FormControl(null, Validators.required)
	});
	public atributoDinItem: Object = {};
	public atributoDinAux: Array<any> = [];
	public claveAttr: string = '';
	public operadorAttr: string = 'rango';
	public nuevoAttr: boolean = false;
	public submit: boolean = false;

	constructor(private usuarios: UsuarioService, private historias: HistoriaClinicaService,
		private turnos: TurnoService, public notificaciones: NotificacionService,  private informe: InformeService) { }

	ngOnInit(): void {
		this.inicializar();
	}

	inicializar() {
		this.usuarios.traerUno(this.turnoSeleccionado.paciente).then(ref => {
			this.paciente = ref.docs[0].data();
			this.edad = this.años()
		}).then(() => {
			this.historiaForm.controls.id.setValue(this.turnoSeleccionado.id);
			this.historiaForm.controls.fecha.setValue(this.turnoSeleccionado.fecha);
			this.historiaForm.controls.especialidad.setValue(this.turnoSeleccionado.especialidad);
			this.historiaForm.controls.profesional.setValue(this.turnoSeleccionado.profesional);
			this.historiaForm.controls.paciente.setValue(this.turnoSeleccionado.paciente);
			this.historiaForm.controls.nombreProfesional.setValue(this.turnoSeleccionado.nombreProfesional);
			this.historiaForm.controls.nombrePaciente.setValue(this.turnoSeleccionado.nombrePaciente);
			this.historiaForm.controls.edadPaciente.setValue(this.edad);
		});
	}

	años() {
		let aux = new Date()
		let aux2 = new Date(this.paciente.nacimiento);
		return (aux.getFullYear() - aux2.getFullYear());
	}

	generarInput() {
		this.atributoDinItem['nombre'] = this.claveAttr;
		this.atributoDinItem['operador'] = this.operadorAttr;
		if (this.operadorAttr === 'rango' || this.operadorAttr === 'numerico') {
			this.atributoDinItem['valor'] = 0;
		} else {
			this.atributoDinItem['valor'] = 'si';
		}
		this.atributoDinAux.push(this.atributoDinItem);
		this.atributoDinItem = {};
		this.claveAttr = '';
		this.operadorAttr = 'rango';
		this.nuevoAttr = false;
		this.historiaForm.controls.atributosDinamicos.setValue(this.atributoDinAux);
	}

	borrarInput(indice) {
		this.atributoDinAux.splice(parseInt(indice), 1);
		this.historiaForm.controls.atributosDinamicos.setValue(this.atributoDinAux);
	}

	guardarHistoria(historia) {
		this.submit = true;
		if (historia.status === 'VALID') {
			this.historias.guardarHistoria(historia.value).then(() => {
				this.turnos.cambiarEstado(this.turnoSeleccionado.id, 'Resuelto');
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
		this.atributoDinAux = [];
		if (this.form !== undefined) {
			this.form.resetForm();
		}
		this.paciente = {};
		this.edad = 0;
		this.historiaForm.reset();
		this.submit = false;
		$('#modalTurno').modal('hide');
		this.flagChange.emit(false);
	}

	enviarNotificacion(idTurno){
		let notificacion:any = {
			remitente: this.historiaForm.value.profesional,
			destinatario: this.historiaForm.value.paciente,
			nombreRemitente: this.historiaForm.value.nombreProfesional,
			nombreDestinatario: this.historiaForm.value.nombrePaciente,
			asunto: 'Historia',
			referencia: '/Listados'
		}
		this.notificaciones.guardarNotificacion(notificacion);
		this.informe.guardarLogOperaciones(this.turnoSeleccionado,'Encuesta');
	}

}

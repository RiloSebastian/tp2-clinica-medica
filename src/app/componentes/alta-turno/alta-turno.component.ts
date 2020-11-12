import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { TurnoService } from '../../servicios/turno.service';
import { NotificacionService } from '../../servicios/notificacion.service';
import { Turno } from '../../clases/turno';
import { Horario } from '../../clases/horario';

@Component({
	selector: 'app-alta-turno',
	templateUrl: './alta-turno.component.html',
	styleUrls: ['./alta-turno.component.css']
})
export class AltaTurnoComponent implements OnInit {
	@Input() usuario: any;
	@Input() profesionales: Array<any>;
	@ViewChild('ngForm', { static: false }) form: any;
	public profesionalSeleccionado: any = null;
	public profesionalAgendaAux: any = [];
	public profesionalDias = [];
	public profesionalHorarios = [];
	public guardado = null;
	public submit: boolean = false;
	public turnoForm = new FormGroup({
		paciente: new FormControl(null),
		profesional: new FormControl(null),
		nombrePaciente: new FormControl(null),
		nombreProfesional: new FormControl(null),
		especialidadI: new FormControl(null, Validators.required),
		diaI: new FormControl(null, Validators.required),
		horarioI: new FormControl(null, Validators.required),
		captcha: new FormControl(null, Validators.required)
	});

	constructor(private usuarios: UsuarioService, private turnos: TurnoService, public notificaciones: NotificacionService) { }

	ngOnInit(): void {
	}

	//elige el profesional 
	elegirProfesional(profesional) {
		this.profesionalSeleccionado = {};
		this.profesionalSeleccionado = profesional;
		this.profesionalDias = [];
		this.profesionalHorarios = [];
		this.profesionalAgendaAux = [];
		for (let dia of this.profesionalSeleccionado.horarios) {
			let arr = [dia.dia,dia.desde,dia.hasta,dia.especialidad];
			arr[0] = Horario.obtenerDiaNum(arr[0]); // arr: [1,'16:00','20:00',especialidad]
			this.profesionalAgendaAux.push(arr);
		}
		this.turnoForm.controls.paciente.setValue(this.usuario.email);
		this.turnoForm.controls.profesional.setValue(this.profesionalSeleccionado.email);
		this.turnoForm.controls.nombrePaciente.setValue(this.usuario.apellido + ' ' + this.usuario.nombre);
		this.turnoForm.controls.nombreProfesional.setValue(this.profesionalSeleccionado.apellido + ' ' + this.profesionalSeleccionado.nombre);
		this.turnoForm.controls.diaI.setValue(null);
		this.turnoForm.controls.horarioI.setValue(null);
		this.turnoForm.controls.especialidadI.setValue(null);
	}

	//obtiene especialidades
	obtenerEspecialidad(especialidad) {
		this.profesionalDias = [];
		this.profesionalHorarios = [];
		this.turnoForm.controls.especialidadI.setValue(especialidad);
		this.turnoForm.controls.diaI.setValue(null);
		this.turnoForm.controls.horarioI.setValue(null);
		this.profesionalDias = Horario.obtenerProyeccionCantDias(30);
		this.filtrarDias(this.turnoForm.value.especialidadI)
	}

	//filtra la quincena para que solo se puedan elegir los dias que trabaja el profesional
	filtrarDias(especialidad) {
		this.profesionalDias = this.profesionalDias.filter(dia => {
			let numDia = dia.getDay();
			if (this.profesionalAgendaAux.some(agendaDia => numDia === agendaDia[0] && especialidad['nombre'] === agendaDia[3])) {
				return true;
			}
			return false;
		});
	}

	//genera horarios DinamicaMente Para que el usuario Elija
	elegirDia(diaInput) {
		this.turnoForm.controls.diaI.setValue(diaInput);
		let dia = new Date(parseInt(this.turnoForm.value.diaI));
		this.profesionalHorarios = [];
		let numD = dia.getDay();
		let agendaDia = this.profesionalAgendaAux.find(agendaDia => agendaDia[0] == numD);
		let horarioEntrada = new Date(dia).setHours(parseInt(agendaDia[1].split(':')[0]), parseInt(agendaDia[1].split(':')[1]));
		let horarioSalida = new Date(dia).setHours(parseInt(agendaDia[2].split(':')[0]), parseInt(agendaDia[2].split(':')[1]));
		this.profesionalHorarios = Horario.generarHorarios(this.turnoForm.value.especialidadI['duracion'], horarioEntrada, horarioSalida);
		this.filtrarHorarios();
		this.turnoForm.controls.horarioI.setValue(null);
	}

	async filtrarHorarios() {
		let aux = [];
		await this.turnos.getTurnos().then(snap => {
			aux = snap.docs.map(doc => {
				const data = doc.data() as Turno;
				data.id = doc.id;
				return { ...data }
			});
		});
		let turnosPart = [];
		turnosPart = aux.filter((turno: Turno) => {
			if ((turno.profesional === this.profesionalSeleccionado.email || turno.paciente === this.usuario.email) &&
				(turno.estado === 'Pendiente' || turno.estado === 'Preparado')) {
				return true;
			}
			return false;
		});
		this.profesionalHorarios = this.profesionalHorarios.filter((horario: Date) => {
			if (turnosPart.some((turno: Turno) => horario.getTime() === turno.fecha) || horario.getTime() <= Date.now()) {
				return false;
			}
			return true;
		});
	}

	turnoRapido(){
		this.elegirDia(this.profesionalDias[0].getTime());
		this.turnoForm.controls.horarioI.setValue(this.profesionalHorarios[0].getTime());
	}

	guardarTurno(turno) {
		this.submit = true;
		if (turno.status === 'VALID') {
			turno.value.especialidadI = turno.value.especialidadI['nombre'];
			this.turnos.guardarTurno(turno.value).then((ref) => {
				this.enviarNotificacion(ref.id);
				this.resetearForm();
				this.guardado = true;
				setTimeout(() => {
					this.guardado = null;
				}, 3500);
			}).catch(() => {
				this.guardado = false;
				setTimeout(() => {
					this.guardado = null;
				}, 3500);
			});
		}
	}

	resetearForm() {
		this.profesionalSeleccionado = null;
		this.profesionalDias = [];
		this.profesionalHorarios = [];
		this.profesionalAgendaAux = [];
		this.turnoForm.reset();
		if (this.form !== undefined) {
			this.form.resetForm();
		}
		this.submit = false;
	}

	enviarNotificacion(idTurno){
		let notificacion:any = {
			remitente: this.turnoForm.value.paciente,
			destinatario: this.turnoForm.value.profesional,
			nombreRemitente: this.turnoForm.value.nombrePaciente,
			nombreDestinatario: this.turnoForm.value.nombreProfesional,
			asunto: 'Nuevo',
			referencia: '/Turnos',
		}
		this.notificaciones.guardarNotificacion(notificacion);
	}

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { TurnoService } from '../../servicios/turno.service';
import { NotificacionService } from '../../servicios/notificacion.service';
import { InformeService } from '../../servicios/informe.service';
import { Turno } from '../../clases/turno';
import { ESPECIALIDADES } from '../../mocks/especialidades-mock';

@Component({
	selector: 'app-turnos',
	templateUrl: './turnos.component.html',
	styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit, OnDestroy {
	public usuario: any = {};
	public usuarioTurnos: Array<any>= null;
	public profesionales: Array<any>;
	public turnoSeleccionado: any = null;
	public semana: Array<string> = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
	public mockEsp = ESPECIALIDADES;
	public fNombre = '';
	public fEspecialidad = '';
	public fDia = '-1';
	public subEstados = null;
	public subTurnos = null;
	public flagAtenderProf: boolean = false;
	public flagEncuestaPac: boolean = false;
	public flagCancelarProf: boolean = false;
	public flagNuevoTurno: boolean = false;


	constructor(private auth: AuthService, private usuarios: UsuarioService,
		private turnos: TurnoService, private notificaciones: NotificacionService, private informe: InformeService) { }

	ngOnInit(): void {
		this.inicializar();
	}

	async inicializar() {
		this.desubscribirse();
		await this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref => {
			this.usuario = ref.data();
			let snap = ref.data();
		});
		if (this.usuario.rol === 'Paciente') {
			this.subTurnos = await this.turnos.getTurnosPaciente(this.usuario.email).subscribe(snap => {
				this.usuarioTurnos = snap.map(ref => {
					const data = ref.payload.doc.data() as Object;
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
				this.acortarCantidad();
				this.filtrarTurnos();
				this.subEstados = this.turnos.actualizarEstado(this.usuarioTurnos).subscribe(() => {
					this.usuarioTurnos = this.ordenarLista(this.usuarioTurnos);
				});
			});
			await this.usuarios.traerProfesionales().then(ref => {
				this.profesionales = ref.docs.map(doc => {
					return { ...doc.data() };
				});
			});
		} else if (this.usuario.rol === 'Profesional') {
			this.subTurnos = await this.turnos.getTurnosProfesional(this.usuario.email).subscribe(snap => {
				this.usuarioTurnos = snap.map(ref => {
					const data = ref.payload.doc.data() as Object;
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
				this.subEstados = this.turnos.actualizarEstado(this.usuarioTurnos).subscribe(() => {
					this.usuarioTurnos = this.ordenarLista(this.usuarioTurnos);
				});
			});
		} else if (this.usuario.rol === 'Admin') {
			this.subTurnos = await this.turnos.getTurnosAdministrador().subscribe(snap => {
				this.usuarioTurnos = snap.map(ref => {
					const data = ref.payload.doc.data() as Object;
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
				this.filtrarTurnos();
				this.subEstados = this.turnos.actualizarEstado(this.usuarioTurnos).subscribe(() => {
					this.usuarioTurnos = this.ordenarLista(this.usuarioTurnos);
				});
			});
		}
	}

	ordenarLista(listaTurnos) {
		listaTurnos.sort((x, y) => {
			let pn = this.asignarValor(x);
			let sn = this.asignarValor(y);
			return pn - sn;
		});
		return listaTurnos;
	}

	asignarValor(x) {
		let i = 0;
		switch (x.estado) {
			case 'Preparado':
				i = 1;
				break;
			case 'Pendiente':
				i = 2;
				break;
			case 'Aceptado':
				i = 3;
				break;
			case 'Resuelto':
				i = 4;
				break;
			case 'Cancelado':
				i = 5;
				break;
		}
		return i;
	}

	acortarCantidad() {
		this.usuarioTurnos = this.usuarioTurnos.filter(turno => {
			let ahora = new Date();
			if (turno.fecha <= (ahora.getTime() + (15 * 24 * 60 * 60 * 1000))) {
				return true;
			}
			return false;
		});
	}

	filtrarTurnos() {
		this.usuarioTurnos = this.usuarioTurnos.filter(turno => {
			let apellido: string = turno.nombreProfesional.split(' ')[0];
			if (this.fNombre === '' || apellido.toLowerCase().includes(this.fNombre.toLowerCase())) {
				if (this.fDia === '-1' || new Date(turno.fecha).getDay() === parseInt(this.fDia)) {
					if (this.fEspecialidad === '' || this.fEspecialidad === turno.especialidad) {
						return true;
					}
				}
			}
			return false;
		});
	}

	nuevoTurno() {
		this.flagNuevoTurno = true;
	}

	aceptar(turno) {
		this.turnos.cambiarEstado(turno.id, 'Aceptado').then(() => {
			let notificacion: any = {
				remitente: turno.profesional,
				destinatario: turno.paciente,
				nombreRemitente: turno.nombreProfesional,
				nombreDestinatario: turno.nombrePaciente,
				asunto: 'Aceptado',
				referencia: '/Turnos',
			}
			this.notificaciones.guardarNotificacion(notificacion);
			this.informe.guardarLogOperaciones(turno,'Aceptar');
		});
	}

	atender(turno) {
		this.turnoSeleccionado = turno;
		this.flagAtenderProf = true;
		this.informe.guardarLogOperaciones(turno,'Atender');
	}

	cancelar(turno) {
		if (this.usuario.rol === 'Profesional') {
			this.turnoSeleccionado = turno;
			this.flagCancelarProf = true;
			this.informe.guardarLogOperaciones(turno,'Cancelar');
		} else {
			this.turnos.cambiarEstado(turno.id, 'Cancelado');
		}
	}

	encuesta(turno) {
		this.turnoSeleccionado = turno;
		this.flagEncuestaPac = true;
	}

	desubscribirse() {
		if (this.subTurnos !== null) {
			this.subTurnos.unsubscribe();
		}
		if (this.subEstados !== null) {
			this.subEstados.unsubscribe();
		}
	}

	ngOnDestroy(): void {
		this.desubscribirse();
	}
}
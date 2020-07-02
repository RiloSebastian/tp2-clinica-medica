import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { TurnoService } from '../../servicios/turno.service';
import { Turno } from '../../clases/turno';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-turnos',
	templateUrl: './turnos.component.html',
	styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit, OnDestroy {
	public usuario: any = {};
	public usuarioTurnos: Array<any>;
	public profesionales: Array<any>;
	public flagTurnoSel: boolean = false;
	public turnoSeleccionado: any = {};
	public subEstados;
	public subTurnos;


	constructor(private auth: AuthService, private usuarios: UsuarioService, private turnos: TurnoService) { }

	ngOnInit(): void {
		this.inicializar();
	}

	async inicializar() {
		await this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref => {
			this.usuario = ref.data();
			let snap = ref.data();
		});
		if (this.usuario.rol === 'Paciente') {
			this.subTurnos = await this.turnos.getTurnosPaciente(this.usuario.email).subscribe(snap => {
				this.usuarioTurnos = snap.map(ref => {
					const data = ref.payload.doc.data() as Turno;
					data.id = ref.payload.doc.id;
					return { ...data }
				});
				this.subEstados = this.turnos.actualizarEstado(this.usuarioTurnos).subscribe();
			});
			await this.usuarios.traerProfesionales().then(ref => {
				this.profesionales = ref.docs.map(doc => {
					return { ...doc.data() };
				});
			});
		}
		if (this.usuario.rol === 'Profesional') {
			this.subTurnos = await this.turnos.getTurnosProfesional(this.usuario.email).subscribe(snap => {
				this.usuarioTurnos = snap.map(ref => {
					const data = ref.payload.doc.data() as Turno;
					data.id = ref.payload.doc.id;
					return { ...data }
				});
				this.subEstados = this.turnos.actualizarEstado(this.usuarioTurnos).subscribe();
			});
		}
	}

	aceptar(turno: Turno) {
		this.turnos.cambiarEstado(turno.id, 'Aceptado');
	}

	atender(turno: Turno) {
		this.turnoSeleccionado = turno;
		this.flagTurnoSel = true;
	}

	cancelar(turno: Turno) {
		this.turnoSeleccionado = turno;
		this.flagTurnoSel = true;
		this.turnos.cambiarEstado(turno.id, 'Cancelado');
	}

	ngOnDestroy(): void {
		if (this.subTurnos !== null) {
			this.subTurnos.unsubscribe();
		}
		if (this.subEstados !== null) {
			this.subEstados.unsubscribe();
		}
	}
}
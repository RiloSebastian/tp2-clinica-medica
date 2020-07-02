import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { TurnoService } from '../../servicios/turno.service';
import { Turno } from '../../clases/turno';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-alta-turno',
	templateUrl: './alta-turno.component.html',
	styleUrls: ['./alta-turno.component.css']
})
export class AltaTurnoComponent implements OnInit {
	@Input() usuario: any;
	@Input() profesionales: Array<any>;

	public profesionalSeleccionado: any = null;
	public profesionalAgendaAux: any = [];
	public profesionalDias = [];
	public profesionalHorarios = [];
	public turnoForm = new FormGroup({
		paciente: new FormControl(''),
		profesional: new FormControl(''),
		especialidadI: new FormControl('', Validators.required),
		diaI: new FormControl('', Validators.required),
		horarioI: new FormControl('', Validators.required)
	});
	constructor(private usuarios: UsuarioService, private turnos: TurnoService) { }

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
			let arr = [];
			arr = dia.split(/hs|desde|hasta|,|las/i).join().split(/[\s,| ]+/);
			arr.pop();
			arr[0] = this.obtenerDiaNum(arr[0]); // arr: [1,'16:00','20:00']
			this.profesionalAgendaAux.push(arr);
		}
		this.profesionalDias = this.obtenerProyeccion();
		this.filtrarDias()
	}

	//obtiene array de fechas hasta 15 dias en adelante
	obtenerProyeccion() {
		let dias = [];
		let proyeccionDias = 1;
		let fecha = new Date().setHours(0, 0, 0, 0);
		while (proyeccionDias <= 15) {
			dias.push(new Date(fecha));
			fecha = fecha + (24 * 60 * 60000);
			proyeccionDias++;
		}
		return dias;
	}

	//filtra la quincena para que solo se puedan elegir los dias que trabaja el profesional
	filtrarDias() {
		this.profesionalDias = this.profesionalDias.filter(dia => {
			let numDia = dia.getDay();
			if (this.profesionalAgendaAux.some(agendaDia => numDia == agendaDia[0])) {
				return true;
			}
			return false;
		});
	}

	//obtiene el numero del dia pasado
	obtenerDiaNum(dia) {
		let numDia = -1;
		switch (dia) {
			case "Lunes":
				numDia = 1;
				break;
			case "Martes":
				numDia = 2;
				break;
			case "Miercoles":
				numDia = 3;
				break;
			case "Jueves":
				numDia = 4;
				break;
			case "Viernes":
				numDia = 5;
				break;
			case "Sabado":
				numDia = 6;
				break;
			case "Domingo":
				numDia = 0;
				break;
		}
		return numDia;
	}

	//genera horarios DinamicaMente Para que el usuario Elija
	elegirDia(aux) {
		let dia = new Date(parseInt(aux));
		this.turnoForm.value.diaI = dia;
		this.profesionalHorarios = [];
		let numD = dia.getDay();
		let agendaDia = this.profesionalAgendaAux.find(agendaDia => agendaDia[0] == numD);
		let horarioEntrada = new Date(dia).setHours(parseInt(agendaDia[1].split(':')[0]), parseInt(agendaDia[1].split(':')[1]));
		let horarioSalida = new Date(dia).setHours(parseInt(agendaDia[2].split(':')[0]), parseInt(agendaDia[2].split(':')[1]));
		while (horarioSalida % horarioEntrada !== 0) {
			this.profesionalHorarios.push(new Date(horarioEntrada));
			horarioEntrada = horarioEntrada + (15 * 60000);
		}
		this.filtrarHorarios();
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
			if (turnosPart.some((turno: Turno) => horario.getTime() === turno.fecha)) {
				return false;
			}
			return true;
		});
	}

	guardarTurno(turno) {
		this.turnoForm.value.paciente = this.usuario.email;
		this.turnoForm.value.profesional = this.profesionalSeleccionado.email;
		this.turnos.guardarTurno(turno);
		this.profesionalSeleccionado = {};
		this.profesionalDias = [];
		this.profesionalHorarios = [];
		this.profesionalAgendaAux = [];

	}



}

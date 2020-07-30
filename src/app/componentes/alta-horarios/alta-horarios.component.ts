import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-alta-horarios',
	templateUrl: './alta-horarios.component.html',
	styleUrls: ['./alta-horarios.component.css']
})
export class AltaHorariosComponent implements OnInit {
	@Input() nuevoHorario: boolean;
	@Input() horarios: Array<any>;
	@Input() especialidades: Array<any>;
	@Output() horariosChange = new EventEmitter<Array<any>>();
	@Output() nuevoHorarioChange = new EventEmitter<boolean>();
	public semana = [
		[false, 'Domingo', "08:00", "14:00", '', 30],
		[false, 'Lunes', "08:00", "19:00", '', 30],
		[false, 'Martes', "08:00", "19:00", '', 30],
		[false, 'Miercoles', "08:00", "19:00", '', 30],
		[false, 'Jueves', "08:00", "19:00", '', 30],
		[false, 'Viernes', "08:00", "19:00", '', 30],
		[false, 'Sabado', "08:00", "14:00", '', 30]
	];

	constructor() { }

	ngOnInit(): void {
		this.editarHorarios();
		this.semana.forEach(dia => this.elegirEspecialidad(0, dia));
	}

	editarHorarios() {
		if (this.horarios.length !== 0) {
			this.horarios.forEach(dia => {
				let arr = [dia.dia,dia.desde,dia.hasta];
				let diaSemana = [] = this.semana.find(diaS => diaS[1] === arr[0]);
				diaSemana[0] = true;
				diaSemana[2] = arr[1];
				diaSemana[3] = arr[2];
			});
		}
	}

	generarHorario() {
		this.horarios = [];
		let aux = []
		for (let dia of this.semana) {
			if (dia[0] == true) {
				aux.push({dia:dia[1],desde:dia[2],hasta:dia[3],especialidad:dia[4]});
			}
		}
		this.horarios = aux;
		this.horariosChange.emit(this.horarios);
		this.nuevoHorarioChange.emit(false);
	}

	cancelarHorario() {
		this.semana.forEach(dia => {
			dia[0] = false;
			dia[2] = '08:00';
			if (dia[1] === 'Sabado' || dia[1] === 'Domingo') {
				dia[3] = '14:00';
			} else{
				dia[3] = '19:00';
			}
		})
		this.nuevoHorarioChange.emit(false);
	}

	checkValue(dia) {
		if (dia === true) {
			dia = false;
		} else {
			dia = true;
		}
	}

	corregirHorario($event) {
		let constructor = new Date(0);
		let actual = [] = $event.target.value.split(':');
		let min = [] = $event.target.min.split(':');
		let max = [] = $event.target.max.split(':');
		let intervalo = (parseInt($event.target.step) * 1000);
		let fecha = constructor.setHours(parseInt(actual[0]), parseInt(actual[1]), 0, 0);
		let fechaMin = constructor.setHours(parseInt(min[0]), parseInt(min[1]), 0, 0);
		let fechaMax = constructor.setHours(parseInt(max[0]), parseInt(max[1]), 0, 0);
		let masCercano = fechaMin;
		let flag = false;
		let x = fechaMin;
		for (x; x <= fechaMax; x += intervalo) {
			if (x === fecha) {
				flag = true;
				break;
			} else {
				if (Math.abs(x % fecha) <= Math.abs(masCercano % fecha)) {
					masCercano = x;
				}
			}
		}
		if (flag) {
			return x;
		} else {
			return masCercano;
		}
	}

	transformarHorario($event) {
		let x = this.corregirHorario($event);
		let aux = new Date(x);
		return aux.getHours().toString().padStart(2, '0') + ':' + aux.getMinutes().toString().padStart(2, '0');
	}

	horarioDesde($event, i) {
		this.semana[i][2] = this.transformarHorario($event);
		$event.target.value = this.semana[i][2]
	}

	horarioHasta($event, i) {
		this.semana[i][3] = this.transformarHorario($event);
		$event.target.value = this.semana[i][3];
	}

	elegirEspecialidad(espI, dia) {
		espI = parseInt(espI);
		dia[4] = this.especialidades[espI]['nombre'];
		dia[5] = this.especialidades[espI]['duracion'];
	}

}

import { Especialidad } from './especialidad';

export class Horario {
	public dia: string;
	public especialidad: Especialidad;
	public desde: string;
	public hasta: string;

	constructor(dia: string, especialidad: Especialidad, desde: string, hasta: string) {
		this.dia = dia;
		this.especialidad = especialidad;
		this.desde = desde;
		this.hasta = hasta;
	}

	public static obtenerDiaNum(dia: string) {
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

	public static obtenerDiaString(dia: number) {
		let numDia = '';
		switch (dia) {
			case 1:
				numDia = "Lunes";
				break;
			case 2:
				numDia = "Martes";
				break;
			case 3:
				numDia = "Miercoles";
				break;
			case 4:
				numDia = "Jueves";
				break;
			case 5:
				numDia = "Viernes";
				break;
			case 6:
				numDia = "Sabado";
				break;
			case 0:
				numDia = "Domingo";
				break;
		}
		return numDia;
	}

	public static obtenerProyeccionCantDias(cantidadDias: number) {
		let dias = [];
		let fecha = new Date().setHours(0, 0, 0, 0);
		for (let proyeccionDias = 1; proyeccionDias <= cantidadDias; proyeccionDias++) {
			dias.push(new Date(fecha));
			fecha = fecha + (24 * 60 * 60 * 1000);
		}
		return dias;
	}

	public static obtenerProyeccionDiasRango(profesional, desde: number, hasta: number) {
		let diasSemana: Array<any> = this.obtenerDiasHorarios(profesional.horarios);
		let proyeccion: Array<any> = [];
		let desdeF = new Date(new Date(desde).setHours(0, 0, 0, 0));
		let hastaF = new Date(new Date(hasta).setHours(0, 0, 0, 0));
		while (desdeF.getTime() <= hastaF.getTime()) {
			proyeccion.push(desdeF);
			desdeF.setDate(desdeF.getDate() + 1);
		}
		proyeccion.filter(dia => diasSemana.some(x => x === dia.getDay()));
		return proyeccion;
	}

	public static matchDiasDin(arrDias, filtros) {
		var clavesFiltros = Object.keys(filtros);
		return arrDias.filter(dia => {
			return clavesFiltros.some(clave => {
				if (!filtros[clave].length) {
					return true;
				}
				return filtros[clave].includes(dia[clave]);
			});
		});
	}

	public static generarHorarios(stepMin, min, max) {
		const mDt = new Date(min);
		const rc = [];
		while (mDt.getTime() <= max) {
			rc.push(new Date(mDt.getTime()));
			mDt.setMinutes(mDt.getMinutes() + stepMin);
		}
		return rc;
	}

	public static obtenerDiasHorarios(horarios) {
		return Array.from(new Set(horarios.map((dia => this.obtenerDiaNum(dia.nombre)))));
	}
}
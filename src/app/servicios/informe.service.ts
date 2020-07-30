import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Horario } from '../clases/horario';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class InformeService {
	public db = firebase.firestore();
	public sub = [];
	constructor(private firestore: AngularFirestore) { }

	guardarLogUsuario(usuario) {
		this.db.collection('logs_usuarios').add({
			fecha: Date.now(),
			usuario: usuario.email,
			rol: usuario.rol
		});
	}

	guardarLogOperaciones(turno, operacion) {
		this.db.collection('logs_operaciones').add({
			fecha: Date.now(),
			profesional: turno.profesional,
			especialidad: turno.especialidad,
			operacion: operacion
		});
	}

	traerLogsUsuario() {
		return this.db.collection('logs_usuarios').get();
	}

	traerLogsOperaciones() {
		return this.db.collection('logs_operaciones').get();
	}

	primerLoginFecha(listaLogs, usuario) {
		return listaLogs.find(log => log.usuario === usuario).fecha;
	}

	async informeProfesionalesInicioSesion(desde, hasta) {
		let data: Array<any> = [];
		await this.db.collection('logs_usuarios').where('rol', '==', 'Profesional').get().then(value => {
			data = value.docs.map(doc => {return { ...doc.data() };}).filter(doc => (doc.fecha >= desde && doc.fecha <= hasta));
		});
		data.sort((x, y) => {
			return x.fecha - y.fecha;
		});
		console.log(data);
		let result: Array<any> = Array.from(new Set(data.map((x => x.usuario))));
		let final: any = [];
		result.forEach(usuario => {
			let name = usuario;
			let dataAux: Array<any> = [];
			data.forEach(doc => {
				if (doc.usuario === usuario) {
					let x: Array<any> = [usuario, doc.fecha];
					dataAux.push(x);
				}
			});
			let y: any = { name: name, data: dataAux };
			final.push(y);
		});
		return final;
	}

	async informeProfesionalOperacionesEspecialidad() {
		let data: Array<any> = [];
		await this.db.collection('logs_operaciones').get().then(value => {
			data = value.docs.map(doc => {return { ...doc.data() as Object };});
		});
		console.log(data);
		let especialidades: Array<any> = Array.from(new Set(data.map((x => x.especialidad))));
		let final: Array<any> = [];
		especialidades.forEach(especialidad => {
			let name = especialidad;
			let dataAux: Array<any> = [] = data.reduce((arr, obj) => {
				if (obj.especialidad === especialidad) {
					let found = arr.findIndex(element => element[0] === obj.profesional);
					if (found !== -1) {
						arr[found][1]++;
					} else {
						arr.push([obj.profesional, 1]);
					}
				}
				return arr;
			}, []);

			final.push({ name: name, data: dataAux });
		});
		return final;
	}

	async informeTurnosPorDiaDeSemana() {
		let data: Array<any> = [];
		await this.db.collection('turnos').get().then(value => {
			data = value.docs.map(doc => {return { ...doc.data() as Object }});
		});
		let final: Array<any> = [];
		let dataAux: Array<any> = [] = data.reduce((arr, obj) => {
			let fecha = new Date(obj.fecha);
			let dia = Horario.obtenerDiaString(fecha.getDay());
			let found = arr.findIndex(element => element[0] === dia);
			if (found !== -1) {
				arr[found][1]++;
			} else {
				arr.push([dia, 1]);
			}
			return arr;
		}, []);
		final.push({ name: 'Turnos', data: dataAux });
		return final;
	}

	async informeTurnosDadosEnTiempo(desde, hasta) {
		let data: Array<any> = [];
		await this.db.collection('logs_operaciones').where('operacion', '==', 'Aceptar').get().then(value => {
			data = value.docs.map(doc => {return { ...doc.data() };}).filter(doc => (doc.fecha >= desde && doc.fecha <= hasta));
		});
		let final: Array<any> = [];
		let dataAux: Array<any> = [] = data.reduce((arr, obj) => {
			let found = arr.findIndex(element => element[0] === obj.profesional);
			if (found !== -1) {
				arr[found][1]++;
			} else {
				arr.push([obj.profesional, 1]);
			}
			return arr;
		}, []);
		final.push({ name: 'Turnos', data: dataAux });
		return final;
	}

	async informeTotalVisitas() {
		let data:Array<any> = [];
		await this.traerLogsUsuario().then(value => {
			data = value.docs.map(doc => {return { ...doc.data() as Object }});
		});
		let primerLog = data[0].fecha;
		let ultimoLog = data.reverse()[0].fecha
		let proyeccion:Array<any> = [];
		do {
			proyeccion.push([primerLog, data.filter(x => x.fecha <= primerLog).length]);
			if ((primerLog += (24 * 60 * 60 * 1000)) >= ultimoLog) {
				proyeccion.push([primerLog, data.filter(x => x.fecha <= primerLog).length]);
			} else {
				primerLog += (24 * 60 * 60 * 1000);
			}
		} while (primerLog <= ultimoLog);

		return [{ name: 'Visitas', data: proyeccion }];

	}

	async informeProfesionalDiasTrabajados(desde, hasta) {
		let dataLogs: Array<any> = [];
		let dataProfesionales: Array<any> = [];
		await this.db.collection('logs_usuarios').where('rol', '==', 'Profesional').get().then(value => {
			dataLogs = value.docs.map(doc => { return { ...doc.data() as Object }; });
		});
		await this.db.collection('usuarios').where('rol', '==', 'Profesional').get().then(value => {
			dataProfesionales = value.docs.map(doc => { return { ...doc.data() as Object }; });
		});
		let final: Array<any> = [];
		let dataAux: Array<any> = [];
		let profesionales: Array<any> = Array.from(new Set(dataProfesionales.map((x => x.email))));
		profesionales.forEach(profesional => {
			let primerLog = this.primerLoginFecha(dataLogs, profesional);
			if (desde < primerLog) {
				desde = primerLog;
			}
			let profesionalAux = dataProfesionales.find(prof => prof.email === profesional);
			let CantDias: number = Horario.obtenerProyeccionDiasRango(profesionalAux, desde, hasta).length;
			dataAux.push([profesional, CantDias]);
		});
		final.push({ name: 'Dias', data: dataAux });
		return final;
	}

	async informeTurnosPaciente(paciente) {
		let data: Array<any> = [];
		await this.db.collection('turnos').where('paciente', '==', paciente.email).get().then(value => {
			data = value.docs.map(doc => { return { ...doc.data() as Object }; });
		});
		let estados: Array<any> = ['Pendiente', 'Aceptado', 'Preparado', 'Resuelto', 'Cancelado'];
		let final: Array<any> = [];
		let dataAux: Array<any> = [];
		estados.forEach(estado => {
			dataAux.push([estado, data.filter(turno => turno.estado === estado)]);
		});
		final.push({ name: 'Turnos', data: dataAux });
		return final;
	}
	graficoTurnosPaciente(algo: any) {
		algo[0].data = algo[0].data.map(estado => {
			estado[1] = estado[1].length;
			return estado;
		});
		return algo;
	}

	async informeCantPacientesAtendidosPorEspecialidades() {
		let data: Array<any> = [];
		await this.db.collection('turnos').get().then(value => {
			data = value.docs.map(doc => { return { ...doc.data() as Object }; });
		});
		let final: Array<any> = [];
		let dataAux: Array<any> = [];
		let especialidades: Array<any> = Array.from(new Set(data.map((x => x.especialidad))));
		especialidades.forEach(especialidad => {
			dataAux.push([especialidad, data.filter(turno => turno.especialidad === especialidad).length]);
		})
		final.push({ name: 'Turnos', data: dataAux });
		return final;
	}

	async informeProfesionalEspecialidad() {
		let data: Array<any> = [];
		await this.db.collection('usuarios').where('rol', '==', 'Profesional').get().then(value => {
			data = value.docs.map(doc => { return { ...doc.data() as Object }; });
		});
		let final: Array<any> = [];
		let especialidades: Array<any> = [];
		data.forEach(profesional => {
			profesional.especialidades.forEach(esp => {
				let index = especialidades.findIndex(x => x[0] === esp.nombre);
				if (index === -1) {
					especialidades.push([esp.nombre, 1]);
				} else {
					especialidades[index][1]++;
				}
			});
		});
		final.push({ name: 'Turnos', data: especialidades });
		return final;
	}

	async informeRespuestasEncuesta() {
		let data: Array<any> = [];
		await this.db.collection('encuestas').get().then(value => {
			data = value.docs.map(doc => { return { ...doc.data() as Object }; });
		});
		let final: Array<any> = [
			{ name: 'Si', data: [['primera vez', 0], ['comportamiento inadecuado', 0], ['area de trabajo descuidada', 0], ['diagnostico impreciso', 0]] },
			{ name: 'No', data: [['primera vez', 0], ['comportamiento inadecuado', 0], ['area de trabajo descuidada', 0], ['diagnostico impreciso', 0]] },
			{ name: 'Muy Baja', data: [['volveria a pedir turno con el profesional', 0]] }, { name: 'Baja', data: [['volveria a pedir turno con el profesional', 0]] },
			{ name: 'Intermedia', data: [['volveria a pedir turno con el profesional', 0]] }, { name: 'Alta', data: [['volveria a pedir turno con el profesional', 0]] },
			{ name: 'Muy Alta', data: [['volveria a pedir turno con el profesional', 0]] }, { name: '1/5', data: [['calificacion general', 0]] }, { name: '2/5', data: [['calificacion general', 0]] },
			{ name: '3/5', data: [['calificacion general', 0]] }, { name: '4/5', data: [['calificacion general', 0]] }, { name: '5/5', data: [['calificacion general', 0]] },
		];
		data.forEach(enc => {
			if (enc.primeraVez === 'Si') { final[0].data[0][1]++; } else { final[1].data[0][1]++; }
			if (enc.profesionalInadecuado === 'Si') { final[0].data[1][1]++; } else { final[1].data[1][1]++; }
			if (enc.profesionalSucio === 'Si') { final[0].data[2][1]++; } else { final[1].data[2][1]++; }
			if (enc.profesionalImpreciso === 'Si') { final[0].data[3][1]++; } else { final[1].data[3][1]++; }
			switch (enc.probabilidadDeOtroTurno) {
				case 'Muy Baja':
					final[2].data[0][1]++;
					break;
				case 'Baja':
					final[3].data[0][1]++;
					break;
				case 'Intermedia':
					final[4].data[0][1]++;
					break;
				case 'Alta':
					final[5].data[0][1]++;
					break;
				case 'Muy Alta':
					final[6].data[0][1]++;
					break;
			}
			switch (enc.calificacionGeneral) {
				case '1/5':
					final[7].data[0][1]++;
					break;
				case '2/5':
					final[8].data[0][1]++;
					break;
				case '3/5':
					final[9].data[0][1]++;
					break;
				case '4/5':
					final[10].data[0][1]++;
					break;
				case '5/5':
					final[11].data[0][1]++;
					break;
			}
		});
		return final;
	}
}

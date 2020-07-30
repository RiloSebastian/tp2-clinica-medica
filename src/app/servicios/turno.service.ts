import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class TurnoService {
	public db = firebase.firestore();
	public sub = []
	constructor(private firestore: AngularFirestore) { }

	guardarTurno(data) {
		return this.db.collection('turnos').add({
			fecha: parseInt(data.horarioI),
			especialidad: data.especialidadI,
			paciente: data.paciente,
			profesional: data.profesional,
			nombrePaciente: data.nombrePaciente,
			nombreProfesional: data.nombreProfesional,
			estado: 'Pendiente',
			reseniaPaciente: false
		});
	}

	getTurnos() {
		return this.db.collection('turnos').get();
	}

	getTurnosPaciente(usuario) {
		return this.firestore.collection('turnos', ref => ref.where('paciente', '==', usuario).orderBy('fecha', 'asc')).snapshotChanges();
	}

	getTurnosProfesional(usuario) {
		return this.firestore.collection('turnos', ref => ref.where('profesional', '==', usuario).orderBy('fecha', 'asc')).snapshotChanges();
	}

	getTurnosAdministrador() {
		return this.firestore.collection('turnos', ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
	}

	actualizarEstado(listaTurnos): Observable<boolean> {
		return Observable.create(observer => {
			this.comparar(listaTurnos);
			observer.next(true);
			setInterval(() => {
				this.comparar(listaTurnos);
				observer.next(true);
			}, 10 * 1000);
		});
	}

	comparar(listaTurnos) {
		let ahora = new Date().setSeconds(0, 0);
		for (let turno of listaTurnos) {
			if (ahora >= turno.fecha && ahora < (turno.fecha + (30 * 60 * 1000)) && turno.estado === 'Aceptado') {
				this.cambiarEstado(turno.id, 'Preparado');
			} else if (ahora >= (turno.fecha + (30 * 60 * 1000)) && (turno.estado !== 'Cancelado' && turno.estado !== 'Resuelto')) {
				this.cambiarEstado(turno.id, 'Cancelado');
			}
		}
	}

	async cambiarEstado(id, estado) {
		await this.db.collection('turnos').doc(id).set({
			estado: estado
		}, { merge: true });
	}

	async guardarResenia(id) {
		await this.db.collection('turnos').doc(id).set({
			reseniaPaciente: true
		}, { merge: true });
	}
}
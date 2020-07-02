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

	guardarTurno(data){
		this.db.collection('turnos').add({
			paciente: data.paciente,
			profesional: data.profesional,
			especialidad: data.especialidadI,
			fecha: parseInt(data.horarioI),
			estado: 'Pendiente'
		});
	}

	getTurnos(){
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
			setInterval(() => {
				this.comparar(listaTurnos);
				observer.next(true);
			}, 10 * 60000);
		});
	}

	comparar(listaTurnos) {
		let ahora = Date.now();
		for (let turno of listaTurnos) {
			if ((turno.fecha) < (ahora + (15 * 60000)) && (turno.fecha) >= ahora && turno.estado === 'Aceptado') {
				this.cambiarEstado(turno.id, 'Preparado');
			} else if ((turno.fecha) < (ahora + (15 * 60000)) && (turno.estado !== 'Cancelado' && turno.estado !== 'Resuelto')) {
				this.cambiarEstado(turno.id, 'Cancelado');
			}
		}
	}

	async cambiarEstado(id, estado) {
		await this.db.collection('turnos').doc(id).set({
			estado: estado
		}, { merge: true });
	}
}
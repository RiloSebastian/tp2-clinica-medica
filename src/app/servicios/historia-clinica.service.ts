import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class HistoriaClinicaService {
	public db = firebase.firestore();
	constructor(private firestore: AngularFirestore) { }

	guardarHistoria(datos) {
		this.db.collection('historias').doc(datos.idTurno).set({
			id: datos.idTurno,
			fecha: datos.fechaTurno,
			paciente: datos.paciente,
			profesional: datos.profesional,
			especialidad: datos.especialidad,
			nombrePa: datos.nombrePa,
			edadPa: datos.edadPa,
			temperaturaPa: datos.temperaturaPa,
			precionPa: datos.precionPa,
			detallePa: datos.detallePa,
			reseñaPa: false
		}).then(() => {
			datos.atributosDinamicos.forEach(dato => {
				this.agregarCampoDin(datos.idTurno, dato[0], dato[1]);
			})
		});
	}

	async agregarCampoDin(idhistoria, campo, valor) {
		await this.db.collection('historias').doc(idhistoria).set({
			[campo]: valor
		}, { merge: true });
	}

	public traerUno(id) {
		return this.db.collection('historias').doc(id).get();
	}

	public traerTodos() {
		return this.firestore.collection('turnos', ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
	}

	public traerProfesionales(usuario) {
		return this.firestore.collection('turnos', ref => ref.where('profesional', '==', usuario).orderBy('fecha', 'asc')).snapshotChanges();
	}

	public traerPacientes(usuario) {
		return this.firestore.collection('turnos', ref => ref.where('paciente', '==', usuario).orderBy('fecha', 'asc')).snapshotChanges();
	}

	async guardarReseña(id,reseña){
		await this.db.collection('historias').doc(id).set({
			reseña: reseña,
			reseñaPa: true
		}, { merge: true });
	}

}

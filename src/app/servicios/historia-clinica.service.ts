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
		return this.db.collection('historias').doc(datos.id).set({
			id: datos.id,
			fecha: datos.fecha,
			paciente: datos.paciente,
			profesional: datos.profesional,
			especialidad: datos.especialidad,
			nombrePaciente: datos.nombrePaciente,
			nombreProfesional: datos.nombreProfesional,
			edadPaciente: datos.edadPaciente,
			temperaturaPaciente: datos.temperaturaPaciente,
			presionPaciente: datos.presionPaciente,
			detallePaciente: datos.detallePaciente,
		}).then(() => {
			if (datos.atributosDinamicos !== null && datos.atributosDinamicos.length > 0) {
				this.db.collection('historias').doc(datos.id).set({
					datosDinamicos: datos.atributosDinamicos,
				}, { merge: true });
			}
		});
	}

	public traerUno(id) {
		return this.db.collection('historias').doc(id).get();
	}

	public traerTodos() {
		return this.firestore.collection('historias', ref => ref.orderBy('fecha', 'asc')).snapshotChanges();
	}

	public traerProfesionales(usuario) {
		return this.firestore.collection('historias', ref => ref.where('profesional', '==', usuario).orderBy('fecha', 'asc')).snapshotChanges();
	}

	public traerPacientes(usuario) {
		return this.firestore.collection('historias', ref => ref.where('paciente', '==', usuario).orderBy('fecha', 'asc')).snapshotChanges();
	}

}

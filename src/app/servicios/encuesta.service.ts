import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class EncuestaService {
	public db = firebase.firestore();
	constructor(private firestore: AngularFirestore) { }

	guardarEncuesta(datos) {
		return this.db.collection('encuestas').doc(datos.id).set({
			fecha: datos.fecha,
			paciente: datos.paciente,
			profesional: datos.profesional,
			nombrePaciente: datos.nombrePaciente,
			nombreProfesional: datos.nombreProfesional,
			primeraVez: datos.primeraVez,
			profesionalInadecuado: datos.profesionalInadecuado,
			profesionalSucio: datos.profesionalSucio,
			profesionalImpreciso: datos.profesionalImpreciso,
			probabilidadDeOtroTurno: datos.probabilidadDeOtroTurno,
			calificacionGeneral: datos.calificacionGeneral,
			conclusionesFinales: datos.conclusionesFinales
		});
	}

	public traerUno(id) {
		return this.db.collection('encuestas').doc(id).get();
	}

	public traerTodos() {
		return this.firestore.collection('encuestas').snapshotChanges();
	}

	public traerProfesionales(usuario) {
		return this.firestore.collection('encuestas', ref => ref.where('profesional', '==', usuario)).snapshotChanges();
	}

	public traerPacientes(usuario) {
		return this.firestore.collection('encuestas', ref => ref.where('paciente', '==', usuario)).snapshotChanges();
	}


}



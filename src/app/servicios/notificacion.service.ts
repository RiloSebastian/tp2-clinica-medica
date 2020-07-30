import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class NotificacionService {
	public db = firebase.firestore();
	public sub = [];
	constructor(private firestore: AngularFirestore) { }

	guardarNotificacion(datosMensaje) {
		return this.db.collection('notificaciones').add({
			remitente: datosMensaje.remitente,
			destinatario: datosMensaje.destinatario,
			nombreRemitente: datosMensaje.nombreRemitente,
			nombreDestinatario: datosMensaje.nombreDestinatario,
			fecha: Date.now(),
			asunto: datosMensaje.asunto,
			referencia: datosMensaje.referencia,
			leido: false
		}).then((refer) => {
			if (datosMensaje.asunto === 'Cancelado') {
				this.db.collection('notificaciones').doc(refer.id).set({
					motivo: datosMensaje.motivo,
				}, { merge: true });
			}
		});
	}

	contarNotificacionesNoLeidas(usuario) {
		return this.firestore.collection('notificaciones', ref => ref.where('leido', '==', false).where('destinatario','==',usuario)).snapshotChanges();

	}

	traerNotificacionesProfesional(email) {
		return this.firestore.collection('notificaciones', ref => ref.where('destinatario', '==', email)).snapshotChanges();
	}

	traerNotificacionesPaciente(email) {
		return this.firestore.collection('notificaciones', ref => ref.where('destinatario', '==', email)).snapshotChanges();
	}

	traerNotificacionesTodos() {
		return this.firestore.collection('notificaciones').snapshotChanges();
	}

	actualizarNotificacion(id, campo, valor) {
		this.firestore.collection('notificaciones').doc(id).set({
			[campo]: valor
		}, { merge: true });
	}
}

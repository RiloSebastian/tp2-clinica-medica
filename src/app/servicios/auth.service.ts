import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public userProfile: any = {};
	public user: any = JSON.parse(localStorage.getItem('user'));
	public db = firebase.firestore();

	constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage, private firestore: AngularFirestore) {
		this.afAuth.onAuthStateChanged(user => {
			if (user != null) {
				localStorage.setItem("user", JSON.stringify(user));
			} else {
				localStorage.setItem("user", null);
			}
		});
	}

	public getUsuario(uid) {
		return this.db.collection('usuarios').doc(uid).get();
	}

	async login(dataLogin) {
		let promesa = new Promise((resolve, reject) => {
			this.afAuth.signInWithEmailAndPassword(dataLogin.email, dataLogin.pass).then(user => {
				localStorage.setItem("user", JSON.stringify(user.user));
				this.getUsuario(user.user.uid).then((usuario) => {
					this.userProfile = usuario.data();
					if(this.userProfile.rol === 'Admin'){
						resolve();
					} else if (user.user.emailVerified && this.userProfile.rol === 'Paciente') {
						this.db.collection('usuarios').doc(user.user.uid).update({
							habilitado: 'Si'
						});
						resolve();
					} else if (this.userProfile.rol === 'Profesional' && this.userProfile.habilitado === 'Si') {
						resolve();
					}
					else {
						this.logout();
						reject('el usuario no esta verificado. Compruebe su correo o de lo contrario espere que lo habilite un administrador');
					}
				});
			}).catch(error => {
				reject(error.code);
			});
		});
		return promesa;
	}

	async register(dataRegistro) {
		return this.afAuth.createUserWithEmailAndPassword(dataRegistro.email, dataRegistro.pass).then(data => {
			this.db.collection('usuarios').doc(data.user.uid).set({
				uid: data.user.uid,
				email: data.user.email,
				nombre: dataRegistro.nombre,
				apellido: dataRegistro.apellido,
				nacimiento: dataRegistro.nacimiento,
				dni: dataRegistro.dni,
				sexo: dataRegistro.sexo,
				rol: dataRegistro.rol,
				habilitado: 'No'
			}).then(() => {
				if (dataRegistro.rol === 'Paciente') {
					data.user.sendEmailVerification();
				} else if (dataRegistro.rol === 'Profesional') {
					this.db.collection('usuarios').doc(data.user.uid).set({
						especialidades: dataRegistro.especialidades,
						horarios: dataRegistro.horarios,
					}, { merge: true });
				}
			}).then(() => {
				let im1 = dataRegistro.img1.name;
				let im2 = dataRegistro.img2.name;
				let extension1 = im1.split('.').reverse();
				let extension2 = im2.split('.').reverse();
				im1 = 'foto_perfil/' + dataRegistro.email + '_1.' + extension1[0];
				im2 = 'foto_perfil/' + dataRegistro.email + '_2.' + extension2[0];
				this.subirArchivo(im1, dataRegistro.img1, 'imagen1', data.user.uid).then(() => {
					this.subirArchivo(im2, dataRegistro.img2, 'imagen2', data.user.uid).then(() => {
						localStorage.setItem("user", JSON.stringify(data.user));
						this.logout();
					});
				});
			});
		});
	}

	async logout() {
		await this.afAuth.signOut();
		localStorage.removeItem("user");
	}

	public get isLoggedIn(): boolean {
		const user = JSON.parse(localStorage.getItem('user'));
		return user !== null;
	}

	async subirArchivo(nombreArchivo: string, datos: any, nombreCampo: string, uid) {
		return await this.storage.upload(nombreArchivo, datos).then(imagen => {
			imagen.ref.getDownloadURL().then(data => {
				this.db.collection('usuarios').doc(uid).set({
					[nombreCampo]: data,
				}, { merge: true });
			});
		});
	}

}
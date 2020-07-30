import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { InformeService } from './informe.service';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public userProfile: BehaviorSubject<any> = new BehaviorSubject(null);
	public db = firebase.firestore();
	public config = environment.firebaseConfig;
	public secondaryApp: any = null;

	constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage
		, private firestore: AngularFirestore, private informe: InformeService) {
		this.afAuth.onAuthStateChanged(user => {
			if (user != null) {
				this.getUsuario(user.uid).then(value => {
					if (value.data().habilitado === 'Si') {
						this.userProfile.next(value.data());
						localStorage.setItem("user", JSON.stringify(user));
					} else {
						this.logout();
					}
				});
			} else {
				localStorage.setItem("user", null);
				this.userProfile.next(null);
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
					if (usuario.data().rol === 'Admin') {
						this.informe.guardarLogUsuario(usuario.data());
						resolve();
					} else if (user.user.emailVerified && usuario.data().rol === 'Paciente') {
						this.db.collection('usuarios').doc(user.user.uid).update({
							habilitado: 'Si'
						});
						this.informe.guardarLogUsuario(usuario.data());
						resolve();
					} else if (usuario.data().rol === 'Profesional' && usuario.data().habilitado === 'Si') {
						this.informe.guardarLogUsuario(usuario.data());
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
		return await this.afAuth.createUserWithEmailAndPassword(dataRegistro.email, dataRegistro.pass).then(data => {
			this.db.collection('usuarios').doc(data.user.uid).set({
				uid: data.user.uid,
				email: data.user.email,
				nombre: dataRegistro.nombre,
				apellido: dataRegistro.apellido,
				nacimiento: dataRegistro.nacimiento,
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
				let im1 = dataRegistro.img1.name;
				let im2 = dataRegistro.img2.name;
				let extension1 = im1.split('.').reverse();
				let extension2 = im2.split('.').reverse();
				im1 = 'foto_perfil/' + dataRegistro.email + '_1.' + extension1[0];
				im2 = 'foto_perfil/' + dataRegistro.email + '_2.' + extension2[0];
				this.subirArchivo(im1, dataRegistro.img1, 'imagen1', data.user.uid).then(() => {
					this.subirArchivo(im2, dataRegistro.img2, 'imagen2', data.user.uid);
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
		if (user === null || user === undefined) {
			return false;
		}
		return true;
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

	registerAdmin(dataRegistro, pass) {
		this.secondaryApp = firebase.initializeApp(this.config, "Secondary");
		return this.secondaryApp.auth().createUserWithEmailAndPassword(dataRegistro.email, pass).then((data) => {
			this.firestore.collection('usuarios').doc(data.user.uid).set({
				uid: data.user.uid,
				email: dataRegistro.email,
				rol: dataRegistro.rol,
				habilitado: 'Si'
			});
		}).then(firebaseUser => {
			this.secondaryApp.auth().signOut();
		}).then(() => {
			this.secondaryApp.delete();
		});
	}

}
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class UsuarioService {
	public db = firebase.firestore();

	constructor() { }

	public traerUno(email){
		return this.db.collection('usuarios').where('email','==',email).get();
	}

	public traerTodos(){
		return this.db.collection('usuarios').get();
	}

	public traerProfesionales(){
		return this.db.collection('usuarios').where('rol','==','Profesional').get();
	}

	public traerPacientes(){
		return this.db.collection('usuarios').where('rol','==','Paciente').get();
	}

	public actualizarUsuario(usuario){
		let si = false;
		this.db.collection('usuarios').doc(usuario.uid).update(usuario).then(()=>{
			si = true;
		})
		console.log(si);
		return si;
	}
}

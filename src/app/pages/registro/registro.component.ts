import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ESPECIALIDADES } from '../../mocks/especialidades-mock';

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	public registroForm = new FormGroup({
		email: new FormControl('', Validators.required),
		pass: new FormControl('', Validators.required),
		nombre: new FormControl('', Validators.required),
		apellido: new FormControl('', Validators.required),
		sexo: new FormControl('Femenino'),
		rol: new FormControl('', Validators.required),
		nacimiento: new FormControl('', Validators.required),
		especialidades: new FormControl([],Validators.required),
		horarios: new FormControl([],Validators.required),
		img1: new FormControl(''),
		img2: new FormControl(''),
		captcha: new FormControl(null, Validators.required),
	});
	public cantImagenes = -1;
	public nuevaEspecialidad = false;
	public cambiarEspecialidad = false;
	public espMock = ESPECIALIDADES;
	public especialidadItem = {};
	public auxEspecialidades = [];
	public nEspecialidad = 'CARDIOLOGÍA';
	public iEspecialidad = 30;
	public nuevoHorario = false;
	public auxHorarios = [];
	public error = false;
	public mensajeError: string = '';
	public submit = false;

	constructor(private auth: AuthService, public router: Router) {
	}
	ngOnInit(): void {
	}

	fechaHoy() {
		var today: any = new Date();
		var dd: any = today.getDate();
		var mm: any = today.getMonth() + 1;
		var yyyy: any = today.getFullYear() - 18;
		if (dd < 10) {
			dd = '0' + dd.toString();
		}
		if (mm < 10) {
			mm = '0' + mm.toString();
		}
		today = yyyy + '-' + mm + '-' + dd;
		return today;
	}

	agregarImagenes(imagenes) {
		console.log(imagenes);
		if (imagenes.length == 2) {
			this.registroForm.patchValue({
				img1: imagenes[0],
				img2: imagenes[1]
			});
		}
		this.cantImagenes = imagenes.length;
	}

	agregarEspecialidad() {
		if (this.nEspecialidad !== null) {
		this.especialidadItem['nombre'] = this.nEspecialidad
		this.especialidadItem['duracion'] = this.iEspecialidad;
		this.auxEspecialidades.push(this.especialidadItem);
		this.espMock.splice(this.espMock.indexOf(this.nEspecialidad),1);
		console.log(this.espMock.indexOf(this.nEspecialidad));
		this.registroForm.controls.especialidades.setValue(this.auxEspecialidades);
		this.especialidadItem = {};
		this.nEspecialidad = null;
		this.iEspecialidad = 30;
		this.nuevaEspecialidad = false;
		this.cambiarEspecialidad = false;
	}
	}

	editarEspecialidad(especialidadAux: any) {
		this.nuevaEspecialidad = true;
		this.cambiarEspecialidad = true;
		this.espMock.push(especialidadAux['nombre']);
		this.espMock.sort();
		this.nEspecialidad = especialidadAux['nombre'];
		this.iEspecialidad = especialidadAux['duracion'];
		let index = this.auxEspecialidades.findIndex(x1 => x1['nombre'] === especialidadAux['nombre'] && x1['duracion'] === especialidadAux['duracion']);
		this.auxEspecialidades.splice(index, 1);
		this.registroForm.controls.especialidades.setValue(this.auxEspecialidades);
	}

	public tryRegister(registro) {
		if(registro.value.rol === 'Paciente'){
			this.registroForm.controls.especialidades.setErrors(null);
			this.registroForm.controls.horarios.setErrors(null);
		}
		if (registro.status === 'VALID') {
			this.submit = true;
			this.auth.register(registro.value).then(() => {
				this.error = false;
				console.log(this.auth.isLoggedIn);
				this.router.navigate([""]);
			}).catch(err => {
				this.submit = false;
				switch (err.code) {
					case "auth/email-already-in-use":
						this.mensajeError = 'el email ya esta en uso por otro usuario';
						break;
					case "auth/invalid-email":
						this.mensajeError = 'el email no tiene un formato valido';
						break;
					case "auth/weak-password":
						this.mensajeError = 'la contraseña no es fuerte';
						break;
					case "auth/argument-error":
						this.mensajeError = 'el email o la contraseña no tienen un formato valido';
						break;
					default:
						this.mensajeError = err;
						break;
				}
				this.error = true;
				setTimeout(() => {
					this.error = false;
				}, 5000);
			});
		}
	};

	public change(valor: string) {
		this.registroForm.value.sexo = valor;
	}

}

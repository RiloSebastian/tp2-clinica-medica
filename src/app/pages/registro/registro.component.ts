import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	public console = console;
	public registroForm = new FormGroup({
		email: new FormControl('', Validators.required),
		pass: new FormControl('', Validators.required),
		nombre: new FormControl('', Validators.required),
		apellido: new FormControl('', Validators.required),
		dni: new FormControl('', Validators.required),
		sexo: new FormControl('Femenino'),
		rol: new FormControl('', Validators.required),
		nacimiento: new FormControl('', Validators.required),
		especialidades: new FormControl([], Validators.minLength(1)),
		horarios: new FormControl([], Validators.minLength(1)),
		img1: new FormControl(''),
		img2: new FormControl(''),
		captcha: new FormControl(null, Validators.required),
	});
	public cantImagenes = 2;
	public especialidadItem = '';
	public nuevaEspecialidad = false;
	public cambiarEspecialidad = false;
	public horarioItem = '';
	public nuevoHorario = false;
	public semana = [
		[false, 'Domingo', "00:00", "00:00"],
		[false, 'Lunes', "00:00", "00:00"],
		[false, 'Martes', "00:00", "00:00"],
		[false, 'Miercoles', "00:00", "00:00"],
		[false, 'Jueves', "00:00", "00:00"],
		[false, 'Viernes', "00:00", "00:00"],
		[false, 'Sabado', "00:00", "00:00"]
	];
	public error = false;
	public mensajeError: string = '';
	public submit = false;
	public unCaptcha = true;
	public hoy=this.fechaHoy();

	constructor(private auth: AuthService, public router: Router) {
	}
	ngOnInit(): void {
	}

	fechaHoy() {
		var today:any = new Date();
		var dd:any = today.getDate();
		var mm:any = today.getMonth() + 1;
		var yyyy:any  = today.getFullYear()-18;
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
		this.registroForm.value.especialidades.push(this.especialidadItem);
		this.especialidadItem = '';
		this.nuevaEspecialidad = false;
		this.cambiarEspecialidad = false;
		console.log(this.registroForm.value);
	}

	editarEspecialidad(especialidadAux){
		this.nuevaEspecialidad = true;
		this.cambiarEspecialidad = true;
		this.especialidadItem = especialidadAux;
		let index = this.registroForm.value.especialidades.indexOf(especialidadAux);
		this.registroForm.value.especialidades.splice(index,1);
	}

	generarHorario() {
		this.registroForm.value.horarios= [];
		let aux = []
		for(let dia of this.semana){
			if(dia[0] == true){
				aux.push(dia[1]+', desde las '+dia[2]+'hs hasta las '+dia[3]+'hs.');
			}
		}
		this.registroForm.value.horarios = aux;
		console.log(this.registroForm.value.horarios);
		this.nuevoHorario = false;
	}

	public tryRegister(value) {
		console.log(value);
		this.submit = true;
		this.auth.register(value).then(() => {
			this.error = false;
			this.router.navigate(["/"]);
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
	};

	checkValue(dia) {
		if (dia === true) {
			dia = false;
		} else {
			dia = true;
		}
	}

	captcha(captchaResponse: string) {
		console.log(`Resolved response token: ${captchaResponse}`);
		//res.getResponse(captchaResponse);
	}

	public change(valor: string) {
		this.registroForm.value.sexo = valor;
	}

}

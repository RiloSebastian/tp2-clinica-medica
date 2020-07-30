import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
	selector: 'app-alta-admin',
	templateUrl: './alta-admin.component.html',
	styleUrls: ['./alta-admin.component.css']
})
export class AltaAdminComponent implements OnInit {
	@ViewChild('ngForm', { static: false }) form: NgForm
	public registroForm: FormGroup = new FormGroup({
		email: new FormControl(null, Validators.required),
		pass: new FormControl(null, Validators.required),
		rol: new FormControl('Admin'),
		captcha: new FormControl(null, Validators.required)
	})
	public submit: boolean = false;
	public creado: any = null;
	public mensajeSubmit: String = '';
	constructor(private auth: AuthService) { }

	ngOnInit(): void {
	}

	registrarAdmin(admin: FormGroup) {
		this.submit = true;
		if (admin.valid) {
			this.auth.registerAdmin(admin.value, admin.value.pass).then(() => {
				this.submit = false;
				this.mensajeCreado(true,'el Administrador se pudo crear con exito!');
				this.resetearForm();
			}).catch(err => {
				let error = '';
				switch (err.code) {
					case "auth/email-already-in-use":
						error = 'el email ya esta en uso por otro usuario';
						break;
					case "auth/invalid-email":
						error = 'el email no tiene un formato valido';
						break;
					case "auth/weak-password":
						error = 'la contraseña no es fuerte';
						break;
					case "auth/argument-error":
						error = 'el email o la contraseña no tienen un formato valido';
						break;
					default:
						error = err;
						break;
				}
				this.mensajeCreado(false,error);
			});
		} else {
			this.mensajeCreado(false,'No se creo Correctamente el Administrador');
		}
	}

	resetearForm() {
		let captcha = this.registroForm.value.captcha;
		this.form.resetForm();
		this.submit = false;
		this.registroForm.reset({ rol: 'Admin', captcha:captcha });
	}

	mensajeCreado(valor:boolean, mensaje:String) {
		this.creado = valor;
		this.mensajeSubmit = mensaje
		setTimeout(() => {
			this.creado = null;
		}, 3500);
	}

}

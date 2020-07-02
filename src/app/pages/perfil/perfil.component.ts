import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

	public usuario:any={};
	public edad;
	public sub;
	constructor(public auth: AuthService) { }

	ngOnInit(): void {
		this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref=>{
			this.usuario = ref.data();
			this.edad = this.años();
		});
	}

	años(){
		let aux = new Date()
		let aux2 = new Date(this.usuario.nacimiento);
		return (aux.getFullYear() - aux2.getFullYear());
	}

}

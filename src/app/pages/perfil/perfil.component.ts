import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

	public usuario: any = null;
	public nuevoHorario = false;

	constructor(public auth: AuthService, public usuarios: UsuarioService) { }

	ngOnInit(): void {
		this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref=>{
			this.usuario = ref.data();
		});
	}

	guardarCambios(usuario){
		this.usuarios.actualizarUsuario(usuario);
	}

}

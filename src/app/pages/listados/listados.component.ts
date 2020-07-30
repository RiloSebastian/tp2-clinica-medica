import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
	selector: 'app-listados',
	templateUrl: './listados.component.html',
	styleUrls: ['./listados.component.css']
})
export class ListadosComponent implements OnInit {
	public yo: any = {};
	public panel = null;

	constructor(public auth: AuthService) {}
	ngOnInit(): void {
		this.inicializar();
	}

	async inicializar() {
		await this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref => {
			this.yo = ref.data();
		});
	}


}

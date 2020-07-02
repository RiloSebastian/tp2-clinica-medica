import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
	selector: 'app-listados',
	templateUrl: './listados.component.html',
	styleUrls: ['./listados.component.css']
})
export class ListadosComponent implements OnInit {

	public listado: Array<any>;
	public listadoAux: Array<any>;
	public yo:any ={};
	public fEstado='Todos';
	public fRol='Todos';
	public fEmail='';

	constructor(public auth: AuthService, public usuario: UsuarioService) {

	}

	ngOnInit(): void {
		this.inicializar();
	}

	async inicializar(){
		await this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref => {
			this.yo = ref.data();
			let snap = ref.data();
			this.traerLista(snap);
		});
	}

	public habilitarProfesional(profesional) {
		if (profesional.habilitado !== 'Si') {
			profesional.habilitado = 'Si';
			this.usuario.actualizarUsuario(profesional);
		}
	}

	async traerLista(yo) {
		if (yo.rol === 'Paciente') {
			await this.usuario.traerProfesionales().then(ref => {
				this.listado = ref.docs.map(doc => {
					return { ...doc.data() };
				});
			});
		} else if (yo.rol === 'Profesional') {
			await this.usuario.traerPacientes().then(ref => {
				this.listado = ref.docs.map(doc => {
					return { ...doc.data() };
				});
			});
		} else if (yo.rol === 'Admin') {
			await this.usuario.traerTodos().then(ref => {
				this.listado = ref.docs.map(doc => {
					return { ...doc.data() } as Object;
				});
			});
		}
		this.listadoAux = this.listado.map(u=>{
			return {...u};
		})
	}

	filtrarLista(){
		this.listadoAux = this.listado.map(u=>{
			return {...u};
		})
		if(this.fEstado !=='Todos'){
			this.listadoAux = this.listadoAux.filter(x => x.habilitado === this.fEstado);
		}
		if(this.fRol !=='Todos'){
			this.listadoAux = this.listadoAux.filter(x => x.rol === this.fRol);
		}
		if(this.fEmail !==''){
			this.listadoAux = this.listadoAux.filter(x => x.email.includes(this.fEmail));
		}
	}
}

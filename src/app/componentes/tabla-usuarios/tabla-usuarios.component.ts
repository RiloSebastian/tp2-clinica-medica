import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { ESPECIALIDADES } from '../../mocks/especialidades-mock';
import { Profesional } from '../../clases/profesional';

@Component({
	selector: 'app-tabla-usuarios',
	templateUrl: './tabla-usuarios.component.html',
	styleUrls: ['./tabla-usuarios.component.css']
})
export class TablaUsuariosComponent implements OnInit {
	@Input() usuario: any;
	public listado: Array<any> = null;
	public listadoAux: Array<any> = null;
	public yo: any = {};
	public fEstado = 'Todos';
	public fRol = 'Todos';
	public fEmail = '';

	public usuarioDetalle: any = {};
	public nuevaEspecialidad = false;
	public cambiarEspecialidad = false;
	public espMock: Array<any> = [];
	public especialidadItem = {};
	public nEspecialidad = 'CARDIOLOGÍA';
	public iEspecialidad = 30;

	constructor(public usuarios: UsuarioService) { }

	ngOnInit(): void {
		this.traerLista(this.usuario);
	}

	public habilitarProfesional(profesional) {
		if (profesional.habilitado !== 'Si') {
			profesional.habilitado = 'Si';
			this.usuarios.actualizarUsuario(profesional);
		}
	}

	async traerLista(yo) {
		if (yo.rol === 'Paciente') {
			await this.usuarios.traerProfesionales().then(ref => {
				this.listado = ref.docs.map(doc => {
					return { ...doc.data() as Object };
				});
			});

		} else if (yo.rol === 'Profesional') {
			await this.usuarios.traerPacientes().then(ref => {
				this.listado = ref.docs.map(doc => {
					return { ...doc.data() };
				});
			});
		} else if (yo.rol === 'Admin') {
			await this.usuarios.traerTodos().then(ref => {
				this.listado = ref.docs.map(doc => {
					return { ...doc.data() } as Object;
				});
			});
		}
		this.listadoAux = this.listado.map(u => {
			return { ...u };
		})
	}

	filtrarLista() {
		this.listadoAux = this.listado.map(u => {
			return { ...u };
		})
		if (this.fEstado !== 'Todos') {
			this.listadoAux = this.listadoAux.filter(x => x.habilitado === this.fEstado);
		}
		if (this.fRol !== 'Todos') {
			this.listadoAux = this.listadoAux.filter(x => x.rol === this.fRol);
		}
		if (this.fEmail !== '') {
			this.listadoAux = this.listadoAux.filter(x => x.email.includes(this.fEmail));
		}
	}

	verDetalle(usuario) {
		this.usuarioDetalle = [];
		this.usuarioDetalle = usuario;
		if (usuario.rol === 'Profesional') {
			this.espMock = ESPECIALIDADES.filter(especialidad => usuario.especialidades.findIndex(x => x.nombre === especialidad) === -1);
		}
	}

	agregarEspecialidad() {
		if (this.nEspecialidad !== null) {
			this.especialidadItem['nombre'] = this.nEspecialidad
			this.especialidadItem['duracion'] = this.iEspecialidad;
			this.usuarioDetalle.especialidades.push(this.especialidadItem);
			this.espMock.splice(this.espMock.indexOf(this.nEspecialidad), 1);
			this.usuarios.actualizarUsuario(this.usuarioDetalle)
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
		this.nEspecialidad = especialidadAux['nombre'];
		this.iEspecialidad = especialidadAux['duracion'];
		this.espMock.push(especialidadAux['nombre']);
		this.espMock.sort();
		let index = this.usuarioDetalle.especialidades.findIndex(x1 => x1['nombre'] === especialidadAux['nombre'] && x1['duracion'] === especialidadAux['duracion']);
		this.usuarioDetalle.especialidades.splice(index, 1);
		this.usuarios.actualizarUsuario(this.usuarioDetalle)
	}

}

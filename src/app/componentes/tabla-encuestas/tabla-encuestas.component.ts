import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { EncuestaService } from '../../servicios/encuesta.service';

@Component({
	selector: 'app-tabla-encuestas',
	templateUrl: './tabla-encuestas.component.html',
	styleUrls: ['./tabla-encuestas.component.css']
})
export class TablaEncuestasComponent implements OnInit, OnDestroy {
	@Input() usuario: any;
	public listado: Array<any> = null;
	public encuestaAux: any = {};
	public subL = null;
	constructor(public auth: AuthService, public encuestas: EncuestaService) {}

	ngOnInit(): void {
		this.traerLista(this.usuario);
	}

	async traerLista(usuario) {
		let data: any = {};
		if (usuario.rol === 'Paciente') {
			this.subL = await this.encuestas.traerPacientes(this.usuario.email).subscribe(snap => {
				this.listado = snap.map(ref => {
					data = ref.payload.doc.data();
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
			});
		} else if (usuario.rol === 'Profesional') {
			this.subL = await this.encuestas.traerProfesionales(this.usuario.email).subscribe(snap => {
				this.listado = snap.map(ref => {
					data = ref.payload.doc.data();
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
			});
		} else if (usuario.rol === 'Admin') {
			this.subL = await this.encuestas.traerTodos().subscribe(snap => {
				this.listado = snap.map(ref => {
					data = ref.payload.doc.data();
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
			});
		}
	}

	ngOnDestroy(): void {
		if (this.subL !== null) {
			this.subL.unsubscribe();
		}
	}

}

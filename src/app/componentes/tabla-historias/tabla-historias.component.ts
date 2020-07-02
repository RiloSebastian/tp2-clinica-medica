import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { HistoriaClinicaService } from '../../servicios/historia-clinica.service';

@Component({
	selector: 'app-tabla-historias',
	templateUrl: './tabla-historias.component.html',
	styleUrls: ['./tabla-historias.component.css']
})
export class TablaHistoriasComponent implements OnInit, OnDestroy {

	public listado: Array<any>;
	public listadoAux: Array<any>;
	public yo: any = {};
	public fEstado = 'Todos';
	public fRol = 'Todos';
	public fEmail = '';
	public subL;

	constructor(public auth: AuthService, public historia: HistoriaClinicaService) {

	}

	ngOnInit(): void {
		this.inicializar();
	}

	async inicializar() {
		await this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref => {
			this.yo = ref.data();
			let snap = ref.data();
			this.traerLista(snap);
		});
	}

	async traerLista(yo) {
		if (yo.rol === 'Paciente') {
			this.subL = await this.historia.traerPacientes(this.yo.email).subscribe(snap => {
				this.listado = snap.map(ref => {
					const data = ref.payload.doc.data() as Object;
					return { ...data }
				});
			});
		} else if (yo.rol === 'Profesional') {
			this.subL = await this.historia.traerProfesionales(this.yo.email).subscribe(snap => {
				this.listado = snap.map(ref => {
					const data = ref.payload.doc.data() as Object;
					return { ...data }
				});
			});
		} else if (yo.rol === 'Admin') {
			this.subL = await this.historia.traerTodos().subscribe(snap => {
				this.listado = snap.map(ref => {
					const data = ref.payload.doc.data() as Object;
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

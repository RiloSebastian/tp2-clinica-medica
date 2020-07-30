import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { HistoriaClinicaService } from '../../servicios/historia-clinica.service';

@Component({
	selector: 'app-tabla-historias',
	templateUrl: './tabla-historias.component.html',
	styleUrls: ['./tabla-historias.component.css']
})
export class TablaHistoriasComponent implements OnInit, OnDestroy {
	@Input() usuario: any;
	public listado: Array<any> = null;
	public historiaAux: any = {};
	public nuevoFiltro: any = null;
	arrayC: Array<any> = [
		{ nombre: 'Fecha', campo: 'fecha' },
		{ nombre: 'Nombre de Paciente', campo: 'nombrePaciente' },
		{ nombre: 'Nombre de Profesional', campo: 'nombreProfesional' },
		{ nombre: 'Email de Paciente', campo: 'paciente' },
		{ nombre: 'Email de Profesional', campo: 'profesional' },
		{ nombre: 'Especialidad', campo: 'especialidad' },
		{ nombre: 'Edad de Paciente', campo: 'edadPaciente' },
		{ nombre: 'Temperatura de Paciente', campo: 'temperaturaPaciente' },
		{ nombre: 'Presion de Paciente', campo: 'presionPaciente' },
		{ nombre: 'Otro', campo: 'otro' },
		{ nombre: 'Detalle', campo: 'detalle' }
	]
	arrayF: Array<any> = [];
	public subL = null;

	constructor(public auth: AuthService, public historia: HistoriaClinicaService) { }

	ngOnInit(): void {
		this.traerLista();
	}

	async traerLista() {
		this.desubscribir();
		let data: any = {};
		if (this.usuario.rol === 'Paciente') {
			this.subL = await this.historia.traerPacientes(this.usuario.email).subscribe(snap => {
				this.listado = snap.map(ref => {
					data = ref.payload.doc.data();
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
				this.filtrarLista();
			});
		} else if (this.usuario.rol === 'Profesional') {
			this.subL = await this.historia.traerProfesionales(this.usuario.email).subscribe(snap => {
				this.listado = snap.map(ref => {
					data = ref.payload.doc.data();
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
				this.filtrarLista();
			});
		} else if (this.usuario.rol === 'Admin') {
			this.subL = await this.historia.traerTodos().subscribe(snap => {
				this.listado = snap.map(ref => {
					data = ref.payload.doc.data();
					data['id'] = ref.payload.doc.id;
					return { ...data }
				});
				this.filtrarLista();
			});
		}
	}

	tieneFiltro(campo) {
		return this.arrayF.some(filtro => filtro.campo === campo);
	}

	agregarFiltro() {
		this.nuevoFiltro['valor'] = '';
		if(this.nuevoFiltro.nombre === 'Otro'){
			this.nuevoFiltro.campo = '';
		}
		this.arrayF.push(this.nuevoFiltro);
		this.nuevoFiltro = null;
	}

	borrarFiltro(index) {
		this.arrayF.splice(parseInt(index), 1);
	}

	filtrarLista() {
		if (this.arrayF.length > 0) {
			this.listado = this.listado.filter(elemento => {
				return this.arrayF.every(filtro => this.comparar(elemento, filtro.campo, filtro.valor));
			})
		}
	}

	comparar(elemento, campo, valor) {
		let resultado = false;
		if (elemento.hasOwnProperty(campo)) {
			if (campo === 'fecha') {
				let filtro = new Date(valor+' 00:00').getTime();
				let x = new Date(elemento[campo]).setHours(0, 0);
				console.log(valor);
				console.log(x);
				resultado = filtro === x;
			} else {
				if ((typeof elemento[campo]) === 'string') {
					resultado = elemento[campo].includes(valor);
				} else {
					resultado = elemento[campo] === parseInt(valor);
				}
			}
		} else if (elemento.datosDinamicos.findIndex(dato => dato.nombre === campo) !== -1) {
			let dato = elemento.datosDinamicos.find(dato => dato.nombre === campo);
			if((typeof dato.valor) === 'string'){
				resultado = dato.valor.includes(valor);
			} else{
				resultado = dato.valor === parseInt(valor);
			}
		}
		return resultado;
	}

	desubscribir() {
		if (this.subL !== null) {
			this.subL.unsubscribe();
		}
	}

	ngOnDestroy(): void {
		this.desubscribir();
	}
}

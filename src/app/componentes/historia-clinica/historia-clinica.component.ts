import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { TurnoService } from '../../servicios/turno.service';
import { HistoriaClinicaService } from '../../servicios/historia-clinica.service';
import { Turno } from '../../clases/turno';

@Component({
	selector: 'app-historia-clinica',
	templateUrl: './historia-clinica.component.html',
	styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
	@Input() usuario: any;
	@Input() turnoSeleccionado: any;

	public paciente:any = {};
	public edad=0;
	public historiaForm = new FormGroup({
		idTurno: new FormControl('', Validators.required),
		paciente: new FormControl('', Validators.required),
		profesional: new FormControl('', Validators.required),
		especialidad: new FormControl('', Validators.required),
		fechaTurno: new FormControl('', Validators.required),
		nombrePa: new FormControl('', Validators.required),
		edadPa: new FormControl('', Validators.required),
		temperaturaPa: new FormControl('', Validators.required),
		precionPa: new FormControl('', Validators.required),
		atributosDinamicos: new FormControl([], Validators.maxLength(3)),
		detallePa: new FormControl('', Validators.required),
	});
	public atributoDinItem = [];
	public atibutoDinAux = [];
	public claveAttr = '';
	public valorAttr = '';
	public nuevoAttr: boolean = false;
	public cambiarAttr: boolean = false;

	constructor(private usuarios: UsuarioService, private historias: HistoriaClinicaService,  private turnos: TurnoService) { }

	ngOnInit(): void {
		this.usuarios.traerUno(this.turnoSeleccionado.paciente).then( ref =>{
			this.paciente = ref.docs[0].data();
			this.edad = this.años()
		});
	}

	años(){
		let aux = new Date()
		let aux2 = new Date(this.paciente.nacimiento);
		return (aux.getFullYear() - aux2.getFullYear());
	}

	editarAttrDin(attrDinAux) {
		this.nuevoAttr = true;
		this.cambiarAttr = true;
		this.atributoDinItem = attrDinAux;
		let index = this.historiaForm.value.atributosDinamicos.findIndex( x1 => x1[0] === attrDinAux[0] && x1[1] === attrDinAux[1]);
		this.historiaForm.value.atributosDinamicos.splice(index,1);
	}

	agregarAttrDin() {
		this.atributoDinItem.push(this.claveAttr,this.valorAttr);
		this.historiaForm.value.atributosDinamicos.push(this.atributoDinItem);
		this.atributoDinItem =[];
		this.claveAttr = '';
		this.valorAttr = '';
		this.nuevoAttr = false;
		this.cambiarAttr = false;
		console.log(this.historiaForm.value);
	}

	guardarHistoria(value){
		this.historiaForm.value.edadPa = this.edad;
		this.historiaForm.value.nombrePa = this.paciente.apellido +' '+this.paciente.nombre;
		this.historiaForm.value.idTurno = this.turnoSeleccionado.id;
		this.historiaForm.value.especialidad = this.turnoSeleccionado.especialidad;
		this.historiaForm.value.paciente = this.turnoSeleccionado.paciente;
		this.historiaForm.value.profesional = this.turnoSeleccionado.profesional;
		this.historiaForm.value.fechaTurno = this.turnoSeleccionado.fecha;
		console.log(this.historiaForm.value);
		this.historias.guardarHistoria(value);
		this.turnos.cambiarEstado(this.turnoSeleccionado.id, 'Resuelto');
	}

}

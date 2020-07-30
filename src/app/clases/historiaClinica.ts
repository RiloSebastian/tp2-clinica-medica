import { Usuario } from './usuario';
import { Profesional } from './profesional';
import { Especialidad } from './especialidad';

export class HistoriaClinica {
	public id?:string;
	public fecha: number;
	public paciente: Usuario;
	public profesional:Profesional;
	public especialidad: Especialidad;
	public edadPaciente: number;
	public temperaturaPaciente: string;
	public presionPaciente: string;
	public atributosDinamicos: Array<any>;
	public detallePaciente:string;

	constructor(fecha: number,paciente: Usuario,profesional:Profesional,
		especialidad: Especialidad,edadPaciente: number,temperaturaPaciente: string,
		presionPaciente: string,atributosDinamicos: Array<any>,detallePaciente:string,id?:string) {
		this.id = id;
		this.fecha = fecha;
		this.paciente = paciente;
		this.profesional = profesional;
		this.especialidad = especialidad;
		this.edadPaciente = edadPaciente;
		this.temperaturaPaciente = temperaturaPaciente;
		this.presionPaciente = presionPaciente;
		this.atributosDinamicos = atributosDinamicos;
		this.detallePaciente = detallePaciente;
	}
}
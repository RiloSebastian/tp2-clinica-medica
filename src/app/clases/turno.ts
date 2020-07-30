import { Usuario } from './usuario';
import { Profesional } from './profesional';
import { Especialidad } from './especialidad';

export class Turno {
	public id?: string;
	public paciente: Usuario;
	public profesional: Profesional;
	public especialidad: Especialidad;
	public fecha: number;
	public estado: string;

	constructor(paciente: Usuario, profesional: Profesional, especialidad: Especialidad, fecha: number, estado: string, id: string) {
		this.id = id;
		this.paciente = paciente;
		this.profesional = profesional;
		this.especialidad = especialidad;
		this.fecha = fecha;
		this.estado = estado;
	}
}

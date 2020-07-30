import { Usuario } from './usuario';
import { Profesional } from './profesional';
import { Especialidad } from './especialidad';

export class Encuesta {
	public id?: string;
	public fecha: number;
	public paciente: Usuario;
	public profesional: Profesional;
	public primeraVez: string;
	public profesionalInadecuado: string;
	public profesionalSucio: string;
	public profesionalImpreciso: string;
	public probabilidadDeOtroTurno: string;
	public calificacionGeneral: string;
	public conclusionesFinales: string;
	
	constructor(fecha: number, paciente: Usuario, profesional: Profesional, primeraVez: string, profesionalInadecuado: string,
		profesionalSucio: string, profesionalImpreciso: string, probabilidadDeOtroTurno: string, calificacionGeneral: string,
		conclusionesFinales: string, id?: string) {
		this.id = id;
		this.fecha = fecha;
		this.paciente = paciente;
		this.profesional = profesional;
		this.primeraVez = primeraVez;
		this.profesionalInadecuado = profesionalInadecuado;
		this.profesionalSucio = profesionalSucio;
		this.profesionalImpreciso = profesionalImpreciso;
		this.probabilidadDeOtroTurno = probabilidadDeOtroTurno;
		this.calificacionGeneral = calificacionGeneral;
		this.conclusionesFinales = conclusionesFinales;
	}
}
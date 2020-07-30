import { Usuario } from './usuario';
import { Profesional } from './profesional';

export class Notificacion {
	public id?: string;
	public remitente: Usuario | Profesional;
	public destinatario: Usuario | Profesional;
	public fecha: number;
	public asunto: string;
	public motivo?: string;
	public referencia: string;
	public leido: boolean;

	constructor(remitente: Usuario | Profesional, destinatario: Usuario | Profesional, fecha: number, asunto: string,
		referencia: string, leido: boolean, id?: string, motivo?: string) {
		this.id = id;
		this.remitente = remitente;
		this.destinatario = destinatario;
		this.fecha = fecha;
		this.asunto = asunto;
		this.motivo = motivo;
		this.referencia = referencia;
		this.leido = leido;
	}
}
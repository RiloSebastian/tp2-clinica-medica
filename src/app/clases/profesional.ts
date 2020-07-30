import { Usuario } from './usuario';
import { Especialidad } from './especialidad';
import { Horario } from './horario';

export class Profesional extends Usuario {
	public especialidades: Array<Especialidad>;
	public horarios: Array<Horario>;

	constructor(nombre: string, apellido: string, nacimiento: number, sexo:string , email: string, rol: string, imagenUno: string, imagenDos: string, habilitado: string, especialidades: Array<Especialidad>, horarios?: Array<Horario>, id?: string) {

		super(nombre, apellido, nacimiento, sexo ,email, rol, imagenUno, imagenDos, habilitado, id);
		this.especialidades = especialidades;
		this.horarios = horarios;
	}

	hola(){
		console.log('hola '+this.nombre+' '+this.apellido);
	}
}
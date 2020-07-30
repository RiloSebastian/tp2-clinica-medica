export class Usuario {
	public id?: string;
	public nombre: string;
	public apellido: string;
	public nacimiento: number;
	public sexo:string;
	public email: string;
	public rol: string;
	public imagenUno: string;
	public imagenDos: string;
	public habilitado: string;

	constructor(nombre: string, apellido: string, nacimiento: number, sexo:string,email: string,
		rol: string, imagenUno: string, imagenDos: string, habilitado: string, id?: string) {
		this.id = id;
		this.nombre = nombre;
		this.apellido = apellido;
		this.nacimiento = nacimiento;
		this.sexo = sexo;
		this.email = email;
		this.rol = rol;
		this.imagenUno = imagenUno;
		this.imagenDos = imagenDos;
		this.habilitado = habilitado;
	}
}



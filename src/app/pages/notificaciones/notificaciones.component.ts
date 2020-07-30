import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificacionService } from '../../servicios/notificacion.service';
import { AuthService } from '../../servicios/auth.service';
@Component({
	selector: 'app-notificaciones',
	templateUrl: './notificaciones.component.html',
	styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit, OnDestroy {
	public usuario: any = {};
	public listaNotif: Array<any> = [];
	public subNotif: any = null;
	notifAux: any = null;
	constructor(public notificaciones: NotificacionService, public auth: AuthService) { }

	ngOnInit(): void {
		this.inicializar();
	}

	async inicializar() {
		await this.auth.getUsuario(JSON.parse(localStorage.getItem('user')).uid).then(ref => {
			this.usuario = ref.data();
			let snap = ref.data();
		});
		if (this.usuario.rol === 'Paciente') {
			await this.notificaciones.traerNotificacionesPaciente(this.usuario.email).subscribe(snap => {
				this.listaNotif = snap.map(ref => {
					const x = ref.payload.doc.data() as Object;
					x['id'] = ref.payload.doc.id;
					return { ...x };
				});
				this.ordenarNotificaciones();
			});
		} else if (this.usuario.rol === 'Profesional') {
			await this.notificaciones.traerNotificacionesProfesional(this.usuario.email).subscribe(snap => {
				this.listaNotif = snap.map(ref => {
					const x = ref.payload.doc.data() as Object;
					x['id'] = ref.payload.doc.id;
					return { ...x };
				});
				this.ordenarNotificaciones();
			});
		} else if (this.usuario.rol === 'Admin') {
			await this.notificaciones.traerNotificacionesTodos().subscribe(snap => {
				this.listaNotif = snap.map(ref => {
					const x = ref.payload.doc.data() as Object;
					x['id'] = ref.payload.doc.id;
					return { ...x };
				});
				this.ordenarNotificaciones();
			});
		}
	}

	ordenarNotificaciones(){
		this.listaNotif.sort((x,y)=>{
			let pn = this.asignarValor(x);
			let sn = this.asignarValor(y);
			return pn-sn;
		})
	}

	asignarValor(x){
		if(x.leido){
			return 1;
		}
		return 0;
	}

	leerNotificacion(notificacion) {
		this.notifAux = notificacion;
		if (this.usuario.email === notificacion.destinatario && !notificacion.leido) {
			this.notificaciones.actualizarNotificacion(notificacion.id, 'leido', true);
		}
	}

	ngOnDestroy(): void {
		if (this.subNotif !== null) {
			this.subNotif.unsubscribe();
		}
	}

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { NotificacionService } from '../../servicios/notificacion.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit, OnDestroy {
  public usuario: any = {};
  public notifs: number = 0;
  public subU: any = null;
  public subN: any = null;
  constructor(public Authserv: AuthService, private notificaciones: NotificacionService, private router: Router) {
    this.subU = this.Authserv.userProfile.subscribe(val => {
      this.usuario = {};
      this.usuario = val;
      if (this.usuario !== null) {
        this.subN = this.notificaciones.contarNotificacionesNoLeidas(this.usuario.email).subscribe(snap => {
            this.notifs = snap.length;
        })
      }
    });
  }

  tryCerrarSesion() {
    this.Authserv.logout().then(()=>{
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subU !== null){
      this.subU.unsubscribe();
    }
  }

}

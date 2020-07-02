import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  constructor(public Authserv: AuthService, private router: Router) {
  }

  tryCerrarSesion(){
  	this.Authserv.logout().then(()=>{
  		this.router.navigate(['/'])
  	})
  }

  ngOnInit(): void {
  }


}

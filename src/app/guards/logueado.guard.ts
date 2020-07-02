import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogueadoGuard implements CanActivate {
  
  constructor(private auth : AuthService, private router : Router){}

  canActivate(){
  	if(!this.auth.isLoggedIn){
  		this.router.navigate(['']);
  		return false;
  	}
    return true;
  }
  
}

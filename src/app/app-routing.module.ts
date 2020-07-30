import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ListadosComponent } from './pages/listados/listados.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { TablaHistoriasComponent } from './componentes/tabla-historias/tabla-historias.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { AltaAdminComponent } from './pages/alta-admin/alta-admin.component';
import { InformesComponent } from './pages/informes/informes.component';

import { LogueadoGuard } from './guards/logueado.guard';
import { NoLogueadoGuard } from './guards/no-logueado.guard';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [NoLogueadoGuard], data:{ animation: 'Home'}},
	{ path: 'Principal', component: PrincipalComponent, canActivate: [LogueadoGuard], data:{ animation: 'Principal'} },
	{ path: 'Login', component: LoginComponent, canActivate: [NoLogueadoGuard], data:{ animation: 'Login'} },
	{ path: 'Registro', component: RegistroComponent, canActivate: [NoLogueadoGuard], data:{ animation: 'Registro'} },
	{ path: 'Listados', component: ListadosComponent, canActivate: [LogueadoGuard], data:{ animation: 'Listados'} },
	{ path: 'Turnos', component: TurnosComponent, canActivate: [LogueadoGuard], data:{ animation: 'Turnos'} },
	{ path: 'Perfil', component: PerfilComponent, canActivate: [LogueadoGuard], data:{ animation: 'Perfil'}},
	{ path: 'Notificaciones', component: NotificacionesComponent, canActivate: [LogueadoGuard] },
	{ path: 'Alta-Admin', component: AltaAdminComponent, canActivate: [LogueadoGuard] },
	{ path: 'Informes', component: InformesComponent, canActivate: [LogueadoGuard] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

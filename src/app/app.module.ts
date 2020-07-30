import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
firebase.initializeApp(environment.firebaseConfig);

import { AuthService } from './servicios/auth.service';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { HomeComponent } from './pages/home/home.component';
import { CabeceraComponent } from './componentes/cabecera/cabecera.component';
import { ListadosComponent } from './pages/listados/listados.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CambioColorTurnoDirective } from './directives/cambio-color-turno.directive';
import { AltaTurnoComponent } from './componentes/alta-turno/alta-turno.component';
import { AltaHistoriaClinicaComponent } from './componentes/alta-historia-clinica/alta-historia-clinica.component';
import { AltaMensajeRechazoComponent } from './componentes/alta-mensaje-rechazo/alta-mensaje-rechazo.component';
import { TablaHistoriasComponent } from './componentes/tabla-historias/tabla-historias.component';
import { TablaEncuestasComponent } from './componentes/tabla-encuestas/tabla-encuestas.component';
import { TablaUsuariosComponent } from './componentes/tabla-usuarios/tabla-usuarios.component';
import { AltaHorariosComponent } from './componentes/alta-horarios/alta-horarios.component';
import { CaptchaComponent } from './componentes/captcha/captcha.component';
import { AltaEncuestaComponent } from './componentes/alta-encuesta/alta-encuesta.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { AltaAdminComponent } from './pages/alta-admin/alta-admin.component';
import { InformesComponent } from './pages/informes/informes.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    PrincipalComponent,
    HomeComponent,
    CabeceraComponent,
    ListadosComponent,
    TurnosComponent,
    PerfilComponent,
    CambioColorTurnoDirective,
    AltaTurnoComponent,
    AltaHistoriaClinicaComponent,
    AltaMensajeRechazoComponent,
    TablaHistoriasComponent,
    TablaEncuestasComponent,
    TablaUsuariosComponent,
    AltaHorariosComponent,
    CaptchaComponent,
    AltaEncuestaComponent,
    NotificacionesComponent,
    AltaAdminComponent,
    InformesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    HighchartsChartModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

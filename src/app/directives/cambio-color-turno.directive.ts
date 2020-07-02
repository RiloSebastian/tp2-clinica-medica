import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
	selector: '[appCambioColorTurno]'
})
export class CambioColorTurnoDirective implements OnInit {

	@Input('appCambioColorTurno') estado: string;

	constructor(private er: ElementRef, private r2: Renderer2) {
	}

	ngOnInit(){
		this.cambiarcolor(this.estado);
	}

	cambiarcolor(estado) {
		if (estado === 'Pendiente') {
			this.r2.setAttribute(this.er.nativeElement, 'class', 'bg-secondary');
		} else if (estado === 'Aceptado') {
			this.r2.setAttribute(this.er.nativeElement, 'class', 'bg-info');
		}else if (estado === 'Preparado') {
			this.r2.setAttribute(this.er.nativeElement, 'class', 'bg-warning');
		} else if (estado === 'Resuelto') {
			this.r2.setAttribute(this.er.nativeElement, 'class', 'bg-success');
		} else if (estado === 'Cancelado') {
			this.r2.setAttribute(this.er.nativeElement, 'class', 'bg-danger');
		}
	}
}

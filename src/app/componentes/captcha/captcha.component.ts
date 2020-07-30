import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'captcha',
	templateUrl: './captcha.component.html',
	styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {
	@Output() valorCaptcha = new EventEmitter<any>();
	@ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
	public ctx: CanvasRenderingContext2D;
	public unCaptcha = false;
	public cElegido = 'Propio';
	public codigoCP = '';
	public valido = null;
	constructor(private changeDetector: ChangeDetectorRef) { }

	ngOnInit(): void {
		this.estaDeshabilitado();
	}

	inicializarCanvas() {
		if (this.cElegido !== 'Propio') {
			this.cambiarCaptcha();
		}
		if (this.unCaptcha == true) {
			this.changeDetector.detectChanges();
			this.ctx = this.canvas.nativeElement.getContext('2d');
			this.captchaP();
		}
	}

	captchaG($event: string) {
		console.log(`Resolved response token: ${$event}`);
		this.valorCaptcha.emit($event);
	}

	resetearCP() {
		this.ctx.clearRect(0, 0, 200, 50);
		this.captchaP();
	}

	captchaP() {
		this.ctx.fillStyle= 'white';
		this.ctx.fillRect(0, 0, 200,50);
		this.ctx.fillStyle= 'black';
		this.generarTextoCP();
		this.generarTachadoCP();
	}

	generarTachadoCP() {
		this.ctx.lineWidth = 8;
		this.ctx.beginPath();
		this.ctx.textBaseline = 'middle';
		this.ctx.moveTo(0, 50 / 1.9);
		this.ctx.lineTo(200, 50 / 2.1);
		this.ctx.stroke();
	}

	generarTextoCP() {
		let caracteres = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789';
		this.codigoCP = '';
		for (let i = 0; i < 8; i++) {
			let a = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
			this.codigoCP += a;
		}
		console.log(this.codigoCP);
		this.ctx.font = 'bold 28px "Comic Sans MS", cursive, sans-serif';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(this.codigoCP, 200 / 2, 50 / 2);
	}


	validarCP(escrito) {
		console.log(escrito);
		if (escrito == this.codigoCP) {
			this.valido = true;
			this.valorCaptcha.emit(escrito);
		}
		else {
			this.valido = false;
			this.valorCaptcha.emit(null);
			this.resetearCP();
		}
	}

	habilitarC() {
		if (this.unCaptcha) {
			this.valido = null;
			this.cElegido = 'Propio';
		}
		this.unCaptcha = !this.unCaptcha;
		this.estaDeshabilitado();
		this.inicializarCanvas();
	}

	cambiarCaptcha() {
		if (this.cElegido === 'Google') {
			this.cElegido = 'Propio';
		} else {
			this.cElegido = 'Google';
		}
		this.valorCaptcha.emit(null);
	}

	estaDeshabilitado() {
		if (this.unCaptcha) {
			this.valorCaptcha.emit(null);
		} else {
			this.valorCaptcha.emit('deshabilitado');
		}
	}

}

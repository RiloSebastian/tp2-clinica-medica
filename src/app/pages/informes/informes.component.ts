import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { InformeService } from '../../servicios/informe.service';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import HighchartsExportData from "highcharts/modules/export-data";
exporting(Highcharts);
HighchartsExportData(Highcharts);
@Component({
	selector: 'app-informes',
	templateUrl: './informes.component.html',
	styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
	public listaPacientes: Array<any> = [];
	public fPaciente: any = null;
	public fDesdeFecha: string = null;
	public fHastaFecha: string = null;
	public numeroInforme: number = 0;
	public highchart: typeof Highcharts = Highcharts;
	public chartOptions: Highcharts.Options = null;
	public serie: Array<any> = [];
	public controlPac: boolean = false;
	public controlFecha: boolean = false;
	constructor(public informe: InformeService, public usuarios: UsuarioService) { }

	ngOnInit(): void {
		this.usuarios.traerPacientes().then(value => {
			this.listaPacientes = value.docs.map(doc => { return { ...doc.data() as Object } });
		});
	}

	elegirInforme(numeroInforme) {
		this.numeroInforme = parseInt(numeroInforme);
		this.controlPac = false;
		this.controlFecha = false;
		if (this.numeroInforme === 1 || this.numeroInforme === 4 || this.numeroInforme === 5) {
			this.controlFecha = true;
		}
		if (this.numeroInforme === 7) {
			this.controlPac = true;
		}
		this.chartOptions = null;
	}

	async generarGrafico() {
		this.serie = [];
		switch (this.numeroInforme) {
			case 1:
				if (this.fDesdeFecha !== null && this.fHastaFecha !== null) {
					await this.informe.informeProfesionalesInicioSesion(Date.parse(this.fDesdeFecha), Date.parse(this.fHastaFecha)).then(serie => {
						this.serie = serie;

						this.graficoPuntos(this.serie);
					});
				}
				break;
			case 2:
				await this.informe.informeProfesionalOperacionesEspecialidad().then(serie => {
					this.serie = serie;
					this.graficoColumnaSimple('Cantidad de Operaciones de Profesionales por Especialidad', 'category', 'Operaciones', this.serie);
				});
				break;
			case 3:
				await this.informe.informeTurnosPorDiaDeSemana().then(serie => {
					this.serie = serie;
					this.graficoColumnaSimple('Cantidad de Turnos por dia de semana', 'category', 'Turnos', this.serie);
				});
				break;
			case 4:
				if (this.fDesdeFecha !== null && this.fHastaFecha !== null) {
					this.informe.informeTurnosDadosEnTiempo(Date.parse(this.fDesdeFecha), Date.parse(this.fHastaFecha)).then(serie => {
						this.serie = serie;
						this.graficoColumnaSimple('Cantidad de turnos dados por Profesional', 'category', 'Turnos', this.serie);
					});
				}
				break;
			case 5:
				if (this.fDesdeFecha !== null && this.fHastaFecha !== null) {
					await this.informe.informeProfesionalDiasTrabajados(Date.parse(this.fDesdeFecha), Date.parse(this.fHastaFecha)).then(serie => {
						this.serie = serie;
						this.graficoColumnaSimple('Cantidad de dias trabajados por Profesional', 'category', 'Dias', this.serie);
					});
				}
				break;
			case 6:
				await this.informe.informeTotalVisitas().then(serie => {
					this.serie = serie;
					this.graficoArea(this.serie);
				});
				break;
			case 7:
				if (this.fPaciente !== null) {
					await this.informe.informeTurnosPaciente(this.fPaciente).then(serie => {
						this.serie = this.informe.graficoTurnosPaciente(serie)
						this.graficoColumnaSimple('Turnos de ' + this.fPaciente.apellido + ' ' + this.fPaciente.nombre, 'category', 'Turnos', this.serie);
					});
				}
				break;
			case 8:
				await this.informe.informeCantPacientesAtendidosPorEspecialidades().then(serie => {
					this.serie = serie;
					this.graficoColumnaSimple('Cantidad de Pacientes por Especialidad', 'category', 'Pacientes', this.serie);
				});
				break;
			case 9:
				await this.informe.informeProfesionalEspecialidad().then(serie => {
					this.serie = serie;
					this.graficoColumnaSimple('Cantidad de Profesionales por Especialidad', 'category', 'Profesionales', this.serie);
				});
				break;
			case 10:
				await this.informe.informeRespuestasEncuesta().then(serie => {
					this.serie = serie;
					this.graficoColumnaPorcentaje(this.serie);
				});
				break;
		}
	}

	graficoPuntos(serie) {
		this.chartOptions = {
			chart: {
				type: 'scatter',
				inverted: true,
				zoomType: 'xy'
			},
			title: {
				text: 'Ingreso de Profesionales'
			},
			xAxis: {
				title: {
					text: 'usuario'
				},
				type: 'category',
				gridLineWidth: 1,
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true
			},
			yAxis: {
				title: {
					text: 'fecha'
				},
				type: 'datetime',
				labels: {
					format: '{value:%Y-%m-%d}',
				},
				gridLineWidth: 0
			},
			plotOptions: {
				scatter: {
					marker: {
						radius: 5,
						states: {
							hover: {
								enabled: true,
								lineColor: 'rgb(100,100,100)'
							}
						}
					},
					tooltip: {
						pointFormat: '{point.name}, {point.y:%Y-%m-%d %H:%M}'
					}
				}
			},
			series: serie
		};
	}

	graficoColumnaSimple(titulo, typoXAxis, tituloYAxis, serie) {
		this.chartOptions = {
			chart: {
				type: 'column'
			},
			title: {
				text: titulo
			},
			xAxis: {
				type: typoXAxis,
				crosshair: true
			},
			yAxis: {
				min: 0,
				title: {
					text: tituloYAxis
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
					'<td style="padding:0"><b>{point.y}</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: serie
		};
	}

	graficoColumnaPorcentaje(serie) {
		this.chartOptions = {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Respuestas de Las Encuestas'
			},
			xAxis: {
				type: 'category'
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Cantidad total de Encuestas'
				}
			},
			tooltip: {
				pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
				shared: true
			},
			plotOptions: {
				column: {
					stacking: 'percent'
				}
			},
			series: serie
		};
	}

	graficoArea(serie) {
		this.chartOptions = {
			chart: {
				type: 'area'
			},
			title: {
				text: 'visitas totales al sistema'
			},
			yAxis: {
				title: {
					text: 'Visitas'
				}
			},
			xAxis: {
				type: 'datetime',
				labels: {
					format: '{value:%Y-%m-%d}',
				},
			},
			series: serie
		};
	}
}

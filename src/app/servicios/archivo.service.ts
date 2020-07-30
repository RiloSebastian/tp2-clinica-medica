import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'
import * as jsPDF from 'jspdf';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
	providedIn: 'root'
})
export class ArchivoService {

	constructor(private storage: AngularFireStorage) { }

	public exportAsExcelFile(json: any[], excelFileName: string): void {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	private saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
	}

	public SavePDF(data,filePath): void {
		let content = data.nativeElement;
		let doc = new jsPDF();
		let _elementHandlers =
		{
			'#editor': function(element, renderer) {
				return true;
			}
		};
		doc.fromHTML(content.innerHTML, 15, 15, {

			'width': 190,
			'elementHandlers': _elementHandlers
		});
		doc.save(filePath);
	}

}

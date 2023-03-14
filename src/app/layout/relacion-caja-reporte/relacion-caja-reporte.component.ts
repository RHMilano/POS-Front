import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {RelacionCaja} from '../../Models/InicioFin/RelacionCaja';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {InicioFinDiaService} from '../../services/inicio-fin-dia.service';
import {BsDatepickerConfig, BsLocaleService, BsModalRef} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';
import {ReportesService} from '../../services/reportes.service';
import {VentasDeptoRequest} from '../../Models/Reportes/VentasDeptoRequest';
import {Page} from '../../Models/General/Page';
import {ReporteRelacionCajaRequest} from '../../Models/Reportes/ReporteRelacionCajaRequest';

@Component({
  selector: 'app-relacion-caja-reporte',
  templateUrl: './relacion-caja-reporte.component.html',
  styleUrls: ['./relacion-caja-reporte.component.css'],
  encapsulation:  ViewEncapsulation.None,
  providers: [ InicioFinDiaService, ReportesService ]
})
export class RelacionCajaReporteComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;
  rows = [];
  relacionesCaja: Array<RelacionCaja>;
  bsConfig: Partial<BsDatepickerConfig>;
  fechaHoy: Date;
  FechaInicio: Date;
  FechaFin: Date;
  titulo: string;
  idCaja: number;
  page = new Page();

  constructor(private _iniciofinService: InicioFinDiaService, private modalRef: BsModalRef,
              private _localeService: BsLocaleService, private _alertService: AlertService,
              private _reporteService: ReportesService) {
    this._localeService.use('es');
    this.fechaHoy = new Date();
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      maxDate: this.fechaHoy
    });
  }

  ngOnInit() {
      this.relacionesCaja = [];
      this.titulo = 'Reporte de Relación de Caja';
      this.page.pageNumber = 0;
      this.page.size = 5;
  }


  generarReporte(pageInfo) {
    this.relacionesCaja = [];
    this.page.pageNumber = pageInfo.offset;
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const request = new ReporteRelacionCajaRequest();
    request.numeroPagina = this.page.pageNumber;
    request.registrosPorPagina = this.page.size;
    request.fechaInicial = this.FechaInicio.toLocaleDateString('es-ES', options);
    request.fechaFinal = this.FechaFin.toLocaleDateString('es-ES', options);
    if (this.FechaInicio > this.FechaFin) {
      this._alertService.show({
        tipo: 'info',
        titulo: 'Milano',
        mensaje: 'La fecha inicio no puede ser mayor a la fecha fin'
      });
    } else {
      this._reporteService.RelacionCajaService(request).subscribe(
        data => {
          if (data.length) {
            data.forEach(item => {
              const [fecha] = item.fecha.split(' ');
              item.fecha = fecha;
            });
            this.relacionesCaja = data;
            this.rows = data;
            this.page.totalElements = this.relacionesCaja[0].totalRegistros;
            this.idCaja = this.relacionesCaja[0].idRelacionCaja;
          } else {
            this._alertService.show({
              tipo: 'info',
              titulo: 'Milano',
              mensaje: 'No se encontro información con los datos capturados'
            });
          }
        });
    }
  }

  /* ExpandTable() {
     this.table.rowDetail.expandAllRows();
   }*/

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  closeModal() {
    this.modalRef.hide();
  }

  setRows(caja) {
    this.rows = [];
    this.rows = this.relacionesCaja[caja].gruposRelacionCaja;
    this.idCaja = this.relacionesCaja[caja].idRelacionCaja;
  }

  reimprimir(caja) {
    this._reporteService.ReimprimirRelacionCajaService(caja).subscribe(
      data => {
        if (data.codeNumber === 402) {
          this.closeModal();
        } else {
          this._alertService.show({
            tipo: 'info',
            titulo: 'Milano',
            mensaje: data.codeDescription
          });
        }
      });
   }
}

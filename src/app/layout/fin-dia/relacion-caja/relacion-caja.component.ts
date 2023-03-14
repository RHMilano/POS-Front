import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {BsDatepickerConfig, BsLocaleService, BsModalRef} from 'ngx-bootstrap';
import {InicioFinDiaService} from '../../../services/inicio-fin-dia.service';
import {ReportesService} from '../../../services/reportes.service';
import {RelacionCaja} from '../../../Models/InicioFin/RelacionCaja';
import {AlertService} from '../../../services/alert.service';
import {VentasDeptoRequest} from '../../../Models/Reportes/VentasDeptoRequest';
import {Page} from '../../../Models/General/Page';
import {ReporteRelacionCajaRequest} from '../../../Models/Reportes/ReporteRelacionCajaRequest';

@Component({
  selector: 'app-relacion-caja',
  templateUrl: './relacion-caja.component.html',
  styleUrls: ['./relacion-caja.component.css'],
  encapsulation:  ViewEncapsulation.None,
  providers: [ InicioFinDiaService, ReportesService ]
})
export class RelacionCajaComponent implements OnInit {

  @Input() relacionCaja: RelacionCaja;
  @Input() reporte : boolean;
  @ViewChild('myTable') table: DatatableComponent;
  rows = [];
  relacionesCaja: Array<RelacionCaja>;
  bsConfig: Partial<BsDatepickerConfig>;
  fechaHoy: Date;
  FechaInicio: Date;
  FechaFin: Date;
  titulo: string;
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
    if (!this.reporte) {
      this.cargarRelacion();
      this.titulo = 'Relación de Caja';
    } else {
      this.titulo = 'Reporte de Relación de Caja';
      this.page.pageNumber = 0;
      this.page.size = 5;
    }
  }

  cargarRelacion() {
    this.rows = this.relacionCaja.gruposRelacionCaja;
  }

  enviarRelacion() {
    this._iniciofinService.actualizarRelacionCajatService(this.relacionCaja).subscribe( response => {
      if (Number(response.codeNumber) === 402) {
        this.closeModal();
        this._alertService.show({titulo: 'Milano', tipo: 'success', mensaje: response.codeDescription});
      } else {
        this._alertService.show({titulo: 'Milano', tipo: 'error', mensaje: response.codeDescription});
      }
    });
  }

  generarReporte(pageInfo) {
    this.rows = [];
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
            this.relacionesCaja = data;
            this.rows = data[0].gruposRelacionCaja;
            this.page.totalElements = this.relacionCaja.totalRegistros;
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

  reimprimir() {
    this._reporteService.ReimprimirRelacionCajaService(this.relacionCaja.idRelacionCaja).subscribe(
      data => {
        if (data.codeNumber === 402) {
          this.closeModal();
        } else {
          this._alertService.show({
            tipo: 'info',
            titulo: 'Milano',
            mensaje: 'No se encontro información'
          });
        }
      });
   };
}

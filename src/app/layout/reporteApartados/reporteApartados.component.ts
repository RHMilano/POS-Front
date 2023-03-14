import {Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ReportesService} from '../../services/reportes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import {VentasDeptoRequest} from '../../Models/Reportes/VentasDeptoRequest';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ConfigPosService} from '../../services/config-pos.service';
import {TipoReporte, TipoVenta} from '../../shared/GLOBAL';
import {AlertService} from '../../services/alert.service';
import {Decimal} from 'decimal.js/decimal';
import {DosDecimalesPipe} from '../../pipes/dos-decimales.pipe';
import {DecimalPipe} from '@angular/common';


@Component({
  selector: 'app-reportes-apartados',
  templateUrl: './reporteApartados.component.html',
  styleUrls: ['./reporteApartados.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ReportesService, DosDecimalesPipe]
})
export class ReporteApartadosComponent implements OnInit {

  rows = [];

  temp = [];

  columns = [];

  reportesForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  FechaInicio: Date;
  FechaFin: Date;
  fechaHoy: Date;
  titulo: string;
  enableSummary;
  summaryPosition;
  tipoApartado: string;
  reporteGenerado: boolean;
  apartadosArray;

  @Input() TipoVenta: TipoVenta;
  //@ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() TipoReporte: TipoReporte;
  @ViewChild('myTable') table: DatatableComponent;
  @ViewChild('nameSummaryCell') nameSummaryCell: TemplateRef<any>;

  constructor(public  modalRef: BsModalRef, private _reportesService: ReportesService,
    private _localeService: BsLocaleService, public _configService: ConfigPosService,
              public _alertService: AlertService,  private dosDecimales: DosDecimalesPipe) {
    this._localeService.use('es');
    this.fechaHoy = new Date();
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      maxDate: this.fechaHoy
    });
  }

  ngOnInit() {
    this.reporteGenerado = false;
    this._configService.applyColor(this.TipoVenta);

    this.enableSummary = true;
    this.summaryPosition = 'bottom';
    this.reportesForm = new FormGroup({
      fechaInicial: new FormControl('', Validators.compose([
          Validators.required])),
      fechaFinal: new FormControl('', Validators.compose([
        Validators.required])),
      tipoApartado: new FormControl('', Validators.compose([
        Validators.required]))
    });


    this.reportesForm.get('fechaInicial').hasError('required');
    this.reportesForm.get('fechaFinal').hasError('required');

    this.titulo = 'Apartados con Detalle';

  }


  reporte() {
    this.rows = [];
    this.fetch((data) => {
      this.temp = [...data];
      this.rows = data;
    });
  }

  fetch(cb) {
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
    const request = new VentasDeptoRequest();
    request.fechaInicial = this.FechaInicio.toLocaleDateString('es-ES', options);
    request.fechaFinal = this.FechaFin.toLocaleDateString('es-ES', options);
    if (this.FechaInicio > this.FechaFin) {
      this._alertService.show({
        tipo: 'info',
        titulo: 'Milano',
        mensaje: 'La fecha inicio no puede ser mayor a la fecha fin'
      });
    } else {
          this.reporteGenerado = true;
          this.apartadosArray= [];
          this._reportesService.TotalVentasDetalleService(request).subscribe(
            data => {
              if (data.length) {
                data.forEach(index => {
                  let existe = false;
                  this.apartadosArray.forEach(item => {
                    if (item.FolioApartado === index.FolioApartado) {
                      existe = true;
                    }
                  });
                  if (!existe) {
                    this.apartadosArray.push(index);
                  }
                });
                const apartados = this.apartadosArray.filter( apartado => apartado.Estatus === this.tipoApartado);
                if(!apartados.length) {
                  this._alertService.show({
                     tipo: 'info',
                     titulo: 'Milano',
                     mensaje: 'No se encontro información con los datos capturados'
                  });
                }
                cb(apartados);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            }
          );
    }

  }

  filterReportes() {
    if(this.reporteGenerado) {
      this.fetchReportes((data) => {
        this.temp = [...data];
        this.rows = data;
      });
    }
  }

  fetchReportes(cb) {
      const apartados = this.apartadosArray.filter( apartado => apartado.Estatus === this.tipoApartado);
      if(!apartados.length) {
        this._alertService.show({
           tipo: 'info',
           titulo: 'Milano',
           mensaje: 'No se encontro información con los datos capturados'
        });
      }
      cb(apartados);
  }

  updateFilter(event) {
    const val = (event.target.value).toUpperCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.departamento.includes(val) || !val;
    });

    // update the rows
    this.rows = temp;
  }

  closeModal() {
    this.modalRef.hide();
  }

  sum(cells: number[]): number {
    let total = new Decimal (0);
    cells.forEach(item => {
      const cellT = new Decimal(item);
      total = total.plus(cellT);
    });
    const suma = this.dosDecimales.calc(total.toNumber());
   return suma;
  }
  
  sumCell = (celdas: Array<number>) => {
    const suma = celdas.reduce((sum, cell) => sum += cell, 0);
    return '$ ' + new DecimalPipe('en-US').transform(suma, '1.0-2');
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
}

import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ReportesService} from '../../services/reportes.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import {VentasDeptoRequest} from '../../Models/Reportes/VentasDeptoRequest';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ConfigPosService} from '../../services/config-pos.service';
import {TipoReporte, TipoVenta} from '../../shared/GLOBAL';
import {AlertService} from '../../services/alert.service';
import {DosDecimalesPipe} from '../../pipes/dos-decimales.pipe';
import {DecimalPipe} from '@angular/common';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ReportesService, DosDecimalesPipe]
})
export class ReportesComponent implements OnInit {

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
  departamentoArray;
  departamento: string;

  @Input() TipoVenta: TipoVenta;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() TipoReporte: TipoReporte;

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

    switch (this.TipoReporte) {
      case TipoReporte.departamento :
        this.titulo = 'Ventas por Departamento';
        this.columns = [
          {name: 'Depto', prop: 'departamento'},
          {name: 'Sub Depto', prop: 'subDepartamento'},
          {name: 'Cant Vendida Act', prop: 'cantidadVendidaActual', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vtas c/IVA Act', prop: 'ventasConIvaActual', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vtas s/IVA Act', prop: 'ventasSinIvaActual', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Dev c/IVA Act', prop: 'devolucionConIvaActual', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Dev s/IVA Act', prop: 'devolucionSinIvaActual', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Cont Vs Total Act', prop: 'contribucionVsTotalActual', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vta Neta Act', prop: 'ventaNetaConIvaActual', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vta Neta Ant', prop: 'ventaNetaConIvaAnterior', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Cant Vendida Ant', prop: 'cantidadVendidaAnterior', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vtas c/IVA Ant', prop: 'ventasConIvaAnterior', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vtas s/IVA Ant', prop: 'ventasSinIvaAnterior', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Dev c/IVA Ant', prop: 'devolucionConIvaAnterior', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Dev s/IVA Ant', prop: 'devolucionSinIvaAnterior', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Cont Vs Total Ant', prop: 'contribucionVsTotalAnterior', summaryFunc: (cells) => this.sum(cells)}
        ];
        break;
      case TipoReporte.sku :
        this.titulo = 'Ventas por Sku';
        this.columns = [
          {name: 'Sku', prop: 'SKU',  width: 100},
          {name: 'Descripción', prop: 'Descripcion'},
          {prop: 'Proveedor',  width: 100, summaryFunc: (cells) => this.sumNone(cells)},
          {prop: 'Estilo' , width: 100},
          {name: 'Cantidad', prop: 'Cant', summaryFunc: (cells) => this.sumNone(cells)},
          {name: 'Vtas Netas', prop: 'VentasNetas', summaryFunc: (cells) => this.sum(cells)}
        ];
        break;
      case TipoReporte.caja :
        this.titulo = 'Ventas por Caja';
        this.columns = [
          {prop: 'Caja', summaryFunc: (cells) => this.sumNone(cells)},
          {name: 'Vta Total', prop: 'VentaTotal', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Devolución', prop: 'Devolucion', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vta Neta', prop: 'VentaNeta', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Núm de Trans', prop: 'NumTran',  width: 180, summaryFunc: (cells) => this.sumNone(cells)},
          {name: 'Tick Prom', prop: 'TickProm', summaryFunc: (cells) => this.sum(cells) }
        ];
        break;
      case TipoReporte.detalle :
        this.titulo = 'Apartados con Detalle';
        this.columns = [
          {prop: 'FolioApartado', width: 120},
          {name: 'Núm de Tel',  width: 100, prop: 'NumTelefono'},
          {name: 'Imp Apart', prop: 'ImporteApartado',  width: 80, summaryFunc: (cells) => this.sum(cells)},
          {prop: 'Monto',  width: 80, summaryFunc: (cells) => this.sum(cells)},
          {prop: 'Saldo',  width: 80, summaryFunc: (cells) => this.sum(cells)},
          {prop: 'FechaApertura',  width: 100},
          {name: 'Fecha de Venc', prop: 'FechaVencimiento' , width: 100},
          {name: 'Fecha Últ Mov', prop: 'Fecha',  width: 100}
        ];
        break;
      case  TipoReporte.hr :
        this.titulo = 'Ventas por Hr';
        this.columns = [
          {prop: 'Fecha'},
          {prop: 'Hora'},
          {prop: 'Venta', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Núm de Trans', prop: 'NumTransacciones',  width: 180, summaryFunc: (cells) => this.sumNone(cells)},
          {prop: 'Piezas', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Tick Prom', prop: 'TickProm', summaryFunc: (cells) => this.sum(cells)},
          {name: 'PPP', prop: 'PPP' ,  width: 200, summaryFunc: (cells) => this.sum(cells)},
          {name: 'Índ de Vta',  prop: 'IndiceVta', summaryFunc: (cells) => this.sum(cells)}
        ];
        break;
      case TipoReporte.sinDetalle :
        this.titulo = 'Apartados';
        this.columns = [
          {prop: 'FolioApartado', width: 120},
          {name: 'Núm de Tel', prop: 'NumTelefono',  width: 100},
          {name: 'Imp Apart', prop: 'ImporteApartado', width: 80, summaryFunc: (cells) => this.sum(cells)},
          {prop: 'Saldo',  width: 80, summaryFunc: (cells) => this.sum(cells)},
          {prop: 'FechaApertura',  width: 100},
          {name: 'Fecha de Venc', prop: 'FechaVencimiento',  width: 100}
        ];
        break;
      case TipoReporte.vendedor :
        this.titulo = 'Ventas por Vendedor';
        this.columns = [
          {name: 'Núm de Vend', prop: 'NumeroVendedor'},
          {name: 'Nom Vendedor', prop: 'NombreVendedor'},
          {prop: 'VentasBrutas', summaryFunc: (cells) => this.sum(cells)},
          {prop: 'Devoluciones', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Núm de Trans', prop: 'NumTransacciones', summaryFunc: (cells) => this.sumNone(cells)},
          {name: 'Núm de Pzas', prop: 'NumPzas', summaryFunc: (cells) => this.sum(cells)},
          {name: 'PPP', prop: 'PPP', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Índ de Vta', prop: 'IndiceVta', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Tick Prom', prop: 'TickProm', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Vtas Netas', prop: 'VentasNetas', summaryFunc: (cells) => this.sum(cells)}
        ];
        break;
      case TipoReporte.devoluciones :
          this.titulo = 'Devoluciones por Sku';
        this.columns = [
          {name: 'Sku', prop: 'SKU'},
          {name: 'Descripción', prop: 'Descripcion'},
          {prop: 'Proveedor', summaryFunc: (cells) => this.sumNone(cells)},
          {prop: 'Estilo'},
          {name: 'Cantidad', prop: 'Cant', summaryFunc: (cells) => this.sumNone(cells)},
          {prop: 'Importe', summaryFunc: (cells) => this.sum(cells)}
        ];
        break;
      case TipoReporte.ingEgresos :
        this.titulo = 'Entregas Parciales';
        this.columns = [
          {prop: 'Caja', summaryFunc: (cells) => this.sumNone(cells)},
          {prop: 'Fecha'},
          {prop: 'Hora'},
          {prop: 'Importe', summaryFunc: (cells) => this.sum(cells)},
          {name: 'Razón', prop: 'Razon'},
          {name: 'Tipo Trans', prop: 'TipoTransaccion'},
          {name: 'Transacción', prop: 'Transaccion'}
        ];
        break;
    }
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
      switch (this.TipoReporte) {
        case TipoReporte.departamento :
          this._reportesService.TotalVentasService(request).subscribe(
            data => {
              if (data.length) {
                this.departamentoArray = data;
                const deptos = data.filter( depto => depto.departamento.includes(this.departamento));
                cb(deptos);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            }
          );
          break;
        case TipoReporte.sku :
          this._reportesService.TotalVentasSkuService(request).subscribe(
            data => {
              if (data.length) {
                cb(data);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            }
          );
          break;
        case TipoReporte.caja :
          this._reportesService.TotalVentasCajaService(request).subscribe(
            data => {
              if (data.length) {
                cb(data);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            }
          );
          break;
        case TipoReporte.detalle :
          this.reporteGenerado = true;
          this._reportesService.TotalVentasDetalleService(request).subscribe(
            data => {
              if (data.length) {
                this.apartadosArray = data;
                const apartados = data.filter( apartado => apartado.Estatus === this.tipoApartado);
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
          break;
        case TipoReporte.hr :
          this._reportesService.TotalVentasHrService(request).subscribe(
            data => {
              if (data.length) {
                cb(data);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            }
          );
          break;
        case TipoReporte.sinDetalle :
          this.reporteGenerado = true;
          this._reportesService.TotalVentasSinDetalleService(request).subscribe(
            data => {
              if (data.length) {
                this.apartadosArray = data;
                const apartados = data.filter( apartado => apartado.Estatus === this.tipoApartado);
                if (!apartados.length) {
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
          break;
        case TipoReporte.vendedor :
          this._reportesService.TotalVentasVendedorService(request).subscribe(
            data => {
              if (data.length) {
                cb(data);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            }
          );
          break;
        case TipoReporte.devoluciones :
          this._reportesService.DevoplucionesSkuService(request).subscribe(
            data => {
              if (data.length) {
                cb(data);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            });
          break;
        case TipoReporte.ingEgresos :
          this._reportesService.IngresosEgresoService(request).subscribe(
            data => {
              if (data.length) {
                cb(data);
              } else {
                this._alertService.show({
                  tipo: 'info',
                  titulo: 'Milano',
                  mensaje: 'No se encontro información con los datos capturados'
                });
              }
            });
          break;
      }
    }

  }

  filterReportes() {
    if (this.reporteGenerado) {
      this.fetchReportes((data) => {
        this.temp = [...data];
        this.rows = data;
      });
    }
  }

  fetchReportes(cb) {
      const apartados = this.apartadosArray.filter( apartado => apartado.Estatus === this.tipoApartado);
      if (!apartados.length) {
        this._alertService.show({
          tipo: 'info',
          titulo: 'Milano',
          mensaje: 'No se encontro información con los datos capturados'
        });
      }
    cb(apartados);
  }

  updateFilter(event) {
    this.departamento = (event.target.value).toUpperCase();
  }

  closeModal() {
    this.modalRef.hide();
  }

  private sum(cells: number[]) {
    const suma = cells.reduce((sum, cell) => sum += cell, 0);
    return '$ ' + new DecimalPipe('en-US').transform(suma, '1.0-2');
  }

  currencyPipe(value: any) {
    return new DecimalPipe('en-US').transform(value, '1.0-2');
  }

  sumNone(cells: number[]): null {
    return null;
  }

}

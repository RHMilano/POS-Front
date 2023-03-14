import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';
import {Denominaciones} from '../../Models/Pagos/Denominaciones';
import {GeneralService} from '../../services/general.service';
import {PagosOps, TipoCorte, TipoPago} from '../../shared/GLOBAL';
import {LecturaCaja} from '../../Models/General/LecturaCaja';
import {LecturaTotalDetalleFormaPago} from '../../Models/General/LecturaTotalDetalleFormaPago';
import {DenominacionesModel} from '../../Models/Pagos/DenominacionesModel';
import {FocusTicketRowDirective} from '../../directives/focus-ticket-row.directive';
import {RowSelector} from '../../Models/FrontEnd/RowSelector';
import {Decimal} from 'decimal.js/decimal';
import {InicioFinDiaService} from '../../services/inicio-fin-dia.service';
import {ObtenerFormasPagoRequest} from '../../Models/General/ObtenerFormasPagoRequest';
import {FinDiaComponentInterface} from '../../Models/FrontEnd/FinDiaComponentInterface';
import {FinDiaComponent} from '../fin-dia/fin-dia.component';
import {ResultadoValidacionCaja} from '../../Models/InicioFin/ResultadoValidacionCaja';

@Component({
  selector: 'app-lectura-x',
  templateUrl: './lectura-x.component.html',
  styleUrls: ['./lectura-x.component.css'],
  providers: [ GeneralService, InicioFinDiaService]
})
export class LecturaXComponent implements OnInit {

  @Input() TipoCorte: TipoCorte;
  @Input() Caja: number;
  @Input() finDiaInstance: FinDiaComponentInterface;
  @Input() cajas: Array<ResultadoValidacionCaja>;
  @Input() clave: string;
  @ViewChild('importeTemplate') importeTemplate: TemplateRef<any>;
  Importe: number;
  pagos: Array<Denominaciones>;
  showTiposPagos: boolean;
  showRetiro: boolean;
  total: number;
  pago;
  forma;
  totalPagos: number;
  totalRetiro: number;
  totalCubierto: boolean;
  totalRestante: number;
  totalIngresos: number;
  totalRetirosParciales: number;
  totalFondoFijo: number;
  tipoPagos = [];
  pagoBack: Array<LecturaTotalDetalleFormaPago>;
  currentSelection: number;
  currentSelectionT: number;

    @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
    itemsPerPage: number;
    totalItemsToPaginate: number;
    rowSelector: RowSelector;
    rowSelectorT: RowSelector;


  constructor(public modalRef: BsModalRef, private _alertService: AlertService, private retiroService: GeneralService,
              private _iniciofinService: InicioFinDiaService, public modalService: BsModalService) { }

  ngOnInit() {
    this.showRetiro = false;
    this.totalCubierto = false;
    this.total = 0;
    this.totalPagos = 0;
    this.totalRetiro = 0;
    this.totalRestante = 0;
    this.totalRetirosParciales = 0;
    this.totalIngresos = 0;
    this.totalFondoFijo = 0;
    this.pagos = [];
    this.showTiposPagos = false;
    this.retiroService.getDenominaciones().subscribe( data => {
      if (data.length) {
        data.forEach( item => {
          if (item) {
            const pago = new Denominaciones();
            pago.valorDenominacion = item.valorDenominacion;
            pago.cantidad = item.cantidad;
            pago.textoDenominacion = item.textoDenominacion;
            pago.codigoFormaPago = item.codigoFormaPago;
            pago.monto = 0;
            this.pagos.push(pago);
          }
        });

        this.totalItemsToPaginate = this.pagos.length;
        this.itemsPerPage = this.pagos.length;
        this.rowSelector = new RowSelector(this);
        this.rowSelector.currentSelection = 0;

        setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
        this._alertService.getSkuBlock();
      }
    });
   if (this.TipoCorte === TipoCorte.corteZ && this.Caja) {
     this._iniciofinService.lecturaZOfflineService(this.Caja).subscribe(
       data => {
         if (data.length) {
           data.forEach(item => {
             if (item.informacionAsociadaFormaPago.codigoFormaPago === TipoPago.efectivo) {
               this.total = item.importeTeorico;
               this.totalRestante = (item.importeTeorico) * -1;
               this.totalIngresos = item.totalIngresosConRetirosParciales;
               this.totalRetirosParciales = item.totalRetirosParciales;
             }
             const formaPago = {
               nombre: '',
               cantidad: 0,
               id: '0'
             };
             formaPago.nombre = item.informacionAsociadaFormaPago.descripcionFormaPago;
             formaPago.cantidad = item.importeTeorico;
             formaPago.id = item.informacionAsociadaFormaPago.identificadorFormaPago;
             if (Number(formaPago.cantidad) !== 0 || formaPago.nombre === PagosOps.efectivo) {
               this.tipoPagos.push(formaPago);
             }
           });

           this.pagoBack = data;
           this._alertService.getSkuBlock();
         }
       });
   } else {
     let requestLectura = new ObtenerFormasPagoRequest();
     if (this.Caja) requestLectura.codigoCaja = this.Caja;
     //debugger
     this.retiroService.lecturaX(requestLectura).subscribe(
       data => {
         if (data.length) {
           data.forEach(item => {
             if (item.informacionAsociadaFormaPago.codigoFormaPago === TipoPago.efectivo) {
               this.total = item.importeTeorico;
               this.totalRestante = (item.importeTeorico) * -1;
               this.totalIngresos = item.totalIngresosConRetirosParciales;
               this.totalRetirosParciales = item.totalRetirosParciales;
               this.totalFondoFijo = item.totalFondoFijo;
             }
             const formaPago = {
               nombre: '',
               cantidad: 0,
               id: '0'
             };
             formaPago.nombre = item.informacionAsociadaFormaPago.descripcionFormaPago;
             formaPago.cantidad = item.importeTeorico;
             formaPago.id = item.informacionAsociadaFormaPago.identificadorFormaPago;
             if (Number(formaPago.cantidad) !== 0 || formaPago.nombre === PagosOps.efectivo) {
               this.tipoPagos.push(formaPago);
             }
           });

           this.pagoBack = data;
           this._alertService.getSkuBlock();
         }
       });
   }
  }

  enviarDenominaciones() {
    this.totalItemsToPaginate = this.tipoPagos.length;
    this.itemsPerPage = this.tipoPagos.length;
    this.currentSelection = 0;
    this.rowSelectorT = new RowSelector(this);
    this.rowSelectorT.currentSelection = 0;

    if (this.totalRetiro === 0) {
      this.totalRestante = new Decimal(this.total).plus(this.totalRetiro).toNumber();
      this.totalRestante = this.TipoCorte === TipoCorte.corteX ? new Decimal(this.totalRestante).plus(this.totalFondoFijo).toNumber() :  this.totalRestante;
      this.totalRestante = this.totalRestante  * -1;
    }
  this.tipoPagos.forEach( item => {
    if (item.id === TipoPago.efectivo) {
      item.cantidad = this.totalIngresos;
    }
    this.totalPagos = this.totalPagos + item.cantidad;
  });

    this.tipoPagos.sort(function (a, b) {
      const num1 = new Decimal (a.cantidad);
      const num2 = new Decimal (b.cantidad);
      if (num1.toNumber() >  num2.toNumber()) {
        return -1;
      }
      if (num1.toNumber()  < num2.toNumber()) {
        return 1;
      }
    });
    this.showTiposPagos = true;
    this._alertService.getSkuBlock();
    this.confirmRetirarEfectivo();
  }

  confirmRetirarEfectivo() {
    const arqueoRequest = new LecturaCaja();
    if (this.pagoBack) {
      arqueoRequest.lecturasTotales = this.pagoBack;
      arqueoRequest.lecturasTotales.forEach(item => {
        if (item.informacionAsociadaFormaPago.codigoFormaPago === TipoPago.efectivo) {
          item.importeFisico = this.totalRetiro;
          item.importeRetiro = this.Importe;
          item.informacionAsociadaDenominaciones = new Array<DenominacionesModel>();
          this.pagos.forEach(denom => {
            if (!denom.cantidad) {
              denom.cantidad = 0;
            }
            if (!denom.monto) {
              denom.monto = 0;
            }
            if (!denom.valorDenominacion) {
              denom.valorDenominacion = 0;
            }
            item.informacionAsociadaDenominaciones.push(denom.getDenominaciones());
          });
        }
      });
    } else {
      arqueoRequest.lecturasTotales = [];
    }
    if (this.TipoCorte === TipoCorte.corteX && !this.Caja) {
      if (this.pagoBack) {
        this.retiroService.ejecutarArqueoCaja(arqueoRequest).subscribe(data => {
          if (Number(data.codeNumber) === 365) {
            this._alertService.show({titulo: 'Milano', tipo: 'success', mensaje: data.codeDescription});
          } else {
            this._alertService.show({titulo: 'Error', tipo: 'error', mensaje: data.codeDescription});
          }
        });
      }
    } else if (this.TipoCorte === TipoCorte.corteZ && this.Caja) {
      //ajustes fin dia
      arqueoRequest.codigoCaja = this.Caja;
        this._iniciofinService.lecturaZFinDiaService(arqueoRequest).subscribe(data => {
          if (Number(data.codeNumber) === 365) {
            this._alertService.show({titulo: 'Milano', tipo: 'success', mensaje: data.codeDescription});
            this._iniciofinService.finDiaService().subscribe(
              resp => {
               if (resp) {
                  this.finDiaInstance.capturaLuz = resp.requiereCapturarLuz;
                  this.finDiaInstance.cajas = [];
                  this.finDiaInstance.validacionCajas = resp.resultadosValidacionesCajas;
                  this.finDiaInstance.validacionCajasEjec = resp.finDiaPermitido;
                  this.finDiaInstance.validacion = true;
                  this.finDiaInstance.clave = this.clave;
                  this.finDiaInstance.fetch((data) => {
                     this.finDiaInstance.cajas = data;
                  });
               } else {
                  this._alertService.show({titulo: 'Milano', tipo: 'info', mensaje: resp.mensajeAsociado});
                }
              });
          } else {
            this._alertService.show({titulo: 'Error', tipo: 'error', mensaje: data.codeDescription});
          }
        });
    } else {
      this.retiroService.ejecutarCorteCaja(arqueoRequest).subscribe(data => {
        if (Number(data.codeNumber) === 365) {
          this._alertService.show({titulo: 'Milano', tipo: 'success', mensaje: data.codeDescription});
        } else {
          this._alertService.show({titulo: 'Error', tipo: 'error', mensaje: data.codeDescription});
        }
      });
    }
  }

  closeModal() {
    this.modalRef.hide();
    this.unblock();
  }

    unblock() {
      const elements = Array.prototype.slice.call(document.querySelectorAll('INPUT, BUTTON,SELECT,A, .btn_funcion'));
      elements.forEach(elem => {
        if (!elem.hasAttribute('hidden')) {
          elem.setAttribute('wasDisabled', 'false');
        }

      });
      this._alertService.unBlockElements();
    }
  editTotal() {
    this.totalRetiro = 0;
    let totalconFondo = 0;
    this.pagos.forEach( pago => {
     this.totalRetiro = new Decimal(this.totalRetiro).plus(pago.monto).toNumber();
    });
    if (this.total >= 0 && this.TipoCorte == TipoCorte.corteZ) {
      this.totalRestante = new Decimal(this.totalRetiro).minus(this.total).toNumber();
    } if (this.total >= 0 && this.TipoCorte == TipoCorte.corteX) {
      totalconFondo = new Decimal(this.total).plus(this.totalFondoFijo).toNumber();
      this.totalRestante = new Decimal(totalconFondo).minus(this.totalRetiro).toNumber() * -1;
    }
  }

    seleccionar(pago, index) {
      this.rowSelector.currentSelection = index;
      this.setSelectedItem(pago, index);
      setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
    }

    seleccionarTipo(forma, index) {
      this.rowSelectorT.currentSelection = index;
      this.setSelectedItem(forma, index);
      setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
    }

    setSelectedItem(pago, index: any): any {

    if (!this.showTiposPagos) {
      this.pago = pago || this.pagos[index];
      this.rowSelector.currentSelection = index;
    } else {
      this.rowSelectorT.currentSelection = index;
      this.forma = pago || this.tipoPagos[index];
    }
      setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);

  }

}


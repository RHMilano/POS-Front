import {Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {FlujoBloqueo, GLOBAL, OrigenPago, PagosOps, TipoCabeceraTotalizar, TipoVenta} from '../../shared/GLOBAL';
import {ShowPagosRequest} from '../../Models/Pagos/Pagos.model';
import {DataTransferService} from '../../services/data-transfer.service';
import {SalesService} from '../../services/sales.service';
import {ConfigPosService} from '../../services/config-pos.service';
import {ConfigGeneralesCajaTiendaResponse} from '../../Models/General/ConfigGeneralesCajaTiendaResponse.model';
import {GeneralService} from '../../services/general.service';
import {GetEmployeeMilanoResponseModel} from '../../Models/Sales/GetEmployeeMilanoResponse.model';
import {GetMayoristaMilanoResponseModel} from '../../Models/Sales/GetMayoristaMilanoResponse.model';
import {Router} from '@angular/router';
import {
  BtnAmericanExpress,
  BtnCreditoDebito,
  BtnCreditoDebito2,
  BtnEfectivo,
  BtnFiLag,
  BtnFinanciamiento,
  BtnMonedaExtranjera,
  BtnNotasDeCredito,
  BtnRedencionCupones,
  BtnTarjetaMM,
  BtnTarjetaRegalo,
  BtnVales,
  BtnPinPadMovil,
  BtnTransferenciaBancaria,
  BtnPagoLealtad
} from './FormasPagoBtnConfig';
import {PagosMasterService} from '../../services/pagos-master.service';
import {FormasPagoMenuComponentInterface} from '../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {TicketVirtualEmpleadoComponentInterface} from '../../Models/FrontEnd/TicketVirtualEmpleadoComponentInterface';
import {TicketVirtualMayoristaComponentInterface} from '../../Models/FrontEnd/TicketVirtualMayoristaComponentInterface';
import {TicketVirtualComponentInterface} from '../../Models/FrontEnd/TicketVirtualComponentInterface';


@Component({
  selector: 'app-formas-pago-menu',
  templateUrl: './formas-pago-menu.component.html',
  styleUrls: ['./formas-pago-menu.component.css'],
  providers: [SalesService]
})

export class FormasPagoMenuComponent implements OnInit, OnDestroy {

  @Input() currentTotalizarInfo: ShowPagosRequest;
  @Input() ticketVirtualInstance: TicketVirtualComponentInterface | TicketVirtualEmpleadoComponentInterface | TicketVirtualMayoristaComponentInterface;
  @ViewChild('cashBackTemplate') cashBackTemplate: TemplateRef<any>;
  pagosToRender = [];
  showingChilds = false;
  modalRef: BsModalRef;
  botonesSub;
  inEnd = false;
  currentPage = 1;
  itemsPerPage = 5;
  origenPago: OrigenPago = OrigenPago.normal;
  secuencia = 1;
  currentConfig: ConfigGeneralesCajaTiendaResponse;
  currentEmployee: GetEmployeeMilanoResponseModel;
  currentMayorista: GetMayoristaMilanoResponseModel;
  currentTipoVenta: TipoVenta;
  aceptarFinanciamiento: boolean;
  pagoFinanciamientoAgregado: boolean;

  pagosList = [
    BtnEfectivo,
    BtnTarjetaMM,
    BtnCreditoDebito,
    BtnCreditoDebito2,
    BtnAmericanExpress,
    BtnTarjetaRegalo,
    BtnFinanciamiento,
    BtnVales,
    BtnMonedaExtranjera,
    BtnNotasDeCredito,
    BtnRedencionCupones,
    BtnFiLag,
    BtnPinPadMovil,
    BtnTransferenciaBancaria,
    BtnPagoLealtad //? OCG Transferencia bancaria 
  ];


  constructor(public modalService: BsModalService, public _dataTransfer: DataTransferService, public _salesService: SalesService,
              public _configService: ConfigPosService, public generalService: GeneralService, public _router: Router, public _pagosMaster: PagosMasterService) {

  }

  ngOnInit() {
    this.currentTipoVenta = this.ticketVirtualInstance.tipoVenta;
    this.currentConfig = this._configService.currentConfig;
    if (!('pagoInfo' in this.currentTotalizarInfo)) {
      this.origenPago = OrigenPago.tarjetaCmm;
    } else if ('totalizarApartado' in this.currentTotalizarInfo && this.currentTotalizarInfo.totalizarApartado.folioOperacion !== ''
      && this.currentTotalizarInfo.totalizarApartado !== undefined) {
      this.origenPago = OrigenPago.apartado;
    }

    let tmpComp;
    switch (this.currentTipoVenta) {
      case TipoVenta.VentaEmpleado:
        tmpComp = <TicketVirtualEmpleadoComponentInterface>this.ticketVirtualInstance;
        this.currentEmployee = tmpComp.selectedEmployee;
        //this.aceptarFinanciamiento = true;
        break;
      case TipoVenta.devoluciones:
        if (this.ticketVirtualInstance.FormasPagoInstance.totalVentaRequest.cabeceraVentaAsociada.codigoTipoCabeceraVenta === TipoCabeceraTotalizar.ventaEmpleado)  {
          tmpComp = <TicketVirtualEmpleadoComponentInterface>this.ticketVirtualInstance;
          this.currentEmployee = tmpComp.selectedEmployee;
        } else if (this.ticketVirtualInstance.FormasPagoInstance.totalVentaRequest.cabeceraVentaAsociada.codigoTipoCabeceraVenta === TipoCabeceraTotalizar.ventaMayorista) {
          tmpComp = <TicketVirtualMayoristaComponentInterface>this.ticketVirtualInstance;
          this.currentMayorista = tmpComp.selectedMayorista;
          this.aceptarFinanciamiento = true;
        } else {
          tmpComp = <TicketVirtualComponentInterface>this.ticketVirtualInstance;
        }
        break;
      case TipoVenta.VentaMayorista:
        tmpComp = <TicketVirtualMayoristaComponentInterface>this.ticketVirtualInstance;
        this.currentMayorista = tmpComp.selectedMayorista;
        this.aceptarFinanciamiento = true;
        break;
    }

    // this.botonesSub = this._dataTransfer.$coordinadorFuncionesBotoneraPagos.subscribe(tipo => {
    this.botonesSub = this._dataTransfer.$coordinadorFuncionesBotoneraPagos.subscribe(tipo => {
      this.selectOperation(tipo);
    });

    this._dataTransfer.$setFormasDePagoMenuInstance.next(this);

    this.selectOperation('reset');
    this.showItems(1);

    //const test = "hola";

  }

  centroPagosRule() {
    const aditionalOperations = [];

    const totalizarInfo = this.currentTotalizarInfo.totalizarInfo || this.currentTotalizarInfo.totalizarApartado;

    const BreakException = {};

    this.pagosList.forEach(btn => {

      try {
        btn.tipoPago.split(',').forEach(identificadorFormaPago => {

          if (btn.name === PagosOps.monedaExtranjera) {
            btn.enabled = totalizarInfo.informacionAsociadaFormasPagoMonedaExtranjera.find(formaPago => formaPago.identificadorFormaPago === identificadorFormaPago) ? true : false;
          } else {
            btn.enabled = totalizarInfo.informacionAsociadaFormasPago.find(formaPago => formaPago.identificadorFormaPago === identificadorFormaPago) ? true : false;
          }

          if (btn.enabled === true) {
            throw BreakException;
          }

        });

      } catch (e) {
      }

    });

    if (this.aceptarFinanciamiento) {

      if (this.pagoFinanciamientoAgregado) {
        aditionalOperations.push({
          boton: PagosOps.financiamento,
          action: 'disabled',
          dontHidde: true
        });
      } else {
        this.bloqueaBtn(FlujoBloqueo.iniciaFinanciamiento);
        //return;
      }

    }

    [...aditionalOperations].forEach(operation => this.selectOperation(operation));

  }


  ngOnDestroy() {
    this.botonesSub.unsubscribe();
  }

  closeModal() {
    this.modalRef.hide();
  }

  cancelPay() {
    this.closeModal();
  }

  bloqueaBtn(flujoBloqueo?: FlujoBloqueo) {

    if (!flujoBloqueo) { // comportamiento por defecto
      this.selectOperation({boton: PagosOps.financiamento, action: 'disabled', dontHidde: true});
    }

    switch (flujoBloqueo) {
      case FlujoBloqueo.efectivoAgregado:
        this.selectOperation({boton: PagosOps.efectivo, action: 'disabled', dontHidde: true});
        break;
      case FlujoBloqueo.iniciaFinanciamiento:
        /*
        this.pagosList.forEach(x => {
          x.enabled = false;
        });
        */
        this.selectOperation({boton: PagosOps.financiamento, action: 'enabled', dontHidde: true});
        break;
      case FlujoBloqueo.financiamientoAgregado:
        if (this._pagosMaster.PagosMaster.totales.totalTicketLast > 0) {
          this.pagosList.forEach(x => {
            x.enabled = true;
          });
          this.selectOperation({boton: PagosOps.financiamento, action: 'disabled', dontHidde: true});
          this.centroPagosRule();
        }
        break;
      case FlujoBloqueo.efectivoEliminado:
        this.selectOperation({boton: PagosOps.efectivo, action: 'enabled', dontHidde: true});
        break;
    }

  }


  /*
    ====> METODOS  dedicados a la botonera
   */
  showItems(page: number) {

    const end = ((page * this.itemsPerPage) - 1) >= this.pagosList.length ? this.pagosList.length - 1 : ((page * this.itemsPerPage) - 1);
    const beg = (page - 1) * this.itemsPerPage;

    this.pagosToRender = [];

    for (let i = beg; i <= end; i++) {
      this.pagosToRender.push(this.pagosList[i]);
    }

    if (((page * this.itemsPerPage)) >= this.pagosList.length) {
      this.inEnd = true;
    }

    if (page === 1) {
      this.inEnd = false;
    }

    const fd = this.inEnd ? 'left' : 'right';
    const ad = this.inEnd ? '←' : '→';

      this.pagosToRender.push({
        name: PagosOps.masFunciones,
        tecla: ad,
        imagen: 'fa fa-angle-double-' + fd + ' bt-flecha',
        enabled: true,
        visible: true,
        handler: (conf) => {

          if (this.inEnd) {
            this.currentPage = this.currentPage - 1;
          } else {
            this.currentPage = this.currentPage + 1;
          }
          this.showItems(this.currentPage);
        },
        clase: 'btn_funcion_control',
        subfunciones: []
      });
  }

  selectOption(item: any) {
    if (item.enabled) {
      item.handler.bind(this)(item);
    }
  }

  selectOperation(tipo: any) {

    if (tipo === 'reset') {
      this.pagosList.forEach(func => {
        func.enabled = func.default.enabled;
        func.visible = func.default.visible;
      });

      this.centroPagosRule();


    } else {
      const status = tipo.action === 'enabled';
      const visible = tipo.dontHidde;

      this.pagosList.forEach(func => {
        if (func.name === tipo.boton) {
          func.enabled = status;
          func.visible = visible;
        }
      });
    }
  }

  blockPagos() {
    this.pagosList.forEach(func => {
      func.enabled = false;
      func.visible = func.default.visible;
    });
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {

    const keyCode = event.which || event.keyCode;

    if (this.modalService.getModalsCount() >= 1) {
      return;
    }

    if (keyCode === 39) {
      this.currentPage = this.currentPage + 1 >= Math.ceil(this.pagosList.length / this.itemsPerPage) ?
        Math.ceil(this.pagosList.length / this.itemsPerPage) : this.currentPage + 1;
    } else if (keyCode === 37) {
      if (!this.showingChilds) {
        this.currentPage = this.currentPage - 1 <= 0 ? 1 : this.currentPage - 1;
      }
    } else if (this.showingChilds) {
      this.pagosList.forEach(item => {
        if (item.tecla === event.code) {
          item.handler.bind(this)(item);
        }
      });
    } else {
      this.pagosList.forEach((item, key) => {
        if (item.tecla === event.code && item.enabled) {
          this.currentPage = Math.ceil((key + 1) / this.itemsPerPage);
          item.handler.bind(this)(item);
        }
      });
    }
    if (keyCode === 37) {
      // this.reset();
    }

    this.showItems(this.currentPage);


    const preventDefaults = ['112', '113', '114', '115', '116', '117', '118', '119', '120', '121'];
    if ((event.which || event.keyCode) && GLOBAL.includesAny((event.which || event.keyCode).toString(), preventDefaults)) {
      if (this.showingChilds) {
        if (keyCode === 37) {
          this.showingChilds = false;
          this.showItems(this.currentPage);
        }
      } else {
        this.showItems(this.currentPage);
      }
      event.preventDefault();
    }
  }

  /*
    ====> METODOS  dedicados a la botonera
   */

}

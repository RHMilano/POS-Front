import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TicketVirtualComponent } from '../ticket-virtual/ticket-virtual.component';
import { ConfigPosService } from '../../services/config-pos.service';
import { MsgService } from '../../services/msg.service';
import { AlertService } from '../../services/alert.service';
import { GeneralService } from '../../services/general.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SalesService } from '../../services/sales.service';
import { FlujoBloqueo, TipoCabeceraTotalizar, TipoVenta } from '../../shared/GLOBAL';
import { VentaResponse } from '../../Models/Sales/VentaResponse';
import { AuthService } from '../../services/auth.service';
import { CargaVentaResponseService } from '../../services/carga-venta-response.service';
import { VentaResponseModel } from '../../Models/Sales/VentaResponse.model';
import { TicketVirtual } from '../ticket-virtual/TicketVirtual';
import { GetMayoristaMilanoResponseModel } from '../../Models/Sales/GetMayoristaMilanoResponse.model';
import { GetEmployeeMilanoResponseModel } from '../../Models/Sales/GetEmployeeMilanoResponse.model';
import { Decimal } from 'decimal.js';
import { TotalizarVentaResponseModel } from '../../Models/Sales/TotalizarVentaResponse.model';
import { TicketRow } from '../ticket-virtual/TicketRow';
import {TotalizarVentaRequest} from '../../Models/TotalizarVentaRequest';

@Component({
  selector: 'app-ticket-virtual-devolucion',
  templateUrl: './ticket-virtual-devolucion.component.html',
  styleUrls: ['./ticket-virtual-devolucion.component.css'],
  providers: [SalesService, GeneralService]
})
export class TicketVirtualDevolucionComponent extends TicketVirtualComponent implements OnDestroy, OnInit, AfterViewInit {


  @ViewChild('devolucionTemplate') devolucionTemplate: TemplateRef<any>;
  @ViewChild('devolucionDiferenciaTemplate') devolucionDiferenciaTemplate: TemplateRef<any>;
  @ViewChild('skuInput') skuInput: ElementRef;
  @ViewChild('btnAceptarDev') btnAceptarDev: ElementRef;


  mayoristaInfo: GetMayoristaMilanoResponseModel;
  selectedMayorista: GetMayoristaMilanoResponseModel;


  employeeInfo: GetEmployeeMilanoResponseModel;
  selectedEmployee: GetEmployeeMilanoResponseModel;

  modalRefBuscaFolio: BsModalRef;
  folioVentaDevolucion;
  ticketDevolucion: VentaResponse;

  currentSelectionDevolucion: number;

  diferenciaDevolucion: Decimal;

  constructor(_generalService: GeneralService, _alertService: AlertService, _salesService: SalesService,
              _dataTransfer: DataTransferService, _msgService: MsgService, _modalService: BsModalService,
              public _router: Router, _configService: ConfigPosService, _authService: AuthService, _cargaVentaService: CargaVentaResponseService) {
    super(_generalService, _alertService, _salesService, _dataTransfer, _msgService, _modalService, _configService, _authService, _cargaVentaService, _router);

  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    super.ngOnInit();
    this.tipoVenta = TipoVenta.devoluciones;

    setTimeout(() => {
      this.ingresaFolioVenta();
      this.bloqueaBotones(FlujoBloqueo.inicioDevoluciones);
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }


  ingresaFolioVenta() {

    this.modalRefBuscaFolio = this._modalService.show(
      this.devolucionTemplate, {'class': 'modal-sm', ignoreBackdropClick: true}
    );

    this._modalService.onHidden.take(1).subscribe(
      (value) => {
        if (!this.folioVentaDevolucion || !this.ticketDevolucion.lineasTicket.length) {
          this._router.navigate(['/POS']);
        }
      }
    );
  }

  aceptarTicketDevolucion() {
    this._salesService.validarDevolucion(this.folioVentaDevolucion).subscribe(
      resp => {
        //debugger;
        this.ticketDevolucion = resp;
        if (resp.lineasTicket.length) {
          this.isModoDevolucion = true;
          this.cargaVentaResponse(resp);
          this.modalRefBuscaFolio.hide();
        } else {
          this._alertService.show({
            titulo: 'Milano',
            mensaje: 'Ticket no encontrado',
            tipo: 'warning'
          });
        }
      }
    );
  }

  cancelarDevolucion() {
    this.bloqueaBotones(FlujoBloqueo.medioTotalizar);
    this.modalRefBuscaFolio.hide();
    this._router.navigate(['/POS']).then();
  }

  initCabeceraVenta() {
    this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = this.getCabecera();
    this.ticketVirtual.cabeceraVenta.codigoEmpleadoVendedor = this.empleadoVendedorSeleccionado ? this.empleadoVendedorSeleccionado.code : 0;
    if (this.selectedMayorista) {
      this.ticketVirtual.cabeceraVenta.codigoMayorista = this.selectedMayorista.codigoMayorista;
      this.ticketVirtual.cabeceraVenta.nombreMembresia = this.selectedMayorista.nombre;
    }
    if (this.employeeInfo) {
      this.ticketVirtual.cabeceraVenta.numeroNominaVentaEmpleado = this.employeeInfo.codigo;
      this.ticketVirtual.cabeceraVenta.nombreMembresia = this.employeeInfo.nombre + ' ' + this.employeeInfo.apellidoPaterno + ' ' + this.employeeInfo.apellidoMaterno;
    }
  }


  cargaVentaResponse(venta: VentaResponseModel) {
    this.ticketVirtual = new TicketVirtual(venta);

    if (venta.informacionEmpleadoVendedor) {
      this._dataTransfer.$vendedorTicketVirtual.next(venta.informacionEmpleadoVendedor);
    }

    if (venta.informacionMayorista) {
      this.mayoristaInfo = venta.informacionMayorista;
      this.selectedMayorista = Object.assign({}, this.mayoristaInfo);
    }

    if (venta.informacionEmpleadoMilano) {
      this.employeeInfo = venta.informacionEmpleadoMilano;
      this.selectedEmployee = Object.assign({}, this.employeeInfo);
    }


    this.$articuloAgregado.next(true);

    this.initCabeceraVenta();

    this._cargaVentaService.ventaResponse = null;
    setTimeout(() => {
      this.clearSeachField();
      this.bloqueaBotones();
    }, 100);
  }


  getCabecera(): TipoCabeceraTotalizar {
    return this.ticketDevolucion.codigoTipoCabeceraVenta;
  }

  checkDevolucionFavor(): boolean {

    this.ticketVirtual.isTotalizado = false;

    const diferenciaFavor = new Decimal(this.ticketVirtual.totalTicketFavorDiferencia);


    if (diferenciaFavor.greaterThan(0)) {// saldo a favor, pero no se regresa

      this.diferenciaDevolucion = diferenciaFavor;
      this.modalRefBuscaFolio = this._modalService.show(
        this.devolucionDiferenciaTemplate, {'class': 'modal-dialogCenter', ignoreBackdropClick: true}
      );


      return;
    } else {
      this.sendTotalizarRequest();
    }
  }


  checkDevolucionAfterTotalizar(response: TotalizarVentaResponseModel, totalizarRequest: TotalizarVentaRequest) {

    if (response.informacionAsociadaDevolucion && Number(response.informacionAsociadaDevolucion.codeNumber) === 399) {

      /*this._salesService.CerrarDevolucion(totalizarRequest).subscribe( resp => {
        if (Number(resp.codeNumber) === 100) {
          this._alertService.show({tipo: 'success', titulo: 'Milano', mensaje: response.informacionAsociadaDevolucion.codeDescription});
          this._router.navigate(['/POS']).then(
            () => {
              this.clearSeachField();
            }
          );
        } else {
          this._alertService.show({tipo: 'error', titulo: 'Milano', mensaje: response.informacionAsociadaDevolucion.codeDescription});
        }
      });*/
      this._alertService.show({tipo: 'success', titulo: 'Milano', mensaje: response.informacionAsociadaDevolucion.codeDescription});
      this._router.navigate(['/POS']).then(
        () => {
          this.clearSeachField();
        }
      );
    } else {
      this.showFormasPagoTotalizar();
    }

  }

  declinePerderDiferencia() {
    this.bloqueaBotones(FlujoBloqueo.medioTotalizar);
    this.modalRefBuscaFolio.hide();
  }

  aceptarPerderDiferencia() {
    this.modalRefBuscaFolio.hide();
    this.sendTotalizarRequest();
  }


  resetTicket() {
    this._router.navigate(['/POS']).then(
      () => {
        this.clearSeachField();
      }
    );
  }


  getSelectedItemDevolucion(selectedItem: {
    item: TicketRow, index: number
  }) {

    const articulo = selectedItem.item.lineaTicket.articulo;

    this.currentSelectionDevolucion = selectedItem.index;
    this.ticketVirtual.currentSelectionDevolucion = selectedItem.index;

    this._dataTransfer.$detalleProducto.next({
      itemSku: articulo.sku.toString(),
      itemEstilo: articulo.estilo,
      itemPrice: articulo.precioConImpuestos,
      itemImageUrl: articulo.rutaImagenLocal
    });

  }


  terminarDevolucion() {

    this.isModoDevolucion = false;
    this.bloqueaBotones(FlujoBloqueo.finDevoluciones);
    setTimeout(() => this.focusOnSkuInput(), 100);

  }

  devolucionAgregada(): boolean {
    return this.ticketVirtual.ticketRowDevolucion.find(ticketRow => ticketRow.lineaTicket.cantidadDevuelta > 0) !== undefined;
  }


  /** Override de callbacks de teclado **/


  selectRowUp() {

    const lastRow = this.ticketVirtual.ticketRowDevolucion.length - 1;

    if (this.currentSelectionDevolucion === 0) {
      this.currentSelectionDevolucion = lastRow;
    } else if (this.currentSelectionDevolucion >= 0) {
      this.currentSelectionDevolucion--;
    } else {
      this.currentSelectionDevolucion = 0;
    }
    this.applySelectionFromKeyboardDev();

  }

  selectFirstRow() {
    if (!this.currentSelectionDevolucion && this.currentSelectionDevolucion !== 0) {
      this.currentSelectionDevolucion = 0;
      this.applySelectionFromKeyboardDev();
    } else {
      this.ticketVirtual.getSelectedTicketRowDevolucion().articuloComponentInstance.setFocusOnQty();
    }
  }

  selectRowDown() {

    const lastRow = this.ticketVirtual.ticketRowDevolucion.length - 1;

    if (this.currentSelectionDevolucion === lastRow) {
      this.currentSelectionDevolucion = 0;
    } else if (this.currentSelectionDevolucion >= 0) {
      this.currentSelectionDevolucion++;
    } else {
      this.currentSelectionDevolucion = 0;
    }

    this.applySelectionFromKeyboardDev();
  }

  isLastRow(): boolean {
    const lastRow = this.ticketVirtual.ticketRowDevolucion.length - 1;
    return lastRow === this.currentSelectionDevolucion;
  }

  isFirstRow(): boolean {
    return this.currentSelectionDevolucion === 0;
  }

  jumpFocusToNextElement(): any {
    setTimeout(() => {
      if (this.isModoDevolucion) {
        this.btnAceptarDev.nativeElement.focus();
      } else {
        this.skuInput.nativeElement.focus();
      }
    });
  }

  jumpFocusToPrevElement(): any {
    setTimeout(() => this.skuInput.nativeElement.focus(), 0);
  }

  private applySelectionFromKeyboardDev() {
    this.ticketVirtual.currentSelectionDevolucion = this.currentSelectionDevolucion;
  }
}


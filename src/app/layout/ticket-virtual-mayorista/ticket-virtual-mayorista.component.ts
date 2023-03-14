import { AfterViewInit, Component, ContentChild, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { GeneralService } from '../../services/general.service';
import { AlertService } from '../../services/alert.service';
import { SalesService } from '../../services/sales.service';
import { MsgService } from '../../services/msg.service';
import { TicketVirtualComponent } from '../ticket-virtual/ticket-virtual.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { GetMayoristaMilanoResponseModel } from '../../Models/Sales/GetMayoristaMilanoResponse.model';
import { FlujoBloqueo, TipoCabeceraTotalizar, TipoCancelacionVenta, TipoVenta } from '../../shared/GLOBAL';
import { Router } from '@angular/router';
import { ConfigPosService } from '../../services/config-pos.service';
import { AuthService } from '../../services/auth.service';
import { SuspenderVentaRequest } from '../../Models/Sales/SuspenderVentaRequest';
import { CargaVentaResponseService } from '../../services/carga-venta-response.service';
import { TicketVirtual } from '../ticket-virtual/TicketVirtual';
import { VentaResponseModel } from '../../Models/Sales/VentaResponse.model';
import { TicketVirtualMayoristaComponentInterface } from '../../Models/FrontEnd/TicketVirtualMayoristaComponentInterface';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';
import { BusquedaMayoristaComponent } from '../busqueda-mayorista/busqueda-mayorista.component';

@Component({
  selector: 'app-ticket-virtual-mayorista',
  templateUrl: './ticket-virtual-mayorista.component.html',
  styleUrls: ['./ticket-virtual-mayorista.component.css'],
  providers: [GeneralService, SalesService]
})
export class TicketVirtualMayoristaComponent extends TicketVirtualComponent implements OnInit, OnDestroy, AfterViewInit, TicketVirtualMayoristaComponentInterface {

  mayoristaInfo: GetMayoristaMilanoResponseModel;
  selectedMayorista: GetMayoristaMilanoResponseModel;
  modalRefMayorista: BsModalRef;
  subscriptions: Subscription[] = [];
  articuloAgregadoMayoristaSub;
  suspenderRequest = new SuspenderVentaRequest();

  @ViewChild('busquedaMayoristaTmpl') busquedaMayoristaTmpl: TemplateRef<any>;
  @ViewChild('skuInput') skuInput: ElementRef;

  @ContentChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ContentChild('modalFocusReference') modalFocusReference: ModalFocusDirective;

  constructor(_generalService: GeneralService, _alertService: AlertService, _salesService: SalesService,
              _dataTransfer: DataTransferService, _msgService: MsgService, _modalService: BsModalService,
              public _router: Router, _configService: ConfigPosService, _authService: AuthService, _cargaVentaService: CargaVentaResponseService) {

    super(_generalService, _alertService, _salesService, _dataTransfer, _msgService, _modalService, _configService, _authService, _cargaVentaService, _router);

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    super.ngOnInit();


    this.subscriptions.push(this._modalService.onHidden.subscribe(($event: any) => {
      if ($event !== TipoCancelacionVenta.cancelacionTicket && !this.selectedMayorista) {

        if (this.selectedMayorista) {
          this.modalRefMayorista.hide();
        } else {
          this._router.navigate(['/POS']).then();
        }


      } else if ($event === TipoCancelacionVenta.cancelacionTicket) {
        this.seleccionarMayorista();
      }
      this._modalService.setDismissReason(null);
      this._dataTransfer.$funcionesBotoneraSwitch.next(true);
    }));

    this.subscriptions.push(this._modalService.onShow.subscribe(() => {
      this._dataTransfer.$funcionesBotoneraSwitch.next(false);
    }));


    this.tipoVenta = TipoVenta.VentaMayorista;
    setTimeout(() => {
      if (!this.mayoristaInfo) {
        this.seleccionarMayorista();
      }
      this.bloqueaBotones(FlujoBloqueo.inicioVentaMayorista);
    });
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });

    if (this.modalRefMayorista) {
      this.modalRefMayorista.hide();
    }

    // this.articuloAgregadoMayoristaSub.unsubscribe();
  }


  seleccionarMayorista() {
    if (this.articuloAgregado) {
      return;
    }

    this.mayoristaInfo = null;

    const initialState = {ticketVirtualMayoristaInstance: this};

    this.modalRefMayorista = this._modalService.show(
      BusquedaMayoristaComponent, {'class': 'modal-lg', ignoreBackdropClick: true, initialState}
    );
  }


  aceptarMayorista() {
    this.seleccionaVendedor();
  }

  resetTicket() {
    this._router.navigate(['/POS']).then(
      () => {
        this.clearSeachField();
      }
    );
  }

  initCabeceraVenta() {
    this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.ventaMayorista;
    this.ticketVirtual.cabeceraVenta.codigoMayorista = this.selectedMayorista.codigoMayorista;
    this.ticketVirtual.cabeceraVenta.nombreMembresia = this.selectedMayorista.nombre;
    this.ticketVirtual.cabeceraVenta.codigoEmpleadoVendedor = this.empleadoVendedorSeleccionado ? this.empleadoVendedorSeleccionado.code : 0;

  }


  suspenderModal() {
    this.modalRef = this._modalService.show(this.suspenderTemplate, {'class': 'modal-dialogCenter'});
  }

  suspenderTransaccion() {

    this.ticketVirtual.calculateTotal();
    this.initCabeceraVenta();

    this.suspenderRequest.cabeceraVentaAsociada = this.ticketVirtual.cabeceraVenta;

    this._salesService.SuspenderVentaService(this.suspenderRequest).subscribe(
      resp => {
        if (Number(resp.codeNumber) === 308) {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Transacción suspendida correctamente'});
          this.modalRef.hide();
          this.resetTicket();
        } else {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: resp.codeDescription});
        }
      }
    );
  }

  cargaVentaResponse(venta: VentaResponseModel) {

    this.ticketVirtual = new TicketVirtual(venta);

    this.$articuloAgregado.next(true);

    if (venta.informacionEmpleadoVendedor) {
      this._dataTransfer.$vendedorTicketVirtual.next(venta.informacionEmpleadoVendedor);
    }


    if (venta.informacionMayorista) {
      this.mayoristaInfo = venta.informacionMayorista;
      this.selectedMayorista = Object.assign({}, this.mayoristaInfo);
    }

    this.initCabeceraVenta();

    this._cargaVentaService.ventaResponse = null;
    setTimeout(() => {
      this.clearSeachField();
      this.bloqueaBotones();
    }, 100);
  }

}

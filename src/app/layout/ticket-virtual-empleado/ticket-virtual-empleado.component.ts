import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { SalesService } from '../../services/sales.service';
import { TicketVirtualComponent } from '../ticket-virtual/ticket-virtual.component';
import { MsgService } from '../../services/msg.service';
import { AlertService } from '../../services/alert.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ConfigPosService } from '../../services/config-pos.service';
import { GetEmployeeMilanoResponseModel } from '../../Models/Sales/GetEmployeeMilanoResponse.model';
import { Subscription } from 'rxjs/Subscription';
import { FlujoBloqueo, TipoCabeceraTotalizar, TipoCancelacionVenta, TipoVenta } from '../../shared/GLOBAL';
import { AuthService } from '../../services/auth.service';
import { SuspenderVentaRequest } from '../../Models/Sales/SuspenderVentaRequest';
import { CargaVentaResponseService } from '../../services/carga-venta-response.service';
import { VentaResponseModel } from '../../Models/Sales/VentaResponse.model';
import { TicketVirtual } from '../ticket-virtual/TicketVirtual';
import { TicketVirtualEmpleadoComponentInterface } from '../../Models/FrontEnd/TicketVirtualEmpleadoComponentInterface';

@Component({
  selector: 'app-ticket-virtual-empleado',
  templateUrl: './ticket-virtual-empleado.component.html',
  styleUrls: ['./ticket-virtual-empleado.component.css'],
  providers: [GeneralService, SalesService]
})
export class TicketVirtualEmpleadoComponent extends TicketVirtualComponent implements OnDestroy, OnInit, AfterViewInit, TicketVirtualEmpleadoComponentInterface {


  @ViewChild('busquedaEmpleadoTmpl') buscaEmplTmpl: TemplateRef<any>;
  @ViewChild('skuInput') skuInput: ElementRef;

  numeroEmpleado: number;
  employeeInfo: GetEmployeeMilanoResponseModel;
  selectedEmployee: GetEmployeeMilanoResponseModel;
  modalRefEmpleado: BsModalRef;
  subscriptions: Subscription[] = [];
  articuloAgregadoEmpleadoSub;
  suspenderRequest = new SuspenderVentaRequest();
  articuloAgregado: boolean;

  constructor(_generalService: GeneralService, _alertService: AlertService, _salesService: SalesService,
              _dataTransfer: DataTransferService, _msgService: MsgService, _modalService: BsModalService,
              public _router: Router, _configService: ConfigPosService, _authService: AuthService, _cargaVentaService: CargaVentaResponseService) {


    super(_generalService, _alertService, _salesService, _dataTransfer, _msgService, _modalService, _configService, _authService, _cargaVentaService, _router);

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    super.ngOnInit();
    this.validaDiaVenta();

    this.articuloAgregadoMainSub.unsubscribe(); // se elimina la subscripción del padre para evitar duplicados
    this.articuloAgregadoEmpleadoSub = this.$articuloAgregado.subscribe(agregado => this.articuloAgregado = agregado);


    this.subscriptions.push(this._modalService.onHidden.subscribe(($event: any) => {
      if ($event !== TipoCancelacionVenta.cancelacionTicket && !this.selectedEmployee) {
        this.cancelarVentaEmpleado();
      } else if ($event === TipoCancelacionVenta.cancelacionTicket) {
        this.seleccionarEmpleado();
      }
      this._modalService.setDismissReason(null);
      this._dataTransfer.$funcionesBotoneraSwitch.next(true);
    }));


    this.subscriptions.push(this._modalService.onShow.subscribe(() => {
      this._dataTransfer.$funcionesBotoneraSwitch.next(false);
    }));

    this.tipoVenta = TipoVenta.VentaEmpleado;

  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });

    if (this.modalRefEmpleado) {
      this.modalRefEmpleado.hide();
    }

    this.articuloAgregadoEmpleadoSub.unsubscribe();

  }

  cancelarVentaEmpleado() {
    if (this.selectedEmployee) {
      this.modalRefEmpleado.hide();
    } else {
      this._router.navigate(['/POS']).then();
    }
  }

  validaDiaVenta() {
    this._salesService.ValidaDiaVentaEmpleado().subscribe(resp => {
      if (resp) {
        this.seleccionarEmpleado();
        this.bloqueaBotones(FlujoBloqueo.inicioVentaEmpleado);
      } else {
        this._alertService.show({mensaje: 'Días no displonibles para Venta a Empleado', tipo: 'warning', titulo: 'Milano'});
        this._router.navigate(['/POS']).then();
      }
    });
  }

  seleccionarEmpleado() {
    if (this.articuloAgregado) {
      return;
    }

    this.employeeInfo = null;
    this.modalRefEmpleado = this._modalService.show(this.buscaEmplTmpl, {'class': 'modal-lg', ignoreBackdropClick: true});
  }


  validateEmpleado(): boolean {
    return this.numeroEmpleado ? !!this.numeroEmpleado.toString().length : false;
    //let strEmpleado:string;

    // strEmpleado = String(this.numeroEmpleado);

    // if(this.numeroEmpleado ){

    // }
    // else{
    //   return false;
    // }

  }

  empleadoOnEnter() {

    if (!this.validateEmpleado()) {
      return;
    }

    const logged = JSON.parse(localStorage.getItem('accessInfo'));

    this._salesService.GetEmployeeMilano(this.numeroEmpleado, 3215, logged.numeroCaja).subscribe(
      resp => {
        if (resp.codigo === 0) {
          this._alertService.show({mensaje: resp.mensaje, tipo: 'warning', titulo: 'Milano'});
        } else {
          this.employeeInfo = resp;

          // RAHC: SETEAR VARIABLE PARA COMPONENTE ticket-virtual.component.ts (QUITAR FORMA DE PAGO FINANCIAMIENTO)
          this.montoCreditoVtaEmp = resp.montoCredito;

          if (this.employeeInfo.montoCredito <= 0) {
            this._alertService.show({mensaje: 'Empleado no tiene Crédito Suficiente', tipo: 'error', titulo: 'Milano'});
          }
        }
      }
    );
  }

  aceptarEmpleado() {
    this.selectedEmployee = Object.assign({}, this.employeeInfo);
    this.modalRefEmpleado.hide();
  }

  resetTicket() {
    this._router.navigate(['/POS']).then(
      () => {
        this.clearSeachField();
      }
    );
  }

  initCabeceraVenta() {
    this.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta = TipoCabeceraTotalizar.ventaEmpleado;
    this.ticketVirtual.cabeceraVenta.numeroNominaVentaEmpleado = this.selectedEmployee.codigo;
    this.ticketVirtual.cabeceraVenta.nombreMembresia = `${this.selectedEmployee.nombre} ${this.selectedEmployee.apellidoPaterno} ${this.selectedEmployee.apellidoMaterno}`;
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

//    super.cargaVentaResponse(venta);

    this.ticketVirtual = new TicketVirtual(venta);

    this.$articuloAgregado.next(true);

    if (venta.informacionEmpleadoVendedor) {
      this._dataTransfer.$vendedorTicketVirtual.next(venta.informacionEmpleadoVendedor);
    }


    if (venta.informacionEmpleadoMilano) {
      this.employeeInfo = venta.informacionEmpleadoMilano;
      this.selectedEmployee = Object.assign({}, this.employeeInfo);
    }

    this.initCabeceraVenta();

    this._cargaVentaService.ventaResponse = null;
    setTimeout(() => {
      this.clearSeachField();
      this.bloqueaBotones();
    }, 100);
  }

}

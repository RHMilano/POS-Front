import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MsgService } from '../../services/msg.service';
import { AlertService } from '../../services/alert.service';
import { ApartadoResponse } from '../../Models/Apartados/ApartadoResponse';
import { Subscription } from 'rxjs/Subscription';
import { DataTransferService } from '../../services/data-transfer.service';
import { SalesService } from '../../services/sales.service';
import { Router } from '@angular/router';
import { EstatusApartado, EstatusApartadoLetras, TipoApartado, TiposProductos } from '../../shared/GLOBAL';
import Decimal from 'decimal.js';
import { PagoApartado } from '../../Models/Apartados/PagoApartado';
import { TotalizarApartadoResponseModel } from '../../Models/Apartados/TotalizarApartadoResponse.model';
import { BusquedaApartadoRequest } from '../../Models/Apartados/BusquedaApartadoRequest';
import { ConfigGeneralesCajaTiendaFormaPagoModel } from '../../Models/General/ConfigGeneralesCajaTiendaFormaPago.model';
import { RowSelectorConfig } from '../../Models/FrontEnd/RowSelectorInterface';
import { RowSelector } from '../../Models/FrontEnd/RowSelector';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';

@Component({
  selector: 'app-busqueda-apartado',
  templateUrl: './busqueda-apartado.component.html',
  styleUrls: ['./busqueda-apartado.component.css'],
  providers: [SalesService]
})
export class BusquedaApartadoComponent implements OnInit, OnDestroy, RowSelectorConfig {

  @ViewChild('cancelTemplate') cancelTemplate: TemplateRef<any>;

  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;
  selectedRow: number;
  tipoBusqueda: number;
  folioApartado: number;
  apartado;
  Folio: string;
  Nombre: string;
  Telefono: string;
  Monto: string;
  apartados: ApartadoResponse[] = [];
  modalSubscriptions: Subscription[] = [];
  _modalRef: BsModalRef;
  tipoApartadoSub;
  informacionAsociadaFormasPago: Array<ConfigGeneralesCajaTiendaFormaPagoModel>;
  informacionAsociadaFormasPagoMonedaExtranjera: Array<ConfigGeneralesCajaTiendaFormaPagoModel>;

  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  itemsPerPage = 5;
  totalItemsToPaginate: number;
  rowSelector: RowSelector;

  constructor(public modalRef: BsModalRef, private _msg: MsgService,
              public _dataTransfer: DataTransferService, private _router: Router,
              private _alertService: AlertService, private modalService: BsModalService,
              private serviceApartado: SalesService) {
  }

  ngOnInit() {
    /**Subcripción para modal de cancelación de apartado*/
    this.modalSubscriptions.push(this.modalService.onHidden.subscribe(($event: any, reason: string) => {
      this._modalRef = null;
    }));

    /**Subcripción  para tipo de apartado*/
    this.tipoApartadoSub = this._dataTransfer.$tipoApartado.subscribe(
      item => {
        this.tipoBusqueda = item;
      }
    );

  }

  ngOnDestroy(): void {
    this.modalSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.tipoApartadoSub.unsubscribe();
  }

  /**Método para cerrar el diálogo de busqueda de apartado*/
  closeModal() {
    this.modalRef.hide();
  }

  /**Método para cerrar el diálogo de cancelación de apartado*/
  closeModalCancel() {
    this._modalRef.hide();
    this.closeModal();
  }

  /**Métod que llama al servicio para buscar apartado */
  buscarApartado() {
    if (this.Folio || this.Nombre || this.Telefono) {
      this.selectedRow = null;
      const apartadorequest = new BusquedaApartadoRequest();
      apartadorequest.folioApartado = this.Folio;
      apartadorequest.nombre = this.Nombre;
      apartadorequest.telefono = this.Telefono;
      this.serviceApartado.BusquedaApartadoService(apartadorequest).subscribe(
        data => {
          this.apartados = [];
          this.informacionAsociadaFormasPago = data.informacionAsociadaFormasPago;
          this.informacionAsociadaFormasPagoMonedaExtranjera = data.informacionAsociadaFormasPagoMonedaExtranjera;
          if (data.Apartados.length) {
            data.Apartados.forEach(index => {
              if (index.estatus === EstatusApartadoLetras.Cancelado || index.estatus === EstatusApartadoLetras.Totalizado ||
                index.estatus === EstatusApartadoLetras.Liquidado || index.estatus === EstatusApartadoLetras.Cedido
                || index.estatus === EstatusApartadoLetras.Nuevo && this.tipoBusqueda === TipoApartado.Cancelacion) {
                if (this.Folio && !this.Nombre && !this.Telefono) {
                  this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Este folio no esta disponible'});
                  return;
                }
              } else if (index.estatus === EstatusApartadoLetras.Liquidado &&
                (this.tipoBusqueda === TipoApartado.Liquidacion || this.tipoBusqueda === TipoApartado.Abono)) {
                if (this.Folio && !this.Nombre && !this.Telefono) {
                  this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Este folio ya esta liquidado'});
                  return;
                }
              } else if (index.estatus === EstatusApartadoLetras.Cedido &&
                (this.tipoBusqueda === TipoApartado.Liquidacion || this.tipoBusqueda === TipoApartado.Abono)) {
                if (this.Folio && !this.Nombre && !this.Telefono) {
                  this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Este folio ya esta cedido'});
                  return;
                }
              } else if (index.estatus === EstatusApartadoLetras.Cancelado || index.estatus === EstatusApartadoLetras.Totalizado
                || index.estatus === EstatusApartadoLetras.Nuevo && (this.tipoBusqueda === TipoApartado.Abono)) {
                if (this.Folio && !this.Nombre && !this.Telefono) {
                  this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Este folio no esta disponible'});
                  return;
                }
              } else {
                switch (index.estatus) {
                  case EstatusApartadoLetras.Finalizado:
                    index.estatus = EstatusApartado.Vigente;
                    break;
                  case EstatusApartadoLetras.Totalizado:
                    index.estatus = EstatusApartado.Totalizado;
                    break;
                }
                const fechaVencimiento = index.fechaVencimiento.split(' ');
                index.fechaVencimiento = fechaVencimiento[0];
                const fechaCancelacion = index.fechaCancelacion.split(' ');
                index.fechaCancelacion = fechaCancelacion[0];
                const apartado = index;

                this.apartados.push(apartado);

                this.apartados.sort(function (a, b) {
                  if (a.folioApartado > b.folioApartado) {
                    return -1;
                  }
                  if (a.folioApartado < b.folioApartado) {
                    return 1;
                  }
                });

              }
            });
            this.totalItemsToPaginate = this.apartados.length;
            this.rowSelector = new RowSelector(this);

            setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);
            setTimeout(() => this.modalFocusReference.getElements(), 0);


          } else {
            this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Apartado no encontrado'});
          }
        }
      );
    }
  }


  onDomChange($event) {
    setTimeout(() => this.modalFocusReference.getElements(), 0);
  }

  /**Método para guardar el apartado seleccionado */
  seleccionar(apartado, folio, index) {
    this.rowSelector.currentSelection = index;
    this.setSelectedItem(apartado, null);
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
  }


  setSelectedItem(apartado, index: any): any {

    this.apartado = apartado || this.apartados[index];
    this.selectedRow = index;
    this.folioApartado = this.apartado.folioApartado;
    if (!this._modalRef && (this.tipoBusqueda !== TipoApartado.Abono)) {
      this.Monto = '0';
    }

    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);


  }

  /**Método para llamar servicio de cancelar apartado */
  cancelarApartado() {
    if (this.tipoBusqueda === TipoApartado.Abono && (!this.Monto || Number(this.Monto) <= 0)) {
      this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Capture monto mayor a 0'});
    } else if (Number(this.Monto) <= this.apartado.saldo) {
      if (!this.folioApartado) {
        this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Seleccionar apartado'});
      }
      /**Cancelación de apartado */
      if (!this._modalRef) {
        if (this.tipoBusqueda === TipoApartado.Cancelacion) {
          this.closeModal();
          this._modalRef = this.modalService.show(this.cancelTemplate, {'class': 'modal-dialogCenter'});
        } else {
          const totalizaInfo = new TotalizarApartadoResponseModel();
          totalizaInfo.folioOperacion = this.apartado.folioApartado;
          totalizaInfo.informacionAsociadaFormasPago = this.informacionAsociadaFormasPago;
          totalizaInfo.informacionAsociadaFormasPagoMonedaExtranjera = this.informacionAsociadaFormasPagoMonedaExtranjera;
          /**
           * TODO poner el valor de total
           */
          const pagoApartado = new PagoApartado();
          pagoApartado.pagoApartado = this.apartado;
          pagoApartado.montoPago = this.Monto;
          pagoApartado.tipoBusqueda = this.tipoBusqueda;

          this._dataTransfer.$apartadoTicketVirtual.next(pagoApartado);
          this._dataTransfer.$showFormasPago.next({
            totalizarApartado: totalizaInfo,
            pagoInfo: {total: Number(this.Monto), montoApartado: Number(this.Monto), tipoPago: TiposProductos.prenda}
          });
          this.closeModal();
        }
      } else {
        const totalizaInfo = new TotalizarApartadoResponseModel();
        totalizaInfo.folioOperacion = this.apartado.folioApartado;
        /**
         * TODO poner el valor de total
         */
        const pagoApartado = new PagoApartado();
        pagoApartado.pagoApartado = this.apartado;
        pagoApartado.montoPago = this.Monto;
        pagoApartado.tipoBusqueda = this.tipoBusqueda;

        this._dataTransfer.$apartadoTicketVirtual.next(pagoApartado);
        this._dataTransfer.$showFormasPago.next({
          totalizarApartado: totalizaInfo,
          pagoInfo: {total: Number(this.Monto), montoApartado: Number(this.Monto), tipoPago: TiposProductos.prenda}
        });
        this.closeModal();
      }
    } else {
      this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'El monto debe ser menor al saldo'});
      return;
    }
  }

  /**Método para darle formato a la cantidad por pagar */
  format(val: number) {
    const num = new Decimal(val).toFixed(2);
    this.Monto = num;
  }

  confirmarCancelacion() {
    this.serviceApartado.CancelarApartadoService(this.folioApartado).subscribe(
      data => {
        if (Number(data.codeNumber) !== 346) {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: data.codeDescription});
          return;
        } else {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Se cancelo correctamente el apartado'});
          this.closeModalCancel();
        }
      }
    );
  }

}

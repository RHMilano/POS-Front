import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FocusTicketRowDirective } from '../../directives/focus-ticket-row.directive';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';
import { RowSelector } from '../../Models/FrontEnd/RowSelector';
import { GetMayoristaRequest } from '../../Models/Sales/GetMayoristaRequest';
import { GetMayoristaMilanoResponseModel } from '../../Models/Sales/GetMayoristaMilanoResponse.model';
import { RowSelectorConfig } from '../../Models/FrontEnd/RowSelectorInterface';
import { SalesService } from '../../services/sales.service';
import { AlertService } from '../../services/alert.service';
import { BsModalRef } from 'ngx-bootstrap';
import { TicketVirtualMayoristaComponentInterface } from '../../Models/FrontEnd/TicketVirtualMayoristaComponentInterface';
import { Decimal } from 'decimal.js/decimal';

@Component({
  selector: 'app-busqueda-mayorista',
  templateUrl: './busqueda-mayorista.component.html',
  styleUrls: ['./busqueda-mayorista.component.css'],
  providers: [SalesService]
})
export class BusquedaMayoristaComponent implements OnInit, RowSelectorConfig {

  @ViewChild('directiveReference') FocusTicketRowDirective: FocusTicketRowDirective;
  @ViewChild('modalFocusReference') modalFocusReference: ModalFocusDirective;

  @Input('ticketVirtualMayoristaInstance') ticketVirtualMayoristaInstance: TicketVirtualMayoristaComponentInterface;

  mayoristas: Array<GetMayoristaMilanoResponseModel> = [];
  mayoristaInfo: GetMayoristaMilanoResponseModel;


  numeroMayorista: number;
  nombreMayorista: string;

  itemsPerPage = 5;
  rowSelector: RowSelector;
  totalItemsToPaginate: number;

  constructor(private _salesService: SalesService, private _alertService: AlertService, private _bsModalRef: BsModalRef) {
  }

  ngOnInit() {
  }


  validateMayorista(): boolean {
    return this.numeroMayorista ? !!this.numeroMayorista.toString().length : false || this.nombreMayorista ? !!this.nombreMayorista.toString().length : false;
  }

  seleccionarRowMayorista(mayorista: GetMayoristaMilanoResponseModel, index: number) {
    this.rowSelector.currentSelection = index;
    this.setSelectedItem(mayorista, null);
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
  }

  setSelectedItem(mayoristaParam: GetMayoristaMilanoResponseModel, index: number): any {
    this.mayoristaInfo = mayoristaParam || this.mayoristas[index];
    setTimeout(() => this.FocusTicketRowDirective.inputToFocus.focus(), 0);
  }

  aceptarMayorista() {

    const creditoMayorista = new Decimal(this.mayoristaInfo.creditoDisponible);

    if (creditoMayorista.lessThanOrEqualTo(0)) {
      this._alertService.show({mensaje: 'Mayorista no tiene Crédito Suficiente', tipo: 'error', titulo: 'Milano'});
      return;
    }

    this.ticketVirtualMayoristaInstance.selectedMayorista = this.mayoristaInfo;
    this._bsModalRef.hide();
    this.ticketVirtualMayoristaInstance.aceptarMayorista();
  }


  cancelarVentaMayorista() {
    this._bsModalRef.hide();
  }

  mayoristaOnEnter() {

    if (!this.validateMayorista()) {
      return;
    }

    const requestMayorista = new GetMayoristaRequest({
      codigoMayorista: this.numeroMayorista,
      nombre: this.nombreMayorista
    });

    this._salesService.MayoristaService(requestMayorista).subscribe(
      resp => {

        if (resp.length) {

          this.totalItemsToPaginate = resp.length;
          this.rowSelector = new RowSelector(this);
          this.mayoristas = resp;


          setTimeout(() => this.modalFocusReference.getElements(), 0);
          setTimeout(() => this.FocusTicketRowDirective.selectFirstTime(), 0);


        } else {
          this._alertService.show({mensaje: 'Mayorista no encontrado', tipo: 'warning', titulo: 'Milano'});
        }
      }
    );
  }

}

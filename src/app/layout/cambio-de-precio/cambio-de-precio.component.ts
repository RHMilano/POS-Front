import { Component, Input, OnInit } from '@angular/core';
import { TicketVirtual } from '../ticket-virtual/TicketVirtual';
import { BsModalRef } from 'ngx-bootstrap';
import { ReasonsCodesTransactionRequest } from '../../Models/Sales/ReasonsCodesTransactionRequest';
import { SalesService } from '../../services/sales.service';
import { ReasonsCodesTransactionResponse } from '../../Models/Sales/ReasonsCodesTransactionResponse';
import { AlertService } from '../../services/alert.service';
import { Decimal } from 'decimal.js/decimal';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';

@Component({
  selector: 'app-cambio-de-precio',
  templateUrl: './cambio-de-precio.component.html',
  styleUrls: ['./cambio-de-precio.component.css'],
  providers: [SalesService]
})
export class CambioDePrecioComponent implements OnInit {

  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;
  ticketVirtual: TicketVirtual;
  nuevoPrecioItem: number;
  razones: Array<ReasonsCodesTransactionResponse>;
  SelectRazon;
  condigoSeleccionado: number;

  constructor(public _bsModalRef: BsModalRef, private _salesService: SalesService, private _alertService: AlertService) {
  }

  ngOnInit() {
    this.ticketVirtual = this.ticketVirtualInstance.ticketVirtual;
    this.cargaRazones();
    this.razones = [];
  }

  cargaRazones() {

    const reasonRequest = new ReasonsCodesTransactionRequest();
    reasonRequest.codigoTipoRazonMMS = 'TDS0';

    this._salesService.ReasonsCodesTransactionService(reasonRequest).subscribe(
      data => {
        if (data.length) {
          this.razones = [];
          data.forEach(index => {
            const razon = index;
            this.razones.push(razon);
          });
        } else {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'No se encontraron razones de cancelación'});
        }
      }
    );
  }

  enviarRazon(Codigo) {
    this.condigoSeleccionado = Codigo;
  }

  validaPrecioNuevo(): boolean {
    const nuevoPrecio = Number(new Decimal(Number(this.nuevoPrecioItem)).toFixed(2));
    return nuevoPrecio >= 0.01;
  }

  onAceptarCambioPrecio() {
    if (this.condigoSeleccionado && this.nuevoPrecioItem) {
      this.ticketVirtualInstance.aceptarCambioPrecio(Number(this.nuevoPrecioItem), Number(this.condigoSeleccionado));
    }
  }

  onCancelarCambioPrecio() {
    this._bsModalRef.hide();
  }

}

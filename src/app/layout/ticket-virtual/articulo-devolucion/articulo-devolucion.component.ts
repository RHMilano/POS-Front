import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ArticuloComponent } from '../articulo/articulo.component';
import { BsModalService } from 'ngx-bootstrap';
import { SudoCallbackFactory } from '../../../Models/General/SudoCallbackFactory';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-articulo-devolucion',
  templateUrl: './articulo-devolucion.component.html',
  styleUrls: ['./articulo-devolucion.component.css']
})
export class ArticuloDevolucionComponent extends ArticuloComponent implements OnInit {

  @ViewChild('articuloQtyDev') articuloQtyDev: ElementRef;

  constructor(public _modalService: BsModalService, public _renderer: Renderer2, public _alertService: AlertService) {
    super(_modalService, _renderer);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  updateQty(value?: any) {


    if (value === '') {
      this.currentQty = this.ticketRow.lineaTicket.cantidadVendida;
      return;
    }

    if (value) {

      if (Number(value) > this.ticketRow.lineaTicket.cantidadVendida) {
        this._alertService.show({tipo: 'warning', titulo: 'Milano', mensaje: 'Solo se permite devolver artículos.'});
        this.currentQty = this.ticketRow.lineaTicket.cantidadVendida;
        return;
      }

      this.cantidadAnterior = this.ticketRow.lineaTicket.cantidadVendida;
      this.cantidadNueva = Number(value);
      this.lineaTicket = this.getLineaTicket(this.ticketRow.lineaTicket.getLineaTicket());
      this.lineaTicket.cantidadVendida = Number(value);

      if (this.lineaTicket.perteneceVentaOriginal && this.cantidadAnterior > this.cantidadNueva) {
        this.lineaTicket.cantidadDevuelta = Number(this.cantidadAnterior) - Number(this.cantidadNueva);
      }

    }

    if (this.cantidadNueva < this.cantidadAnterior || (this.currentQty === 0 || this.cantidadNueva === 0)) {

      const callBackStr = this.lineaTicket.perteneceVentaOriginal ? 'pedirRazonDevolicion' : 'updateLineaTicket';

      return new SudoCallbackFactory({
        component: this,
        ModalLevel: 1,
        passthroughAdmin: true,
        callBack: callBackStr,
        cancelCallback: 'rollbackEliminar',
        modalService: this._modalService
      });

    } else {
      this.updateLineaTicket();
    }

  }


}

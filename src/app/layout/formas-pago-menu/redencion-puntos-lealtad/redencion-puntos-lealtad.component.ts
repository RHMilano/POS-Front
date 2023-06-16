import { Component, Input, OnInit } from '@angular/core';
import { FormasPagoMenuComponentInterface } from '../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from '../../../services/alert.service';
import { SalesService } from '../../../services/sales.service';
//import { RendencionPuntosLealtadRequest } from '../../../Models/Pagos/RedencionPuntosLealtad';
import { RedencionCuponesResponse } from '../../../Models/Pagos/RedencionCuponesResponse';
import { RedencionPuntosLealtadResponse, RendencionPuntosLealtadRequest } from '../../../Models/Pagos/RedencionPuntosLealtad';
import { TicketVirtualComponentInterface } from '../../../Models/FrontEnd/TicketVirtualComponentInterface';
import { NUMBER_TYPE } from '@angular/compiler/src/output/output_ast';
import { FormaPagoUtilizado } from '../../../Models/Pagos/FormaPagoUtilizado';
import { PagosMasterService } from '../../../services/pagos-master.service';
import { Decimal } from 'decimal.js';
import { DescuentoPromocionalLineaModel } from '../../../Models/Sales/DescuentoPromocionalLinea.model';
import { DescuentoPromocionalVentaModel } from '../../../Models/Pagos/DescuentoPromocionalVenta.model';
import { DescuentoPromocionalAplicado } from '../../../Models/Sales/DescuentoPromocionalAplicado';
import { PagosOps, TipoPago, TipoPagoAccesoBoton } from '../../../shared/GLOBAL';
import { PagosToDisplay } from '../../../Models/Pagos/PagosToDisplay';

@Component({
  selector: 'app-redencion-puntos-lealtad',
  templateUrl: './redencion-puntos-lealtad.component.html',
  styleUrls: ['./redencion-puntos-lealtad.component.css'],
  providers: [SalesService]
})
export class RedencionPuntosLealtadComponent implements OnInit {

  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  @Input('ticketVirtualInstance') ticketVirtualInstance: TicketVirtualComponentInterface;
  frmPuntosLealtad: FormGroup;
  totalAplicandoPromociones: Decimal;
  promocionesPosiblesLinea: Array<DescuentoPromocionalLineaModel> = [];
  promocionesPosiblesVenta: Array<DescuentoPromocionalVentaModel> = [];
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalAplicado>;
  descuentosPromocionalesAplicadosVenta: Array<DescuentoPromocionalAplicado>;
  tipoPago = TipoPagoAccesoBoton.pagoLealtad;
  sesionRedencionLealtad: string = '';

  constructor(
    public _bsModalRef: BsModalRef,
    private alertService: AlertService,
    private fb: FormBuilder,
    private _salesService: SalesService,
    private _pagosMaster: PagosMasterService) {

  }

  ngOnInit() {
    this.createFormulario();
  }

  createFormulario() {
    this.frmPuntosLealtad = this.fb.group({
      codigoLealtad: [, [Validators.required]],
      monto: [, [Validators.required]]
    });
  }

  aplicarRedencionPuntosLealtad() {

    let request: RendencionPuntosLealtadRequest;
    request = new RendencionPuntosLealtadRequest();

    let response: RedencionPuntosLealtadResponse;
    response = new RedencionPuntosLealtadResponse();

    if (this.frmPuntosLealtad.invalid) {
      this.alertService.show({ tipo: 'error', titulo: 'Milano', mensaje: 'Debe de capturar el monto y el código de la aplicación' });
      this.frmPuntosLealtad.updateValueAndValidity();
      return;
    }

    request.dMonto = Number(this.frmPuntosLealtad.get("monto").value);
    request.iCodigoCaja = this.ticketVirtualInstance.loggedInfo.numeroCaja;
    request.iCodigoEmpleado = this.ticketVirtualInstance.loggedInfo.numberEmployee;
    request.iCodigoTienda = Number(this.ticketVirtualInstance.loggedInfo.numeroTienda.split(' ')[1]);
    //this.consultaLealtadRequest.iCodigoTienda = parseInt(this.loggedInfo.nombre.substring(7, 12));
    
    // Se pasa la transaccion en cero, por que es en el backend donde se recupera por el folio
    // de promocion 
    request.iTransaccion = 0;
    request.scodigoBarras = this.frmPuntosLealtad.get("codigoLealtad").value;
    request.sFolioVenta = this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.folioOperacion;


    // request.sFolioVenta = this.ticketVirtualInstance.ticketVirtual.



    this._salesService.procesarRedencionPuntosLealtad(request).subscribe(resp => {

      if (resp.codeNumber != 0) {
        this.alertService.show({ tipo: 'error', titulo: 'Milano', mensaje: `${resp.codeDescription}, ${resp.codigoTipoTrxCab}` });
        return;
      } else {

        //this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.sesionPuntosLealtadRedimidos = resp.codigoTipoTrxCab;
        this.sesionRedencionLealtad = resp.codigoTipoTrxCab;
        this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: `El pago con puntos se aplicó correctamente` });

        this._bsModalRef.hide();
      }

      this.addPay()

    }, (error) => {
      this.alertService.show({ tipo: 'error', titulo: 'Milano', mensaje: error });
      return;

    });

  }

  addPay() {
    let recibido: number;
    let codigoLealtad: number;

    recibido = this.frmPuntosLealtad.get("monto").value;
    codigoLealtad = this.frmPuntosLealtad.get("codigoLealtad").value;

    if (recibido <= 0) {
      this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar el monto que desea redimir con puntos de lealtad.' });
      return;
    }

    if (codigoLealtad <= 0) {
      this.alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar el codigo generado en su aplicacion de credito milano.' });
      return;
    }

    const pago = new FormaPagoUtilizado();
    pago.importeMonedaNacional = Number(recibido);
    pago.autorizacion =   this.sesionRedencionLealtad;

   
    if (!this._pagosMaster.pagoAdded && this.totalAplicandoPromociones && this.totalAplicandoPromociones.comparedTo(pago.importeMonedaNacional) <= 0
      && (this.promocionesPosiblesVenta.length || this.promocionesPosiblesLinea.length)) {

      this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesLinea(this.promocionesPosiblesLinea);
      this.formasPagoMenu.ticketVirtualInstance.ticketVirtual.ticketDescuentos.applyDescuentosPosiblesVenta(this.promocionesPosiblesVenta);

      pago.descuentosPromocionalesPorVentaAplicados = {
        descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosVenta.map(descuentoAplicado => {
          descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.pagoLealtad;
          return descuentoAplicado;
        })
      };

      pago.descuentosPromocionalesPorLineaAplicados = {
        descuentoPromocionesAplicados: this.descuentosPromocionalesAplicadosLinea.map(descuentoAplicado => {
          descuentoAplicado.formaPagoCodigoPromocionAplicado = TipoPago.pagoLealtad;
          return descuentoAplicado;
        })
      };
    }

    const pagoDisplay = new PagosToDisplay({
      nombre: PagosOps.pagoLealtad,
      cantidad: pago.importeMonedaNacional,
      clave: TipoPago.pagoLealtad,
      formaDePago: pago
    });


   
    this._pagosMaster.addPago(pagoDisplay);
    console.log(this.ticketVirtualInstance);
    debugger;
  }

}


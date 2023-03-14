import { Component, Input, OnInit } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PagoTCMM } from '../../Models/Pagos/PagoTCMM';
import { ProductsResponseClass } from '../../Models/General/ProductsResponse';
import { InformacionTCMMRequest } from '../../Models/TCMM/InformacionTCMMRequest';
import { SalesService } from '../../services/sales.service';
import { AlertService } from '../../services/alert.service';
import { ConfigPosService } from '../../services/config-pos.service';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { HttpErrorResponse } from '@angular/common/http';
import { RetiroTarjetaRequest } from '../../Models/Pagos/RetiroTarjetaRequest';
import { VentaTarjetaRequest } from '../../Models/Pagos/VentaTarjetaRequest';
import { MovimientoTarjetaRequest } from '../../Models/Pagos/MovimientoTarjeta';
import { PuntosTarjetaRequest } from '../../Models/Pagos/PuntosTarjetaRequest';

@Component({
  selector: 'app-pago-tcmm',
  templateUrl: './pago-tcmm.component.html',
  styleUrls: ['./pago-tcmm.component.css'],
  providers: [SalesService]
})
export class PagoTcmmComponent implements OnInit {

  @Input('ticketVirtualInstance') ticketVirtualInstance: TicketVirtualComponentInterface;

  numeroTarjeta: string;
  cantidadPagar: number;
  isPagando: boolean;
  cargando: boolean;

  constructor(private _dataTransfer: DataTransferService,
    private modalService: BsModalService,
    private _salesService: SalesService,
    private _alertService: AlertService,
    private _configService: ConfigPosService) {
  }

  ngOnInit() {
  }

  cancelPay() {
    this.closeModal();
  }

  closeModal() {
    this.modalService._hideModal(1);
  }

  payTcmm() {
    
    this.isPagando = true;

    const tarjeta = new InformacionTCMMRequest({
      numeroTarjeta: this.numeroTarjeta,
      imprimirTicket: false
    });

    this._salesService.ConsultaSaldoMMService(tarjeta).subscribe(
      data => {
        //alert('Respuesta del retorn:' + data.codigoRespuestaTCMM.mensajeRetorno);
        if (Number(data.codigoRespuestaTCMM.mensajeRetorno) === 0) {

          const pago = new PagoTCMM();
          pago.cantidadPagar = this.cantidadPagar;
          pago.numeroTarjeta = this.numeroTarjeta;
          pago.imprimirTicket = false;

          const articuloPagoTCMM = new ProductsResponseClass();
          articuloPagoTCMM.articulo.isPagoTCMM = true;
          articuloPagoTCMM.articulo.estilo = 'Pago a TCMM';
          articuloPagoTCMM.articulo.precioConImpuestos = Number(this.cantidadPagar);
          articuloPagoTCMM.articulo.sku = this._configService.currentConfig.skuPagoTCMM;
          articuloPagoTCMM.articulo.tasaImpuesto1 = 0;

          articuloPagoTCMM.articulo.informacionPagoTCMM = {
            numeroTarjeta: Number(this.numeroTarjeta)
          };
        
          this.ticketVirtualInstance.sendPagoTCMM(pago, [articuloPagoTCMM]);

          this.closeModal();
        } else {
          this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: data.codigoRespuestaTCMM.mensajeRetorno });
          this.isPagando = false;
        }
      }
    );


  }

  obtenerTarjeta() {
    const numeroTarjeta = new MovimientoTarjetaRequest();
    numeroTarjeta.retiro = new RetiroTarjetaRequest();
    numeroTarjeta.puntos = new PuntosTarjetaRequest();
    numeroTarjeta.venta = new VentaTarjetaRequest();
    this.cargando = true;
    this._salesService.obtenerTarjetaMM(numeroTarjeta).subscribe(resp => {
      if (resp.codeNumber === 0) {
        this.numeroTarjeta = resp.cardNumber;
        this.cargando = false;
      } else {
        this._alertService.show({ titulo: 'Error', tipo: 'error', mensaje: resp.codeDescription });
        this.cargando = false;
      }
    }, (err: HttpErrorResponse) => {
      this.cargando = false;
    });
  }

}

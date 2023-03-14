import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { SalesService } from '../../services/sales.service';
import { AlertService } from '../../services/alert.service';
import Decimal from 'decimal.js';
import { InformacionTCMMRequest } from '../../Models/TCMM/InformacionTCMMRequest';
import { MovimientoTarjetaRequest } from '../../Models/Pagos/MovimientoTarjeta';
import { HttpErrorResponse } from '@angular/common/http';
import {RetiroTarjetaRequest} from '../../Models/Pagos/RetiroTarjetaRequest';
import {VentaTarjetaRequest} from '../../Models/Pagos/VentaTarjetaRequest';
import {PuntosTarjetaRequest} from '../../Models/Pagos/PuntosTarjetaRequest';

@Component({
  selector: 'app-consulta-saldo-TMM',
  templateUrl: './consulta-saldo-TMM.component.html',
  styleUrls: ['./consulta-saldo-TMM.component.css'],
  providers: [SalesService]
})
export class ConsultaSaldoTMMComponent implements OnInit {

  saldo: number;
  numeroTarjeta: string;
  saldoActual: number;
  pagoMinimo: number;
  pagoNoGenerarIntereses: number;
  fechaLimitePago: string;
  puntosAcumulados: number;
  equivalencia: number;
  puntosAcumuladosActual: number;
  cargando: boolean;
  showInfo: boolean;

  constructor(public modalRef: BsModalRef, private consultaservice: SalesService, private _alertService: AlertService) {
  }

  ngOnInit() {
    this.showInfo = false;
  }

  /**Método para cerrar el diálogo de busqueda de apartado*/
  closeModal() {
    this.modalRef.hide();
  }

  consultarSaldo() {
    if (this.numeroTarjeta) {
      const tarjeta = new InformacionTCMMRequest();
      tarjeta.imprimirTicket = true;
      tarjeta.numeroTarjeta = this.numeroTarjeta;
      const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
      this.cargando = true;
      this.consultaservice.ConsultaSaldoMMService(tarjeta).subscribe(
        data => {
          if (Number(data.codigoRespuestaTCMM.mensajeRetorno) === 0) {
            this.showInfo = true;
            this.saldo = Number(new Decimal(data.saldoAlCorte).toFixed(2));
            this.saldoActual = Number(new Decimal(data.saldoEnLinea).toFixed(2));
            const fecha = data.fechaLimitePago.split(' ');
            this.fechaLimitePago = fecha[0];
            this.pagoMinimo = Number(new Decimal(data.pagoMinimo).toFixed(2));
            this.equivalencia = Number(new Decimal(data.equivalenteEnPuntos).toFixed(2));
            this.puntosAcumulados = Number(new Decimal(data.puntosAcumuladosUltimoCorte).toFixed(2));
            this.puntosAcumuladosActual = Number(new Decimal(data.saldoEnPuntos).toFixed(2));
            this.pagoNoGenerarIntereses = Number(new Decimal(data.montoPagoSinIntereses).toFixed(2));
            this.cargando = false;
          } else {
            this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: data.codigoRespuestaTCMM.mensajeRetorno});
            this.cargando = false;
            this.showInfo = false;
          }
        }, (err: HttpErrorResponse) => {
          this.cargando = false;
          this.showInfo = false;
        }
      );
    }
  }

  obtenerTarjeta() {
    const numeroTarjeta = new MovimientoTarjetaRequest();
    numeroTarjeta.retiro = new RetiroTarjetaRequest();
    numeroTarjeta.puntos = new PuntosTarjetaRequest();
    numeroTarjeta.venta = new VentaTarjetaRequest();
    this.cargando = true;
    this.consultaservice.obtenerTarjetaMM(numeroTarjeta).subscribe(resp => {
      if (resp.codeNumber === 0) {
        this.numeroTarjeta = resp.cardNumber;
        this.cargando = false;
        this.consultarSaldo();
      } else {
        this._alertService.show({titulo: 'Error', tipo: 'error', mensaje: resp.codeDescription});
        this.cargando = false;
      }
    }, (err: HttpErrorResponse) => {
      this.cargando = false;
    });
  }

  limpiarVariables() {
    this.saldo = null;
    this.saldoActual = null;
    this.fechaLimitePago = null;
    this.pagoMinimo = null;
    this.equivalencia = null;
    this.puntosAcumulados = null;
    this.puntosAcumuladosActual = null;
    this.pagoNoGenerarIntereses = null;
  }

}


import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';
import {ClasificacionVenta, EstadosPago, TipoPago} from '../../shared/GLOBAL';
import {MovimientoTarjetaRequest} from '../../Models/Pagos/MovimientoTarjeta';
import {SalesService} from '../../services/sales.service';
import {RetiroTarjetaRequest} from '../../Models/Pagos/RetiroTarjetaRequest';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-cash-back-advanced',
  templateUrl: './cash-back-advanced.component.html',
  styleUrls: ['./cash-back-advanced.component.css'],
  providers: [ SalesService ]
})
export class CashBackAdvancedComponent implements OnInit {

  Importe: number;
  Confirmacion: number;
  toDisable: boolean;
  cargando: boolean;

  constructor(public modalRef: BsModalRef, private _alertService: AlertService, private retiroService: SalesService) { }

  ngOnInit() {
    this.toDisable = true;
  }

  /**Método para cerrar el diálogo de importe de retiro de efectivo*/
  closeModal() {
    this.modalRef.hide();
  }

  retirarEfectivo() {
    this.toDisable = false;
    if (!this.Importe || this.Importe <= 0 ) {
      this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido'});
      this.toDisable = true;
    } else if (this.Importe !== this.Confirmacion) {
      this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Los montos capturados deben coincidir'});
      this.toDisable = true;
    } else {
      const movimientoTarjeta = new MovimientoTarjetaRequest();
      movimientoTarjeta.retiro = new RetiroTarjetaRequest();
      movimientoTarjeta.retiro.retirar = true;
      movimientoTarjeta.retiro.codigoFormaPagoImporte = TipoPago.cambio;
      movimientoTarjeta.retiro.estatus = EstadosPago.Exitoso;
      movimientoTarjeta.retiro.folioOperacionAsociada = '';
      movimientoTarjeta.retiro.clasificacionVenta = ClasificacionVenta.regular;
      movimientoTarjeta.retiro.importeCashBack = this.Importe;
      movimientoTarjeta.retiro.secuenciaFormaPagoImporte = 1;
      this.cargando = true;
        this.retiroService.procesarMovimientoTarjetaBancariaCashBackAdvance(movimientoTarjeta).subscribe(resp => {
          if (resp.codeNumber === 0) {
            this.cargando = false;
              this.closeModal();
              this._alertService.show({titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription});
          } else {
            this.cargando = false;
            this._alertService.show({titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription});
            this.toDisable = true;
          }

        }, (err: HttpErrorResponse) => {
          this.cargando = false;
          this.toDisable = true;
        });
      }
    }
}

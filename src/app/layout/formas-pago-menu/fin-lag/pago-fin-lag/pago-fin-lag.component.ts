import {SalesService} from '../../../../services/sales.service';
import {Component, Input, OnInit} from '@angular/core';
import {DosDecimalesPipe} from '../../../../pipes/dos-decimales.pipe';
import {ClasificacionVenta, EstadosPago, OrigenPago, PagosOps, TipoPago, TipoPagoAccesoBoton, TipoPagoFinLag} from '../../../../shared/GLOBAL';
import {FormasPagoMenuComponentInterface} from '../../../../Models/FrontEnd/FormasPagoMenuComponentInterface';
import {FinalizarPagoTCMM} from '../../../../Models/Pagos/FinalizarPagoTCMM';
import {PlanFinanciamientoResponse} from '../../../../Models/Sales/PlanFinanciamientoResponse';
import {DescuentoPromocionalLineaModel} from '../../../../Models/Sales/DescuentoPromocionalLinea.model';
import {DescuentoPromocionalVentaModel} from '../../../../Models/Pagos/DescuentoPromocionalVenta.model';
import {DescuentoPromocionalAplicado} from '../../../../Models/Sales/DescuentoPromocionalAplicado';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PagosMasterService} from '../../../../services/pagos-master.service';
import {AlertService} from '../../../../services/alert.service';
import {PagosToDisplay} from '../../../../Models/Pagos/PagosToDisplay';
import {MovimientoTarjetaRequest} from '../../../../Models/Pagos/MovimientoTarjeta';
import {RetiroTarjetaRequest} from '../../../../Models/Pagos/RetiroTarjetaRequest';
import {PuntosTarjetaRequest} from '../../../../Models/Pagos/PuntosTarjetaRequest';
import {VentaTarjetaRequest} from '../../../../Models/Pagos/VentaTarjetaRequest';
import {HttpErrorResponse} from '@angular/common/http';
import {Decimal} from 'decimal.js/decimal';
import {PlanesFinanciamientoRequest} from '../../../../Models/Sales/PlanesFinanciamientoRequest';
import {FormaPagoUtilizado} from '../../../../Models/Pagos/FormaPagoUtilizado';
import {ValidaValeResponse} from '../../../../Models/Pagos/ValidaValeResponse';
import {TablaAmortizacionResponse} from '../../../../Models/Pagos/TablaAmortizacionResponse';
import {AplicaValeRequest} from '../../../../Models/Pagos/AplicaValeRequest';
import {ValidaValeRequest} from '../../../../Models/Pagos/ValidaValeRequest';
import {isDate, isNumber} from 'ngx-bootstrap/chronos/utils/type-checks';


@Component({
  selector: 'app-pago-fin-lag',
  templateUrl: './pago-fin-lag.component.html',
  styleUrls: ['./pago-fin-lag.component.css'],
  providers: [SalesService, DosDecimalesPipe]
})
export class PagoFinLagComponent implements OnInit {

  @Input() formasPagoMenu: FormasPagoMenuComponentInterface;
  @Input() valeInfo: ValidaValeResponse;
  @Input() pagos: Array<TablaAmortizacionResponse>;
  @Input() vale: ValidaValeRequest;
  @Input() recibido: number;
  tipoPago = TipoPagoAccesoBoton.finLag;
  folioVenta: string;
  toDisable: boolean;
  cargando: boolean;
  planes: Array<PlanFinanciamientoResponse>;
  selectPlan;
  promocion: boolean;
  totalAplicandoPromociones: Decimal;
  nombre: string;
  idPago: number;

  constructor(private modalService: BsModalService, private alertService: AlertService, private _salesService: SalesService,
              public _pagosMaster: PagosMasterService, private dosDecimales: DosDecimalesPipe, public _bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.idPago = null;
    this.nombre = this.valeInfo.nombre + ' ' + this.valeInfo.paterno + ' ' + this.valeInfo.materno;
  }

  cancelPay() {
    this.closeModal();
    this.formasPagoMenu.selectOperation('reset');
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  validatePay() {

  }

  setPago(id) {
    if (isNumber(id) && id !== this.idPago) {
      this.idPago = id;
    } else {
      this.idPago = null;
    }
  }

  addPay() {
    const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
      const aplicaVale = new AplicaValeRequest();
      aplicaVale.nombre = this.valeInfo.nombre;
      aplicaVale.aPaterno = this.valeInfo.paterno;
      aplicaVale.aMaterno = this.valeInfo.materno;
      aplicaVale.fechaNacimiento = !isDate(this.valeInfo.fechaNacimiento) ? this.valeInfo.fechaNacimiento:
        this.valeInfo.fechaNacimiento.toLocaleDateString('es-ES', options);
      aplicaVale.calle = this.valeInfo.calle;
      aplicaVale.numExt = this.valeInfo.numero;
      aplicaVale.colonia = this.valeInfo.colonia;
      aplicaVale.estado = this.valeInfo.estado;
      aplicaVale.cP = this.valeInfo.cP;
      aplicaVale.municipio = this.valeInfo.municipio;
      aplicaVale.montoVale = this.vale.montoVale;
      aplicaVale.INE = this.valeInfo.ine;
      aplicaVale.sexo = this.valeInfo.sexo;
      aplicaVale.idDistribuidora = this.vale.idDistribuidora;
      if (this.valeInfo.idDistribuidora && Number(this.valeInfo.idDistribuidora) !== 0) {
        aplicaVale.idDistribuidora = Number(this.valeInfo.idDistribuidora);
      } else {
        aplicaVale.idDistribuidora = this.vale.idDistribuidora ? this.vale.idDistribuidora : 0;
      }
      aplicaVale.folioVale = this.vale.folioVale;
      aplicaVale.quincenas = this.pagos[this.idPago].numPago;
      aplicaVale.puntosUtilizados = this.pagos[this.idPago].puntos;
      aplicaVale.efectivoPuntos = this.pagos[this.idPago].efectivoPuntos;
      aplicaVale.tipoPago = this.pagos[this.idPago].tipoPago;
      aplicaVale.codigoFormaPagoImporte = TipoPago.finLag;
      aplicaVale.estatus = EstadosPago.Registrado;
      switch (this.formasPagoMenu.origenPago) {
        case OrigenPago.normal:
          aplicaVale.folioOperacionAsociada = this.formasPagoMenu.currentTotalizarInfo.totalizarInfo.folioOperacion;
          break;
        case OrigenPago.tarjetaCmm:
          aplicaVale.folioOperacionAsociada = '';
          break;
        case OrigenPago.apartado:
          aplicaVale.folioOperacionAsociada =
            this.formasPagoMenu.currentTotalizarInfo.totalizarApartado.folioOperacion;
          break;
      }
      aplicaVale.importeVentaTotal = this.recibido;
      aplicaVale.secuenciaFormaPagoImporte = this._pagosMaster.PagosMaster.secuenciaNoAnulable + 1;
      aplicaVale.descuentosPromocionalesPorVentaAplicados = { descuentoPromocionesAplicados: [] };
      aplicaVale.descuentosPromocionalesPorLineaAplicados = { descuentoPromocionesAplicados: [] };
        this._salesService.aplicarValeService(aplicaVale).subscribe(resp => {
          if (Number(resp.codeNumber) === 353) {

            const pago = new FormaPagoUtilizado();
            pago.estatus = EstadosPago.Registrado;
            pago.codigoFormaPagoImporte = TipoPago.finLag;
            pago.importeMonedaNacional = this.recibido;
            pago.secuenciaFormaPagoImporte = this.formasPagoMenu.secuencia + 1;
            pago.descuentosPromocionalesPorVentaAplicados = {descuentoPromocionesAplicados: []};
            pago.descuentosPromocionalesPorLineaAplicados = {descuentoPromocionesAplicados: []};


          const pagoDisplay = new PagosToDisplay({
              nombre: PagosOps.finLag,
              cantidad: pago.importeMonedaNacional,
              clave: TipoPago.finLag,
              formaDePago: pago
            }
          );
          this.formasPagoMenu.selectOperation('reset');
          setTimeout(() => this._pagosMaster.addPago(pagoDisplay));
          this.cancelPay();
        } else {
          this.alertService.show({mensaje: resp.codeDescription, tipo: 'error', titulo: 'Milano'});
            this.formasPagoMenu.selectOperation('reset');
        }
      });
  }
}


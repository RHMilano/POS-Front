import { PagosToDisplay } from './PagosToDisplay';
import { TotalesLast } from './TotalesLast';
import { DivisasResponse } from '../General/DivisasRequest';
import { TipoPago } from '../../shared/GLOBAL';

export class PagosMaster {
  pagos: Array<PagosToDisplay>;
  ordenPago: number;
  totales: TotalesLast;
  divisas: DivisasResponse;

  constructor() {
    this.pagos = [];
    this.ordenPago = 0;
    this._secuenciaNoAnulable = 0;
  }

  private _secuenciaNoAnulable: number;

  get secuenciaNoAnulable(): number {
    return this._secuenciaNoAnulable;
  }

  addPagoDefinitivamente(pago: PagosToDisplay) {

    const pagosNoAnulables = this.getPagosByAnulable(false);
    const pagosAnulables = this.getPagosByAnulable(true);

    if (pago.anulable) {
      pago.orden = ++this.ordenPago;
      pagosAnulables.push(pago);
    } else {
      this._secuenciaNoAnulable = pago.formaDePago.secuenciaFormaPagoImporte;
      pagosNoAnulables.push(pago);
    }

    this.pagos = [...pagosNoAnulables, ...pagosAnulables];
    this.updateSecuencias();
  }

  deletePagoArray(idPago: number): PagosToDisplay {
    const index = this.pagos.findIndex(value => value.idPago === idPago);
    const deletedPago = this.pagos.splice(index, 1);
    this.updateSecuencias();
    return deletedPago[0];
  }

  updateSecuencias() {
    const pagosNoAnulables = this.getPagosByAnulable(false);
    const pagosAnulables = this.getPagosByAnulable(true);

    let secuenciaAnulablesTmp = this._secuenciaNoAnulable;
    pagosAnulables.forEach(value => {
      value.formaDePago.secuenciaFormaPagoImporte = ++secuenciaAnulablesTmp;
      if (value.formaDePago.importeCambioExcedenteMonedaNacional) {
        value.formaDePago.secuenciaFormaPagoImporteCambioExcedente = ++secuenciaAnulablesTmp;
      }
      if (value.formaDePago.importeCambioMonedaNacional) {
        value.formaDePago.secuenciaFormaPagoImporteCambio = ++secuenciaAnulablesTmp;
      }
    });

    this.pagos = [...pagosNoAnulables, ...pagosAnulables];
  }

  setTotales(totales: TotalesLast) {
    this.totales = totales;
    if (this.getPagosByAnulable(true).length) {
      this.updateSecuencias();
    }
  }

  setDivisas(div: DivisasResponse) {
    this.divisas = div;
  }

  reset() {
    this.pagos = [];
    this.ordenPago = 0;
    this.totales = null;
    this._secuenciaNoAnulable = 0;
  }

  initSecuencia(secuencia: number) {
    this._secuenciaNoAnulable = secuencia;
  }

  getPagosMonedaExtranjera(): Array<PagosToDisplay> {
    return this.pagos.filter(x => x.clave === TipoPago.dolares || x.clave === TipoPago.quetzales);
  }

  getPagosByAnulable(anulable: boolean): Array<PagosToDisplay> {
    return this.pagos.filter(x => x.anulable === anulable);
  }

  getPagoById(idPago: number): PagosToDisplay {
    return this.pagos.find(value => value.idPago === idPago);
  }
}

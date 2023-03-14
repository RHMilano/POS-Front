import { PagosToDisplayModel } from './PagosToDisplay.model';
import { GLOBAL, PagosOps, TipoPago } from '../../shared/GLOBAL';
import { FormaPagoUtilizadoModel } from './FormaPagoUtilizado.model';

export class PagosToDisplay implements PagosToDisplayModel {
  orden: number;
  nombre: string;
  PagosOps: PagosOps;
  numeroTarjeta: string;
  cantidad: number;
  cantidadMonedaExtranjera: number;
  clave: TipoPago;
  anulable: boolean;
  formaDePago: FormaPagoUtilizadoModel;
  idPago: number;
  nombreCompuesto: string;

  constructor(request: PagosToDisplayModel = {} as PagosToDisplayModel) {
    const {
      orden = 0,
      nombre = '',
      numeroTarjeta = '0',
      cantidad = 0,
      clave = TipoPago.efectivo,
      formaDePago = null,
      cantidadMonedaExtranjera = 0,
      nombreCompuesto = null
    } = request;
    this.orden = orden;
    this.nombre = nombre;
    this.PagosOps = <PagosOps>nombre;
    this.numeroTarjeta = numeroTarjeta;
    this.cantidad = cantidad;
    this.clave = clave;
    this.formaDePago = formaDePago;
    this.anulable = this.esAnulable();
    this.idPago = Math.floor((Math.random() * 999999) + 1);
    this.cantidadMonedaExtranjera = cantidadMonedaExtranjera;
    this.nombreCompuesto = nombreCompuesto;
  }

  esAnulable() {
    return GLOBAL.includesAny(this.formaDePago.codigoFormaPagoImporte, [
        TipoPago.valeV1.toString(),
        TipoPago.valeV2.toString(),
        TipoPago.valeV3.toString(),
        TipoPago.valeV4.toString(),
        TipoPago.valeV5.toString(),
        TipoPago.valeV6.toString(),
        TipoPago.valeV7.toString(),
        TipoPago.valeV8.toString(),
        TipoPago.valeV9.toString()
      ])
      || this.formaDePago.codigoFormaPagoImporte === TipoPago.efectivo
      || this.formaDePago.codigoFormaPagoImporte === TipoPago.dolares
      || this.formaDePago.codigoFormaPagoImporte === TipoPago.quetzales;
  }
}

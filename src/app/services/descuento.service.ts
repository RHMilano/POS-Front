import { Injectable } from '@angular/core';
import { FormaPagoUtilizadoModel } from '../Models/Pagos/FormaPagoUtilizado.model';

@Injectable()
export class DescuentoService {

  constructor() {
  }

  private _descuentoApplied: boolean;

  get descuentoApplied(): boolean {
    return this._descuentoApplied;
  }

  set descuentoApplied(value: boolean) {
    this._descuentoApplied = value;
  }

  private _pagoAdded: boolean;

  get pagoAdded(): boolean {
    return this._pagoAdded;
  }

  set pagoAdded(value: boolean) {
    this._pagoAdded = value;
  }

  reset() {
    this.descuentoApplied = false;
    this.pagoAdded = false;
  }

  checkFormaPagoDescuento(formaPago: FormaPagoUtilizadoModel) {

    this.descuentoApplied = !!formaPago.descuentosPromocionalesPorLineaAplicados.descuentoPromocionesAplicados.length
      || !!formaPago.descuentosPromocionalesPorVentaAplicados.descuentoPromocionesAplicados.length;

    this.pagoAdded = true;

  }

  checkFormaPagoDescuentoRemoved(formaPago: FormaPagoUtilizadoModel) {
    this.descuentoApplied = !(formaPago.descuentosPromocionalesPorLineaAplicados.descuentoPromocionesAplicados.length
      || formaPago.descuentosPromocionalesPorVentaAplicados.descuentoPromocionesAplicados.length);
  }
}

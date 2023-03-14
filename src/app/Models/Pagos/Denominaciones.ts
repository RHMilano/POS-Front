import {DenominacionesModel} from './DenominacionesModel';

export class Denominaciones implements DenominacionesModel {

  constructor(params: DenominacionesModel = {} as DenominacionesModel) {
    const {
      codigoFormaPago = '',
      textoDenominacion = '',
      valorDenominacion = 0,
      cantidad = 0,
      monto = 0
    } = params;

    this._valorDenominacion = valorDenominacion;
    this._cantidad = cantidad;
    this._monto = monto;
    this._textoDenominacion = textoDenominacion;
    this._codigoFormaPago = codigoFormaPago;
  }

  private _cantidad: number;
  private _monto: number;
  private _valorDenominacion: number;
  private _textoDenominacion: string;
  private _codigoFormaPago: string;

  get cantidad(): number {
    return this._cantidad;
  }

  set cantidad(value: number) {
    this._cantidad = value;
  }

  get monto(): number {
    return this._monto;
  }

  set monto(value: number) {
    this._monto = value;
  }

  get valorDenominacion(): number {
    return this._valorDenominacion;
  }

  set valorDenominacion(value: number) {
    this._valorDenominacion = value;
  }

  set textoDenominacion(value: string) {
    this._textoDenominacion = value;
  }

  get textoDenominacion(): string {
    return this._textoDenominacion;
  }

  get codigoFormaPago(): string {
    return this._codigoFormaPago;
  }

  set codigoFormaPago(value: string) {
    this._codigoFormaPago = value;
  }

  agregarCantidad() {
    this._cantidad++;
    this.editarMonto();
  }

  eliminarCantidad() {
    if(this._cantidad > 0) {
      this._cantidad--;
      this.editarMonto();
    }
  }

  editarMonto() {
    this._monto = this._cantidad * this._valorDenominacion;
  }

  editarDenominacion(value: number) {
    this._valorDenominacion = value;
  }

  editarCantidad (value: number) {
    this._cantidad = value;
    this.editarMonto();
  }

  getDenominaciones(): DenominacionesModel {
    return {
      codigoFormaPago: this._codigoFormaPago,
      valorDenominacion: this._cantidad,
      cantidad: this._cantidad,
      textoDenominacion: this._textoDenominacion,
      monto: this._monto
    }
  }
}

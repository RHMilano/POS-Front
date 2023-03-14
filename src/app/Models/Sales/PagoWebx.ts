import { Decimal } from 'decimal.js/decimal';
import { PagoWebxDetalleResponse } from './PagoWebxDetalle';

export class PagoWebxResponse {
  errorCode: number;
  message: string;
  response: PagoWebxDetalleResponse;
  
  constructor(){
    this.errorCode = 0;
    this.message = ''
    this.response = new PagoWebxDetalleResponse();
  }
}
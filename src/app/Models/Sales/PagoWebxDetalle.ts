import { Decimal } from 'decimal.js/decimal';

export class PagoWebxDetalleResponse{
  orderNuber: string;
  orderId: number;
  customerName: string;
  transactionId: number;
  amount: number
  currency: string

  constructor(){
    this.orderNuber = '';
    this.orderId = 0;
    this.customerName = '';
    this.transactionId = 0;
    this.amount = 0;
    this.currency = '';
  }
}

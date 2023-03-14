import {CashOutCaja} from './CashOutCaja';

export class CashOutResponse {
  id: number;
  codigoTienda: number;
  fecha: string;
  cashOutCaja: Array<CashOutCaja>
}

import {PagosToDisplayModel} from './PagosToDisplay.model';
import {TipoPago} from '../../shared/GLOBAL';
import {TotalesLastModel} from './TotalesLast.model';

export class TotalesLast {
  totalSaleLast: number;
  totalTicketLast: number;
  totalChangeLast: number;
  totalPaidLast: number;
  totalAbono: number;

  constructor(request: TotalesLastModel = {} as TotalesLastModel) {
    const {
      totalSaleLast = 0,
      totalPaidLast = 0,
      totalTicketLast =  0,
      totalChangeLast = 0,
      totalAbono = 0
    } = request;
    this.totalSaleLast = totalSaleLast;
    this.totalPaidLast = totalPaidLast;
    this.totalTicketLast = totalTicketLast;
    this.totalChangeLast = totalChangeLast;
    this.totalAbono = totalAbono;
  }
}

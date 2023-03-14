
export class SaleRequest  {

    transactionAmount: string;
    merchanReference: string;
    promo: string;
    dollars: boolean;
    amex: boolean;
    payPoints: boolean;

  constructor() {
    this.transactionAmount = "";
    this.merchanReference= "";
    this.promo = "";
    this.dollars = false;
    this.amex = false;
    this.payPoints =  false;
   }
}

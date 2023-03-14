import { Decimal } from 'decimal.js/decimal';
import { CardData } from './CardData';

export class CardDataResponse {
  errorCode: number;
  message: string;
  response: CardData;
  
  constructor(){
    this.errorCode = 0;
    this.message = ''
    this.response = new CardData();
  }
}
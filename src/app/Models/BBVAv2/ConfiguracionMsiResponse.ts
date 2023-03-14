import { Decimal } from 'decimal.js/decimal';
import { ConfiguracionMSI } from './ConfiguracionMSI';

export class ConfiguracionMSIResponse {
  errorCode: number;
  message: string;
  response: ConfiguracionMSI;
  
  constructor(){
    this.errorCode = 0;
    this.message = ''
    this.response = new ConfiguracionMSI();
  }
}
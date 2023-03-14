import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { EstatusResult, ResponseBusiness } from '../Models/General/ResponseBusiness.model';

import { AutorizaCancelacionRequestModel } from '../Models/Sales/AutorizaCancelacionRequest';
import { AutorizaCancelacionResponseModel } from '../Models/Sales/AutorizaCancelacionResponse';
import { ConfiguracionMSIResponse } from '../Models/BBVAv2/ConfiguracionMsiResponse';
import { SaleRequest } from '../Models/BBVAv2/SaleRequest';
import { CardDataResponse } from '../Models/BBVAv2/CardDataResponse';
import { ConfiguracionMSI } from '../Models/BBVAv2/ConfiguracionMSI';
import { SaleResponse } from '../Models/BBVAv2/SaleResponse';
import { CardData } from '../Models/BBVAv2/CardData';
import { CardMSIConfig } from '../Models/BBVAv2/CardMSIConfig';



@Injectable()
export class Bbvav2Service {

  constructor(private _http: HttpClient) { }

    // Recupera la configuración de meses sin intereses
  // ObtenerConfiguracionMSIv2() {
  //   const endpoint = `${env.urlServices}${env.enpObtenerMSI}`;
  //   console.log(endpoint);
  //   return this._http.get<ResponseBusiness<ConfiguracionMSI>>(
  //     endpoint).map(res => res.data);
  // }

  // Recuperar los datos de la tarjeta
   ServiceReadCard(request: SaleRequest) {
   const endpoint = `${env.urlServices}${env.epointReadCard}`; 
   //console.log(`Llamada a: ${endpoint}`);
   return this._http.post<ResponseBusiness<CardMSIConfig>>(
    endpoint, JSON.stringify(request)).map(res => res.data);
   }

   // Autorizar el pedido
   ServiceCompleteSale(request: SaleRequest) {
    const endpoint = `${env.urlServices}${env.epointCompleteSale}`; 
    //console.log(`Llamada a: ${endpoint}`);
    return this._http.post<ResponseBusiness<SaleResponse>>(
     endpoint, JSON.stringify(request)).map(res => res.data);
    }

}

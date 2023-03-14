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
import { RegistroLealtadRequest } from '../Models/Lealtad/registro_lealtad_request';
import { RegistroLealtadResponse } from '../Models/Lealtad/registro_lealtad_response';
import { ConsultaLealtadRequest } from '../Models/Lealtad/consulta_lealtad_request';
import { ConsultaLealtadResponse } from '../Models/Lealtad/consulta_lealtad_response';

@Injectable()
export class LealtadService {

  constructor(private _http: HttpClient) { }

  // Recuperar los datos de la tarjeta
   RegistroClienteLealtad(request: RegistroLealtadRequest) {
   const endpoint = `${env.urlServices}${env.postLealtad}`; 
   //console.log(`Llamada a: ${endpoint}`);
   return this._http.post<ResponseBusiness<RegistroLealtadResponse>>(
    endpoint, JSON.stringify(request)).map(res => res.data);
   }

   ConsultaClienteLealtad(request: ConsultaLealtadRequest) {
    const endpoint = `${env.urlServices}${env.postConsultaLealtad}`; 
    //console.log(`Llamada a: ${endpoint}`);
    return this._http.post<ResponseBusiness<ConsultaLealtadResponse>>(
     endpoint, JSON.stringify(request)).map(res => res.data);
    }



}

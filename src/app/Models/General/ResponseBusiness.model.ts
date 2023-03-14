import {InformacionAsociadaRetiroEfectivo} from './InformacionAsociadaRetiroEfectivo';

export interface ResponseBusiness<T> {
  data: T;
  result: EstatusResult;
}

export interface EstatusResult {
  codeDescription: string;
  codeNumber: number;
  status: boolean;
  informacionAsociadaRetiroEfectivo: InformacionAsociadaRetiroEfectivo;
  error: string;
}

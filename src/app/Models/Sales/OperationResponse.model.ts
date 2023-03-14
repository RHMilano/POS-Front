import { DescuentoPromocionalLineaModel } from './DescuentoPromocionalLinea.model';
import { InformacionAsociadaRetiroEfectivo } from '../General/InformacionAsociadaRetiroEfectivo';

export interface OperationResponseModel {
  codeNumber: string;
  codeDescription: string;
  descuentosPromocionalesAplicadosLinea: Array<DescuentoPromocionalLineaModel>;
  descuentosPromocionalesPosiblesLinea: Array<DescuentoPromocionalLineaModel>;
  informacionAsociadaRetiroEfectivo: InformacionAsociadaRetiroEfectivo;
}

// OCG: Interface para recibir las respuestas generales del proyecto WSPOS
export class WsPosResponseModel {
  codeNumber: string;
  codeDescription: string;
}

import {FormaPagoUtilizado} from './FormaPagoUtilizado';
import {TotalizarVentaResponseModel} from '../Sales/TotalizarVentaResponse.model';
import {PagosOps, TiposProductos} from '../../shared/GLOBAL';
import {TotalizarApartadoResponseModel} from '../Apartados/TotalizarApartadoResponse.model';
import {PagosToDisplay} from './PagosToDisplay';

export class Pago {
  cantidad: number;
  tipo: FormaPagoUtilizado;
}

export class Pagos {
  constructor(public cantidad: number, public tipo: FormaPagoUtilizado) {
  }
}

export class PagosControl {
  pagosAsPay: Array<PagosToDisplay>;
  pagosReales: Array<FormaPagoUtilizado>;
}

export class ShowPagosRequest {
  totalizarInfo?: TotalizarVentaResponseModel;
  totalizarApartado?: TotalizarApartadoResponseModel;
  pagoInfo?: {
    tipoPago: TiposProductos,
    montoApartado?: number,
    total: number
  };
}

export class PagoEfectivoRequest {
  secuencia: number;
  folioOperacionAsociada: string;
  codigoFormaPagoImporteCambioOperacion: string;
  importeCambioOperacionMonedaNacional: number;
  codigoFormaPagoImportePagoIndividual: string;
  importePagoIndividualMonedaNacional: number;
  informacionTipoCambio: {
    codigoTipoDivisa: string;
    importeMonedaExtranjera: number;
    tasaConversionVigente: number;
  };
}

export class PagoEfectivoResponse {
  codeNumber: string;
  codeDescription: string;
}


export class PagoValesRequest {
  secuencia: number;
  folioOperacionAsociada: string;
  numeroTar: number;
  importeCambioExcedenteOperacionMonedaNacional: number;
  codigoFormaPagoImporteCambioOperacion: string;
  importeCambioOperacionMonedaNacional: number;
  codigoFormaPagoImportePagoIndividual: string;
  importePagoIndividualMonedaNacional: number;
}

export class PagoTarjetaRequest {
  secuencia: number;
  folioOperacionAsociada: string;
  numeroTarjeta: number;
  importeCambioExcedenteOperacionMonedaNacional: number;
  codigoFormaPagoImporteCambioOperacion: string;
  importeCambioOperacionMonedaNacional: number;
  codigoFormaPagoImportePagoIndividual: string;
  importePagoIndividualMonedaNacional: number;
}


export class PagoValesResponse {
  codeNumber: string;
  codeDescription: string;
}


export class BotoneraPagos {
  action: string;
  boton: PagosOps;
  dontHidde?: boolean;
}

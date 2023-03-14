import { TotalizarVentaModel } from './Sales/TotalizarVenta.model';
import { CabeceraVentaRequest } from './Sales/CabeceraVentaRequest';

export class TotalizarVentaRequest implements TotalizarVentaModel {
  cabeceraVentaAsociada: CabeceraVentaRequest;
  secuenciaActual: number;


  constructor(request: TotalizarVentaModel = {} as TotalizarVentaModel) {
    const {
      secuenciaActual = 0,
      cabeceraVentaAsociada = null
    } = request;

    this.cabeceraVentaAsociada = cabeceraVentaAsociada;
    this.secuenciaActual = secuenciaActual;
  }

  getRequestInfo?(): TotalizarVentaModel {

    return {
      secuenciaActual: this.secuenciaActual,
      cabeceraVentaAsociada: this.cabeceraVentaAsociada
    };
  }
}

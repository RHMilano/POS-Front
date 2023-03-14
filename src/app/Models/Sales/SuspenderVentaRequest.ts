import {SuspenderVentaRequestModel} from './SuspenderVentaRequest.model';
import {CabeceraVentaRequest} from './CabeceraVentaRequest';

export class SuspenderVentaRequest implements SuspenderVentaRequestModel {
  cabeceraVentaAsociada: CabeceraVentaRequest;

  constructor(request: SuspenderVentaRequestModel = {} as SuspenderVentaRequestModel) {
    const {
      cabeceraVentaAsociada = null

    } = request;

    this.cabeceraVentaAsociada = cabeceraVentaAsociada;
  }
}

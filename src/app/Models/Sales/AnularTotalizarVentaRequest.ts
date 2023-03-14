import { AnularTotalizarVentaRequestModel } from './AnularTotalizarVentaRequest.model';

export class AnularTotalizarVentaRequest implements AnularTotalizarVentaRequestModel {
  folioVenta: string;
  codigoRazon: number;

  constructor(request: AnularTotalizarVentaRequestModel = {} as AnularTotalizarVentaRequestModel) {
    const {
      folioVenta = '',
      codigoRazon = 0
    } = request;

    this.folioVenta = folioVenta;
    this.codigoRazon = codigoRazon;
  }
}

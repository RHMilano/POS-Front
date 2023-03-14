import { InformacionAdicionalPS, PagoServiciosOpcionesModel } from './PagoServiciosOpciones.model';

export class PagosServiciosOpciones implements PagoServiciosOpcionesModel {
  cuenta: string;
  skuCode: string;
  infoAdicional: InformacionAdicionalPS;


  constructor(params: PagoServiciosOpcionesModel = {} as PagoServiciosOpcionesModel) {
    const {
      cuenta = '',
      skuCode = '',
      infoAdicional = null
    } = params;

    this.skuCode = skuCode;
    this.cuenta = cuenta;
    this.infoAdicional = infoAdicional;
  }
}

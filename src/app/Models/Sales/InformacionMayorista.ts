import { InformacionMayoristaModel } from './InformacionMayorista.model';

export class InformacionMayorista implements InformacionMayoristaModel {

  codigoMayorista: number;
  importeVentaBruto: number;
  importeVentaImpuestos: number;
  importeVentaNeto: number;

  constructor(request: InformacionMayoristaModel = {} as InformacionMayoristaModel) {
    const {

      codigoMayorista = 0,
      importeVentaBruto = 0,
      importeVentaImpuestos = 0,
      importeVentaNeto = 0

    } = request;

    this.codigoMayorista = codigoMayorista;
    this.importeVentaBruto = importeVentaBruto;
    this.importeVentaImpuestos = importeVentaImpuestos;
    this.importeVentaNeto = importeVentaNeto;

  }
}

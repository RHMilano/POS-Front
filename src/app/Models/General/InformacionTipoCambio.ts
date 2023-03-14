import { InformacionTipoCambioModel } from "./InformacionTipoCambio.model";

export class InformacionTipoCambio implements InformacionTipoCambioModel {
    codigoTipoDivisa : string;
    importeMonedaExtranjera : number;
    tasaConversionVigente :number;

    constructor(request: InformacionTipoCambioModel = {} as InformacionTipoCambioModel) {
        const {
            codigoTipoDivisa = '0',
            importeMonedaExtranjera = 0,
            tasaConversionVigente = 0
        } = request;

        this.codigoTipoDivisa = codigoTipoDivisa;
        this.importeMonedaExtranjera = importeMonedaExtranjera;
        this.tasaConversionVigente = tasaConversionVigente ;
      }
}

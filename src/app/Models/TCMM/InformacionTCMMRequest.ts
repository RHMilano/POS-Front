import {InformacionTCMMRequestModel} from './InformacionTCMMRequest.model';


export  class InformacionTCMMRequest implements InformacionTCMMRequestModel {
    numeroTarjeta: string;
    imprimirTicket: boolean;

    constructor(request: InformacionTCMMRequestModel = {} as InformacionTCMMRequestModel){
        const {
            numeroTarjeta = '0',
            imprimirTicket = false
    } = request;

    this.numeroTarjeta = numeroTarjeta;
    this.imprimirTicket = imprimirTicket;
    }
}

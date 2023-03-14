import { ReasonsCodesTransactionResponseModel } from "./ReasonsCodesTransactionResponse.model";

export class ReasonsCodesTransactionResponse implements ReasonsCodesTransactionResponseModel{
    codigoRazon:number;
    codigoRazonMMS: string;
    descripcionRazon: string;

    constructor(request: ReasonsCodesTransactionResponseModel = {} as ReasonsCodesTransactionResponseModel){
        const {
            codigoRazon = 0,
            codigoRazonMMS = '0',
            descripcionRazon = ''
        
        } = request;
    
        this.codigoRazon = codigoRazon;
        this.codigoRazonMMS =codigoRazonMMS;
        this.descripcionRazon = descripcionRazon;

    } 

}
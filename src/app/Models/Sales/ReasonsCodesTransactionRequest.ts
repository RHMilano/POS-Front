import { ReasonsCodesTransactionRequestModel } from "./ReasonsCodesTransactionRequest.model";

export class ReasonsCodesTransactionRequest implements ReasonsCodesTransactionRequestModel{
    codigoTipoRazonMMS: string;

    constructor(request: ReasonsCodesTransactionRequestModel = {} as ReasonsCodesTransactionRequestModel){
        const {
            codigoTipoRazonMMS = '0'
        
        } = request;
    
        this.codigoTipoRazonMMS = codigoTipoRazonMMS;

    } 
}
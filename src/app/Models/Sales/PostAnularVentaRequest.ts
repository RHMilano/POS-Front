import {PostAnularVentaRequestModel} from './PostAnularVentaRequest.model';

export class PostAnularVentaRequest implements PostAnularVentaRequestModel {
    folioVenta: string;
    codigoRazon: number;

    constructor(request: PostAnularVentaRequestModel = {} as PostAnularVentaRequestModel){
        const {
            folioVenta = '0',
            codigoRazon = 0,

        } = request;

        this.folioVenta = folioVenta;
        this.codigoRazon = codigoRazon;

    }
}

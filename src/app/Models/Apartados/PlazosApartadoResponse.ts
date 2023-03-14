import { PlazosApartadoResponseModel } from "./PlazosApartadoResponse.model";

export class PlazosApartadoResponse implements PlazosApartadoResponseModel{
    codigoPlazo : number;
    descripcion : string;
    dias : number;

    constructor(request: PlazosApartadoResponseModel = {} as PlazosApartadoResponseModel){
        const {
            codigoPlazo = 0,
            descripcion = '0',
            dias = 0

    } = request;
    
        this.codigoPlazo = codigoPlazo;
        this.descripcion = descripcion;
        this.dias = dias;
        
    }

}
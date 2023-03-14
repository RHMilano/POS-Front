export class PagoServicioResponse{
    Codigo : number;
    Marca : string;
    Nombre : string;
}


export class Servicio {
    constructor(public Codigo: number, public Marca: string, public Nombre : string) {}
}
import decimal from "decimal.js";
import { ProductsResponse } from "./ProductsResponse.model";

export class CompaniasResponse{
    Codigo : number;
    Marca: string;
    Nombre: string
}

export class Compania {
    constructor(public Codigo: number, public Marca: string, public Nombre : string) {}
}
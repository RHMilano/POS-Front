import { ApartadoResponse } from "./ApartadoResponse";
import { TipoApartado } from "../../shared/GLOBAL";

export class PagoApartado{
    pagoApartado : ApartadoResponse;
    tipoBusqueda : TipoApartado;
    montoPago : string;
}
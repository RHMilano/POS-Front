import { FormaPagoUtilizado } from "../Pagos/FormaPagoUtilizado";
import { LineaTicketModel } from "../Sales/LineaTicket.model";
import { TipoCabeceraTotalizar, TipoDetalleVenta } from "../../shared/GLOBAL";
import {InformacionFoliosTarjeta} from '../Sales/InformacionFoliosTarjeta';

export interface CrearApartadoRequestModel {
    folioApartado: string;
    diasVencimiento: number;
    codigoTipoCabeceraApartado: TipoCabeceraTotalizar;
    codigoTipoDetalleApartado: TipoDetalleVenta;
    formasPagoUtilizadas: Array<FormaPagoUtilizado>;
    lineasConDigitoVerificadorIncorrecto: Array<LineaTicketModel>;
    importePagado: number;
    saldo: number;
    informacionFoliosTarjeta?: Array<InformacionFoliosTarjeta>;
}

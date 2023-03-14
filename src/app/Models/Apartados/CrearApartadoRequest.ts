import { CrearApartadoRequestModel } from "./CrearApartadoRequest.model";
import { FormaPagoUtilizado } from "../Pagos/FormaPagoUtilizado";
import { LineaTicketModel } from "../Sales/LineaTicket.model";
import { TipoCabeceraTotalizar, TipoDetalleVenta } from "../../shared/GLOBAL";
import {InformacionFoliosTarjeta} from '../Sales/InformacionFoliosTarjeta';


export class CrearApartadoRequest implements CrearApartadoRequestModel{

    folioApartado: string;
    diasVencimiento: number;
    codigoTipoCabeceraApartado: TipoCabeceraTotalizar;
    codigoTipoDetalleApartado: TipoDetalleVenta;
    formasPagoUtilizadas: Array<FormaPagoUtilizado>;
    lineasConDigitoVerificadorIncorrecto: Array<LineaTicketModel>;
    importePagado: number;
    saldo: number;
    informacionFoliosTarjeta?: Array<InformacionFoliosTarjeta>;

    constructor(request: CrearApartadoRequestModel = {} as CrearApartadoRequestModel) {
        const {
            folioApartado = '0',
            diasVencimiento = 0,
            codigoTipoCabeceraApartado = TipoCabeceraTotalizar.apartado,
            codigoTipoDetalleApartado = TipoDetalleVenta.apartado,
            formasPagoUtilizadas = [],
            lineasConDigitoVerificadorIncorrecto = [],
            importePagado = 0,
            saldo = 0

        } = request;

        this.folioApartado = folioApartado;
        this.diasVencimiento = diasVencimiento;
        this.codigoTipoCabeceraApartado = codigoTipoCabeceraApartado;
        this.codigoTipoDetalleApartado = codigoTipoDetalleApartado;
        this.formasPagoUtilizadas = formasPagoUtilizadas;
        this.lineasConDigitoVerificadorIncorrecto = lineasConDigitoVerificadorIncorrecto;
        this.importePagado = importePagado;
        this.saldo = saldo;
    }
}

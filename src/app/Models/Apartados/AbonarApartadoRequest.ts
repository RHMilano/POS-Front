
import { FormaPagoUtilizado } from "../Pagos/FormaPagoUtilizado";
import { TipoCabeceraTotalizar } from "../../shared/GLOBAL";
import { AbonarApartadoRequestModel } from "./AbonarApartadosRequest.model";

export class AbonarApartadoRequest implements AbonarApartadoRequestModel{
     folioApartado: string;
     apartadoLiquidado: boolean;
     codigoTipoCabeceraApartado: string;
     codigoTipoDetalleApartado: string;
     importePagado: number;
     saldo: number;
     formasPagoUtilizadas: Array<FormaPagoUtilizado>;

     constructor(request: AbonarApartadoRequestModel = {} as AbonarApartadoRequestModel){
        const {
            folioApartado = '0',
            apartadoLiquidado = false,
            codigoTipoCabeceraApartado = '0',
            codigoTipoDetalleApartado = '0',
            importePagado = 0,
            saldo = 0,
            formasPagoUtilizadas = []

        } = request;

        this.folioApartado = folioApartado;
        this.apartadoLiquidado = apartadoLiquidado;
        this.codigoTipoCabeceraApartado = codigoTipoCabeceraApartado;
        this.codigoTipoDetalleApartado = codigoTipoDetalleApartado;
        this.importePagado = importePagado;
        this.saldo = saldo;
        this.formasPagoUtilizadas = formasPagoUtilizadas;

    }
}

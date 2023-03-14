import { FormaPagoUtilizado } from "../Pagos/FormaPagoUtilizado";


export interface AbonarApartadoRequestModel{
     folioApartado : string;
     apartadoLiquidado : boolean;
     codigoTipoCabeceraApartado : string;
     codigoTipoDetalleApartado : string;
     importePagado : number;
     saldo : number;
     formasPagoUtilizadas :Array<FormaPagoUtilizado>;
}

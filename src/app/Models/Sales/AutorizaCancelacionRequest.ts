export interface AutorizaCancelacionRequestModel {
    codigoTipoTrxCab: number;
    folioVenta: string;
    transaccion: number;
    nombreCajero: string;
    codigoCajeroAutorizo: number;
    totalTransaccion: number;
    totalTransaccionPositivo: number;
    totalPiezas: number;
    totalPiezasPositivas: number;
    codigoRazonMMS: string;
}

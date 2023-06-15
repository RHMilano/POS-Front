
export class RendencionPuntosLealtadRequest {
    scodigoBarras: string;
    dMonto: number;
    iCodigoTienda: number;
    iCodigoEmpleado: number;
    iCodigoCaja: number;
    iTransaccion: number;
    sFolioVenta: string;
    constructor(){
        this.scodigoBarras = "";
        this.dMonto = 0;
        this.iCodigoTienda = 0;
        this.iCodigoEmpleado = 0;
        this.iCodigoCaja = 0;
        this.iTransaccion = 0;
        this.sFolioVenta = "";
    }
}

export class RedencionPuntosLealtadResponse {

    codeDescription: string;
    codeNumber: number;
    codigoTipoTrxCab: string;
    transaccion: number;
   // sesion: string;

    constructor(){
        this.codeDescription = "";
        this.codigoTipoTrxCab = "";
        this.transaccion = 0;
        this.codeNumber = 0;
        //this.sesion = '';
    }

}

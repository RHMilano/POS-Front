import { InfoClientesCRM } from "./info_clientes_crm";

export class ConsultaLealtadResponse {

    bCantidadLimitada: boolean;
    iCantidadClientes: number;
    sMensajeError: string;
    InfoClientesCRM : InfoClientesCRM[];

    constructor() {
        this.bCantidadLimitada = true;
        this.iCantidadClientes = 0;
        this.sMensajeError = '';
    }
}
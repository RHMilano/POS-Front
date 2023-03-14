export class ConsultaLealtadRequest {

    iCodigoCliente: number;
    iCodigoClienteSistemaCredito: number;
    iCodigoEmpleado: number;
    iCodigoClienteWeb: number;
    sTelefono: string;
    sPaterno: string;
    sMaterno: string;
    sNombre: string;
    sFechaNacimiento: string;
    iCodigoTiendaRegistro: number;
    sEmail: string;
    iCodigoTienda: number;
    iCodigoCaja: number;

    constructor() {
        this.iCodigoCliente = 0;
        this.iCodigoClienteSistemaCredito = 0;
        this.iCodigoEmpleado = 0;
        this.iCodigoClienteWeb = 0;
        this.sTelefono = '';
        this.sPaterno = '';
        this.sMaterno = '';
        this.sNombre = '';
        this.sFechaNacimiento = '';
        this.iCodigoTiendaRegistro = 0;
        this.sEmail = '';
        this.iCodigoTienda = 0;
        this.iCodigoCaja = 0;
    }
}

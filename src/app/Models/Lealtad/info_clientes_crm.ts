export class InfoClientesCRM {
    iCodigoCliente: number;
    iCodigoClienteSistemaCredito: number;
    iCodigoEmpleado: number;
    iCodigoClienteWeb: number;
    sNivel: string;
    bPrimeraCompra: boolean;
    sTelefono: string;
    sPaterno: string;
    sMaterno: string;
    sNombre: string;
    sGenero: string;
    sFechaNacimiento: string;
    dSaldo: number;
    sFechaRegistro: string;
    sEmail: string;

    constructor() {
        this.iCodigoCliente = 0;
        this.iCodigoClienteSistemaCredito = 0;
        this.iCodigoEmpleado = 0;
        this.iCodigoClienteWeb = 0;
        this.sNivel='';
        this.bPrimeraCompra = false;
        this.sTelefono = '';
        this.sPaterno = '';
        this.sMaterno = '';
        this.sNombre = '';
        this.sGenero = '';
        this.sFechaNacimiento = '';
        this.dSaldo = 0;
        this.sFechaRegistro = '';
        this.sEmail = '';
    }


}
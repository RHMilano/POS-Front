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
    bTiendaCaja: boolean;

    constructor(data) {

        this.iCodigoCliente = data.iCodigoCliente == null? 0 : data.iCodigoCliente ;
        this.iCodigoClienteSistemaCredito = data.iCodigoClienteSistemaCredito == null? 0 : data.iCodigoClienteSistemaCredito ;
        this.iCodigoEmpleado = data.iCodigoEmpleado == null? 0 : data.iCodigoEmpleado ;
        this.iCodigoClienteWeb = data.iCodigoClienteWeb == null? 0 : data.iCodigoClienteWeb ;
        this.iCodigoTiendaRegistro = data.iCodigoTiendaRegistro == null? 0 : data.iCodigoTiendaRegistro ;
        this.iCodigoTienda = data.iCodigoTienda == null? 0 : data.iCodigoTienda ;
        this.iCodigoCaja = data.iCodigoCaja == null? 0 : data.iCodigoCaja ;
        this.sEmail = data.sEmail == null ? '' :  data.sEmail
        this.sNombre = data.sNombre == null ? '' :  data.sNombre
        this.sPaterno = data.sPaterno == null ? '' :  data.sPaterno
        this.sMaterno = data.sMaterno == null ? '' :  data.sMaterno
        this.sTelefono = data.sTelefono == null ? '' :  data.sTelefono
        this.sFechaNacimiento = data.sFechaNacimiento == null ? '' :  data.sFechaNacimiento
        this.bTiendaCaja = data.bTiendaCaja == null ? false :  data.bTiendaCaja

        // this.iCodigoClienteSistemaCredito = 0;
        // this.iCodigoEmpleado = 0;
        // this.iCodigoClienteWeb = 0;
        // this.sTelefono = '';
        // this.sPaterno = '';
        // this.sMaterno = '';
        // this.sNombre = '';
        // this.sFechaNacimiento = '';
        // this.iCodigoTiendaRegistro = 0;
        // this.sEmail = '';
        // this.iCodigoTienda = 0;
        // this.iCodigoCaja = 0;

    }
}

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
        var fechaLealtad = '';

        if (data.sFechaNacimiento != null && data.sFechaNacimiento != '' ) {

            let f = new Date(data.sFechaNacimiento);

            const añoActual = f.getFullYear(); 
            let mesActual:string = (f.getMonth() + 1).toString(); 
            let diaActual:string = f.getDate().toString(); 
        
            if (mesActual.toString().length == 1) {
              mesActual =`0${mesActual}`;
            }
        
            if (diaActual.toString().length == 1) {
              diaActual =`0${diaActual}`;
            }
        
             fechaLealtad =`${añoActual}${mesActual}${diaActual}`;
        }

     
        this.iCodigoCliente = data.iCodigoCliente == null? 0 : data.iCodigoCliente ;
        this.iCodigoClienteSistemaCredito = data.iCodigoClienteSistemaCredito == null? 0 : data.iCodigoClienteSistemaCredito ;
        this.iCodigoEmpleado = data.iCodigoEmpleado == null? 0 : data.iCodigoEmpleado ;
        this.iCodigoClienteWeb = data.iCodigoClienteWeb == null? 0 : data.iCodigoClienteWeb ;
        this.iCodigoTiendaRegistro = data.iCodigoTiendaRegistro ? 1 :0 ;
        this.iCodigoTienda = data.iCodigoTienda == null? 0 : data.iCodigoTienda ;
        this.iCodigoCaja = data.iCodigoCaja == null? 0 : data.iCodigoCaja ;
        this.sEmail = data.sEmail == null ? '' :  data.sEmail
        this.sNombre = data.sNombre == null ? '' :  data.sNombre
        this.sPaterno = data.sPaterno == null ? '' :  data.sPaterno
        this.sMaterno = data.sMaterno == null ? '' :  data.sMaterno
        this.sTelefono = data.sTelefono == null ? '' :  data.sTelefono
        this.sFechaNacimiento = fechaLealtad
        this.bTiendaCaja = data.bTiendaCaja == null ? false :  data.bTiendaCaja

    }
}

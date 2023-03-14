export class RegistroLealtadRequest  {

    iCodigoClienteSistemaCredito: number;
    iCodigoEmpleado: number;
    iCodigoClienteWeb: number;
    sTelefono: string;
    sPaterno: string;
    sMaterno: string;
    sNombre: string;
    sGenero: string;
    sFechaNacimiento: string;
    sFolioVenta: string;
    iCodigoTiendaRegistra: number;
    iCodigoCajaRegistra: number;
    iCodigoEmpleadoRegistra: number;
    sEmail: string;

  constructor() {
    this.iCodigoClienteSistemaCredito= 0;
    this.iCodigoEmpleado= 0;
    this.iCodigoClienteWeb= 0;
    this.sTelefono= '';
    this.sPaterno= '';
    this.sMaterno= '';
    this.sNombre= '';
    this.sGenero= '';
    this.sFechaNacimiento= '';
    this.sFolioVenta= '';
    this.iCodigoTiendaRegistra= 0;
    this.iCodigoCajaRegistra= 0;
    this.iCodigoEmpleadoRegistra= 0;
    this.sEmail= '';
   }
}

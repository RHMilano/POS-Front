export class RegistroLealtadResponse  {

    bError: boolean;
    sMensaje: string;
    sNivel: string;
    bPrimeraCompra: boolean;
    iCodigoCliente: number;

  constructor() {
    this.bError = false;
    this.sMensaje= '';
    this.sNivel= '';
    this.bPrimeraCompra= false;
    this.iCodigoCliente= 0;
   }
}

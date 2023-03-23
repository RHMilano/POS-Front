import { CabeceraVentaRequestModel } from './CabeceraVentaRequest.model';
import { TipoCabeceraTotalizar } from '../../shared/GLOBAL';
import { LineaTicket } from './LineaTicket';
import { Decimal } from 'decimal.js/decimal';

export class CabeceraVentaRequest implements CabeceraVentaRequestModel {
  folioOperacion: string;
  codigoMayorista: number;
  codigoEmpleadoVendedor: number;
  codigoCliente: number;

  // RAH: Propiedades para la integracion de lealtad
  codigoClienteLealtad: number;
  codigoClienteSistemaCredito: number;
  nivelLealtad:string;
  primeraCompraLealtad: boolean;
  fechaLealtad: string;
  //--

  numeroNominaVentaEmpleado: number;
  codigoTipoCabeceraVenta: TipoCabeceraTotalizar;
  importeVentaDescuentos: number;
  importeDevolucionBruto: number;
  importeDevolucionImpuestos: number;
  importeDevolucionNeto: number;
  importeVentaBruto: number;
  importeVentaImpuestos: number;
  importeVentaNetoOriginal: number;
  importeVentaNeto: number;
  codigoMayoristaCredito: number;
  nombreMembresia: string;
  folioDevolucion: string;
  folioVentaOriginal: string;
  devolucionSaldoAFavor: number;
  importeDevolucionTotal: number;
  clienteTieneSaldoPendientePagar: boolean;

  constructor(request: CabeceraVentaRequestModel = {} as CabeceraVentaRequestModel) {
    const {
      folioOperacion = '',
      codigoEmpleadoVendedor = 0,
      codigoMayorista = 0,
      
      //  RAH: Propiedades para la integracion de lealtad
      codigoClienteLealtad = 0,
      codigoClienteSistemaCredito = 0,
      nivelLealtad = '',
      primeraCompraLealtad = false,
      fechaLealtad = "",
      //--
      
      codigoTipoCabeceraVenta = TipoCabeceraTotalizar.ventaRegular,
      importeVentaBruto = 0,
      importeVentaDescuentos = 0,
      importeDevolucionBruto = 0,
      importeVentaImpuestos = 0,
      importeDevolucionImpuestos = 0,
      importeVentaNeto = 0,
      importeDevolucionNeto = 0,
      numeroNominaVentaEmpleado = 0,
      codigoCliente = 0,
      codigoMayoristaCredito = 0,
      nombreMembresia = '',
      folioDevolucion = '',
      folioVentaOriginal = '',
      importeVentaNetoOriginal = 0,
      devolucionSaldoAFavor = 0,
      importeDevolucionTotal = 0,
      clienteTieneSaldoPendientePagar = false
    } = request;

    this.folioOperacion = folioOperacion;
    this.codigoEmpleadoVendedor = codigoEmpleadoVendedor;
    this.codigoTipoCabeceraVenta = codigoTipoCabeceraVenta;

    //  RAH: Propiedades para la integracion de lealtad
    this.codigoClienteLealtad = codigoClienteLealtad,
    this.codigoClienteSistemaCredito = codigoClienteSistemaCredito,
    this.nivelLealtad = nivelLealtad,
    this.primeraCompraLealtad = primeraCompraLealtad,
    this.fechaLealtad = fechaLealtad
    //--

    this.importeVentaBruto = importeVentaBruto;
    this.importeVentaDescuentos = importeVentaDescuentos;
    this.importeDevolucionBruto = importeDevolucionBruto;
    this.importeVentaImpuestos = importeVentaImpuestos;
    this.importeDevolucionImpuestos = importeDevolucionImpuestos;
    this.importeVentaNeto = importeVentaNeto;
    this.importeDevolucionNeto = importeDevolucionNeto;
    this.numeroNominaVentaEmpleado = numeroNominaVentaEmpleado;
    this.codigoMayorista = codigoMayorista;
    this.codigoCliente = codigoCliente;
    this.codigoMayoristaCredito = codigoMayoristaCredito;
    this.nombreMembresia = nombreMembresia;
    this.folioDevolucion = folioDevolucion;
    this.folioVentaOriginal = folioVentaOriginal;
    this.importeVentaNetoOriginal = importeVentaNetoOriginal;
    this.devolucionSaldoAFavor = devolucionSaldoAFavor;
    this.importeDevolucionTotal = importeDevolucionTotal;
    this.clienteTieneSaldoPendientePagar = clienteTieneSaldoPendientePagar;
  }

  resetImportes() {
    this.importeVentaBruto = 0;
    this.importeVentaDescuentos = 0;
    this.importeVentaImpuestos = 0;
    this.importeVentaNeto = 0;
    this.importeDevolucionBruto = 0;
    this.importeDevolucionImpuestos = 0;
    this.importeDevolucionNeto = 0;
    // this.importeDevolucionTotal = 0;
  }

  setImportesFromLineaTicket(lineaTicketArray: Array<LineaTicket>) {

    this.resetImportes();

    lineaTicketArray.reduce((previousValue, currentValue) => {

      const lineaTicket = currentValue.getLineaTicket();

      this.importeDevolucionBruto = new Decimal(lineaTicket.importeDevolucionLineaBruto).plus(this.importeDevolucionBruto).toNumber();
      this.importeDevolucionImpuestos = new Decimal(lineaTicket.importeDevolucionLineaImpuestos).plus(this.importeDevolucionImpuestos).toNumber();
      this.importeDevolucionNeto = new Decimal(lineaTicket.importeDevolucionLineaNeto).plus(this.importeDevolucionNeto).toNumber();
      this.importeVentaBruto = new Decimal(lineaTicket.importeVentaLineaBruto).plus(this.importeVentaBruto).toNumber();
      this.importeVentaDescuentos = new Decimal(lineaTicket.importeVentaLineaDescuentos).plus(this.importeVentaDescuentos).toNumber();
      this.importeVentaImpuestos = new Decimal(lineaTicket.importeVentaLineaImpuestos1).plus(lineaTicket.importeVentaLineaImpuestos2).plus(this.importeVentaImpuestos).toNumber();
      this.importeVentaNeto = new Decimal(lineaTicket.importeVentaLineaNeto).plus(this.importeVentaNeto).toNumber();

      return currentValue;

    }, lineaTicketArray[0]);

  }

  setImportesDevolucion(lineaTicketArray: Array<LineaTicket>) {

    lineaTicketArray.reduce((previousValue, currentValue) => {

      const lineaTicket = currentValue.getLineaTicket();

      this.importeDevolucionBruto = new Decimal(lineaTicket.importeDevolucionLineaBruto).plus(this.importeDevolucionBruto).toNumber();
      this.importeDevolucionImpuestos = new Decimal(lineaTicket.importeDevolucionLineaImpuestos).plus(this.importeDevolucionImpuestos).toNumber();
      this.importeDevolucionNeto = new Decimal(lineaTicket.importeDevolucionLineaNeto).plus(this.importeDevolucionNeto).toNumber();

      return currentValue;

    }, lineaTicketArray[0]);
  }

}

import {ApartadoResponseModel} from './ApartadoResponse.model';
import {LineaTicketModel} from '../Sales/LineaTicket.model';


export class ApartadoResponse implements ApartadoResponseModel {
    articulos: Array<LineaTicketModel>;
    codigoCaja: number;
    codigoCliente: number;
    codigoEmpleado: number;
    codigoEmpleadoVendedor: number;
    codigoTienda: number;
    codigoTipoCabeceraApartado: number;
    codigoTipoDetalleApartado: number;
    consecutivoSecuenciaFormasPago: number;
    diasVencimiento: number;
    estatus: string;
    folioApartado: string;
    importeApartadoBruto: number;
    importeApartadoImpuestos: number;
    importeApartadoNeto: number;
    importePagado: number;
    saldo: number;
    nombreCliente: string;
    telefonoCliente: string;
    fechaCancelacion: string;
    fechaVencimiento: string;

    constructor(request: ApartadoResponseModel = {} as ApartadoResponseModel) {
        const {
            articulos = [],
            codigoCaja = 0,
            codigoCliente = 0,
            codigoEmpleado = 0,
            codigoEmpleadoVendedor = 0,
            codigoTienda = 0,
            codigoTipoCabeceraApartado = 0,
            codigoTipoDetalleApartado = 0,
            consecutivoSecuenciaFormasPago = 0,
            diasVencimiento = 0,
            estatus = '',
            folioApartado = '',
            importeApartadoBruto = 0,
            importeApartadoImpuestos = 0,
            importeApartadoNeto = 0,
            importePagado = 0,
            saldo = 0,
            nombreCliente = '',
            telefonoCliente = '',
            fechaCancelacion  = '',
            fechaVencimiento = ''

        } = request;
        this.articulos = articulos;
        this.codigoCaja = codigoCaja;
        this.codigoCliente = codigoCliente;
        this.codigoEmpleado = codigoEmpleado;
        this.codigoEmpleadoVendedor = codigoEmpleadoVendedor;
        this.codigoTienda = codigoTienda;
        this.codigoTipoCabeceraApartado = codigoTipoCabeceraApartado;
        this.codigoTipoDetalleApartado = codigoTipoDetalleApartado;
        this.consecutivoSecuenciaFormasPago = consecutivoSecuenciaFormasPago;
        this.diasVencimiento = diasVencimiento;
        this.estatus = estatus;
        this.folioApartado = folioApartado;
        this.importeApartadoBruto = importeApartadoBruto;
        this.importeApartadoImpuestos = importeApartadoImpuestos;
        this.importeApartadoNeto = importeApartadoNeto;
        this.importePagado = importePagado;
        this.saldo = saldo;
        this.nombreCliente = nombreCliente;
        this.telefonoCliente = telefonoCliente;
        this.fechaCancelacion = fechaCancelacion
        this.fechaVencimiento = fechaVencimiento;
    }
}

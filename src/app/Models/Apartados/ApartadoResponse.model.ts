import {LineaTicketModel} from '../Sales/LineaTicket.model';
import {s} from '@angular/core/src/render3';

export interface ApartadoResponseModel {
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
}

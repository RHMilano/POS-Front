import { EstadoCuentaMayorista } from './EstadoCuentaMayorista.model';

export interface GetMayoristaMilanoResponseModel {
  calle: string;
  ciudad: string;
  codigoPostal: number;
  codigoTienda: number;
  colonia: number;
  creditoDisponible: number;
  error: string;
  estado: string;
  estatus: string;
  fechaUltimoPago: string;
  limiteCredito: number;
  mensaje: string;
  municipio: string;
  nombre: string;
  numeroExterior: string;
  numeroInterior: string;
  pagosPeriodoActual: number;
  porcentajeComision: number;
  rfc: string;
  saldo: number;
  telefono: string;
  codigoMayorista: number;
  saldoActual: number;
  estadoCuentaMayorista: EstadoCuentaMayorista;
}

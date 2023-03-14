export class busquedaClienteFinalRequest {
  codigoMayorista: number;
  codigoClienteFinal: number;
  nombres: string;
  apellidos: string;
  ine: string;
  rfc: string;
}

export class busquedaClienteFinalResponse {
  apellidos: string;
  codigoClienteFinal: number;
  codigoMayorista: number;
  fechaNacimiento: string;
  ine: string;
  nombres: string;
  rfc: string;
  mensaje: string;
  sexo: string;
  telefono: string;
}

export class altaClienteFinalRequest {
  ine: string;
  rfc: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: string;
  calle: string;
  numeroExterior: number;
  numeroInterior: string;
  colonia: string;
  cp: number;
  ciudad: string;
  estado: string;
  codigoMayorista: number;
  telefono: number;
  fechaNacimientoField: string;
}


export class altaClienteFinalResponse {
  apellidos: string;
  codigoClienteFinal: number;
  codigoMayorista: number;
  error: string;
  fechaNacimiento: string;
  ine: string;
  mensaje: string;
  nombres: string;
  rfc: string;
  sexo: string;
  telefono: string;
}

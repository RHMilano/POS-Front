export interface EstadoCuentaMayorista {
  anio: number;
  compras: number;
  creditoDisponible: number;
  existe: boolean
  fechaCorte: string;
  fechaFinal: string;
  fechaInicial: string;
  fechaLimitePago: string;
  limiteCredito: number;
  notasDeCargo: number;
  notasDeCredito: number;
  numeroAtrasos: number;
  pagoMinimo: number;
  pagoQuincenal: number;
  pagoVencido: number;
  pagos: number;
  periodo: number;
  saldoActual: number;
  saldoAnterior: number;
}

import { ProductsResponse } from './ProductsResponse.model';

export class BusquedaAvanzadaRespose {
  numeroRegistros: number;
  productos: Array<ProductsResponse>;
}

export class BusquedaAvanzadaRequest {
  sku: string;
  // upc: string;
  extendedSearch = 1;
  codigoEstilo: string;
  codeProvider: number;
  codeDepartment: number;
  codeSubDepartment: number;
  codeClass: number;
  codeSubClass: number;
  description = '';
  numeroPagina: number;
  registrosPorPagina: number;
}

export class CatalogosRequest {
  proveedor: number;
  estilo: number;
  departamento: number;
  subdepartamento: number;
  clase: number;
  subclase: number;
}

export interface CatalogosResponse {
  codigo: number;
  descripcion: string;
}

export class SelectedParams implements SelectedParamsInterface {
  dinamico = '';
  proveedor = {
    id: 0,
    descripcion: ''
  };
  estilo = {
    id: '0',
    descripcion: ''
  };
  departamento = {
    id: 0,
    descripcion: ''
  };
  subdepartamento = {
    id: 0,
    descripcion: ''
  };
  clase = {
    id: 0,
    descripcion: ''
  };
  subclase = {
    id: 0,
    descripcion: ''
  };
  sku = '';
  upc = '';
}


export interface SelectedParamsInterface {
  dinamico?: string;
  proveedor?: {
    id: number;
    descripcion: string;
  };
  estilo?: {
    id: string;
    descripcion: string;
  };
  departamento?: {
    id: number;
    descripcion: string;
  };
  subdepartamento?: {
    id: number;
    descripcion: string;
  };
  clase?: {
    id: number;
    descripcion: string;
  };
  subclase?: {
    id: number;
    descripcion: string;
  };
  sku: string;
  upc: string;
}

export class CatalogosArticulos {
  proveedor: Array<{ id: number, descripcion: string, seachInfo: string }> = [];
  estilo: Array<{ id: number, descripcion: string, seachInfo: string }> = [];
  departamento: Array<{ id: number, descripcion: string, seachInfo: string }> = [];
  subdepartamento: Array<{ id: number, descripcion: string, seachInfo: string }> = [];
  clase: Array<{ id: number, descripcion: string, seachInfo: string }> = [];
  subclase: Array<{ id: number, descripcion: string, seachInfo: string }> = [];

  reset() {
    this.estilo = [];
    this.subdepartamento = [];
    this.clase = [];
    this.subclase = [];
  }
}

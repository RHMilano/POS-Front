export interface PagoServiciosOpcionesModel {
  skuCode?: string;
  cuenta?: string;
  infoAdicional?: InformacionAdicionalPS;
}

export interface ElementoInput {
  tipoInput: string;
  valorMaximo: number;
  valorMinimo: number;
}

export interface ElementoInputLight {
  tipoInput: string;
  valorMaximo: number;
  valorMinimo: number;
}

export interface OptionSelect {
  cantidad: number;
  texto: string;
  valor: string;
}

export interface OptionSelectLight {
  cantidad: number;
  texto: string;
  valor: string;
}


export interface ElementoSelect {
  opciones: Array<OptionSelect>;
}

export interface ElementoSelectLight {
  opciones: Array<OptionSelectLight>;
}

export interface ElementoFormulario {
  definicionElementoInput: ElementoInput;
  definicionElementoSelect: ElementoSelect;
  nombre: string;
  soloLectura: boolean;
  tipoElementoFormulario: string;
  valor: string;
}

export interface ElementoFormularioLight {
  definicionElementoInput: ElementoInputLight;
  definicionElementoSelect: ElementoSelectLight;
  nombre: string;
  soloLectura: boolean;
  tipoElementoFormulario: string;
  valor: string;
}

export interface InformacionAdicionalPS {
  moduleId: number;
  elementosFormulario: Array<ElementoFormulario>;
}

export interface InformacionAdicionalPSLight {
  moduleId: number;
  elementosFormulario: Array<ElementoFormularioLight>;
}

export interface PagoServiciosOpcionesResponse {
  datosXML: string;
  elementosFormulario: Array<ElementoFormulario>;
  moduleId: number;
}

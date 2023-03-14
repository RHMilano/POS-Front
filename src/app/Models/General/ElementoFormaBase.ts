import { ElementoFormulario } from '../Sales/PagoServiciosOpciones.model';

export class ElementoFormaBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  readOnly: boolean;
  originData: ElementoFormulario;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    readOnly?: boolean,
    originData?: ElementoFormulario
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.readOnly = options.readOnly || false;
    this.originData = options.originData || null;
  }
}


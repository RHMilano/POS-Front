import { ElementoFormaBase } from './ElementoFormaBase';
import { ElementoFormulario } from '../Sales/PagoServiciosOpciones.model';

export class ElementoFormaText<T> extends ElementoFormaBase<T> {
  type: string;

  constructor(options: {
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    readOnly?: boolean,
    value?: T,
    originData?: ElementoFormulario
  } = {}) {
    super(options);
    this.type = options['type'] || '';
  }

  get elementoFormulario(): ElementoFormulario{
    return this.originData;
  }
}

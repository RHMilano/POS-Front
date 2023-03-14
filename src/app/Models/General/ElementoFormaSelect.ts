import { ElementoFormaBase } from './ElementoFormaBase';
import { ElementoFormulario, OptionSelect } from '../Sales/PagoServiciosOpciones.model';

export class ElementoFormaSelect<T> extends ElementoFormaBase<T> {
  controlType = 'dropdown';
  options: Array<OptionSelect>;

  constructor(options: {
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    readOnly?: boolean,
    value?: T,
    originData?: ElementoFormulario,
    options?: Array<OptionSelect>
  } = {}) {
    super(options);
    this.options = options['options'] || [];
  }

  get elementoFormulario(): ElementoFormulario{
    return this.originData;
  }
}

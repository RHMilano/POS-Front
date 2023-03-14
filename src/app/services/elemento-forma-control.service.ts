import { Injectable } from '@angular/core';
import { PagoServiciosOpcionesResponse } from '../Models/Sales/PagoServiciosOpciones.model';
import { ElementoFormaBase } from '../Models/General/ElementoFormaBase';
import { GLOBAL, TipoElementoFormulario } from '../shared/GLOBAL';
import { ElementoFormaText } from '../Models/General/ElementoFormaText';
import { ElementoFormaSelect } from '../Models/General/ElementoFormaSelect';

@Injectable()
export class ElementoFormaControlService {

  constructor() {
  }

  moduleId: number;
  datosXML: string;

  getElementsFromResponse(resp: PagoServiciosOpcionesResponse): Array<ElementoFormaBase<any>> {

    this.moduleId = resp.moduleId;
    this.datosXML = resp.datosXML;

    return resp.elementosFormulario.map(element => {
      if (element.tipoElementoFormulario === TipoElementoFormulario.input) {


        return new ElementoFormaText<string>({
          key: element.nombre,
          controlType: element.definicionElementoInput.tipoInput,
          label: GLOBAL.upperCaseFirst(element.nombre.replace('_', ' ').toLocaleLowerCase()),
          order: 1,
          required: true,
          readOnly: element.soloLectura,
          value: element.valor,
          originData: element
        });

      } else {

        return new ElementoFormaSelect<string>({
          originData: element,
          readOnly: element.soloLectura,
          required: true,
          order: 1,
          label: GLOBAL.upperCaseFirst(element.nombre.replace('_', ' ').toLocaleLowerCase()),
          key: element.nombre,
          value: element.valor,
          options: element.definicionElementoSelect.opciones
        });


        // select aun por definir
      }
    });

  }

}

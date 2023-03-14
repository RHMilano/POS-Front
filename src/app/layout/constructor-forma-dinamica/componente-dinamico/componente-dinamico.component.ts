import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ElementoFormaText } from '../../../Models/General/ElementoFormaText';
import { ElementoFormaSelect } from '../../../Models/General/ElementoFormaSelect';

@Component({
  selector: 'app-componente-dinamico',
  templateUrl: './componente-dinamico.component.html',
  styleUrls: ['./componente-dinamico.component.css']
})
export class ComponenteDinamicoComponent {

  @Input() elemento: ElementoFormaText<any>&ElementoFormaSelect<any>;
  @Input() form: FormGroup;
  @Input() index: number;

  get isValid() {
    return this.form.controls[this.elemento.key].valid;
  }

}

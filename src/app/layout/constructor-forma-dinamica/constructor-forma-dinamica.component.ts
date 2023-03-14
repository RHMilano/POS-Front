import { Component, Input, OnInit } from '@angular/core';
import { ElementoFormaBase } from '../../Models/General/ElementoFormaBase';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-constructor-forma-dinamica',
  templateUrl: './constructor-forma-dinamica.component.html',
  styleUrls: ['./constructor-forma-dinamica.component.css']
})
export class ConstructorFormaDinamicaComponent implements OnInit {

  @Input() elementos: ElementoFormaBase<any>[] = [];
  @Input() form: FormGroup;
  @Input() callback: () => void;
  constructor() {
  }

  ngOnInit() {

    this.elementos.forEach(elemento => {
      const formControl = elemento.required ? new FormControl({
        value: elemento.value || '',
        disabled: elemento.readOnly
      }, Validators.required) : new FormControl({value: elemento.value || '', disabled: elemento.readOnly});
      this.form.addControl(elemento.key, formControl);
    });

  }

  keyUpEnter(){
    this.callback();
  }

}

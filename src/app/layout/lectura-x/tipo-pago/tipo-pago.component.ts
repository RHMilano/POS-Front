import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Denominaciones} from '../../../Models/Pagos/Denominaciones';
import {LecturaXComponent} from '../lectura-x.component';


@Component({
  selector: 'app-tipo-pago',
  templateUrl: './tipo-pago.component.html',
  styleUrls: ['./tipo-pago.component.css']
})
export class TipoPagoComponent implements OnInit {

  pagos;
  @Input() listaPagos: Denominaciones;
  @Input() listaFormaPagos: any;
  @Input() index: number;
  @Input() record: number;
  @Input() instancia: LecturaXComponent;
  @Output() seleccion = new EventEmitter();
  @Input() showDenominaciones: boolean;
  @Input() currentSelection: number;
  @Input() currentSelectionT: number;
  @Input() cant: number;
  denominaciones: Denominaciones;

  @ViewChild('denominacionRow') denominacionRow: ElementRef;
  @ViewChild('denominacionQty') denominacionQty: ElementRef;
  @ViewChild('pagoRow') pagoRow: ElementRef;
  @ViewChild('focusInp') focusInp: ElementRef;

  keyboardUnListener: () => void;

  constructor(private _renderer: Renderer2) {
  }

  ngOnInit() {
    this.pagos = this.listaPagos;
    this.denominaciones = this.listaPagos;
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSelection']) {
      if (this.index === this.currentSelection) {

        if(this.showDenominaciones){
          this.setFocusPago();
        } else {
          this.setFocusOnQty();
        }

        /*this.keyboardUnListener = this._renderer.listen(this.denominacionRow.nativeElement, 'keyup', (event: KeyboardEvent) => {

          const keyCode = event.which || event.keyCode;   // 189 -   187 +
          if (keyCode === 187) {
            this.agregarCantidad();
          } else if (keyCode === 189) {
            this.eliminarCantidad();
          }
        });*/

      } else {

        if (this.keyboardUnListener) {
          this.keyboardUnListener();
        }

      }
    }
  }

  agregarCantidad() {
    this.denominaciones.agregarCantidad();
    this.instancia.editTotal();
  }

  eliminarCantidad() {
    this.denominaciones.eliminarCantidad();
    this.instancia.editTotal();
  }

  setRow(item: number) {
    if(item >= 0) {
      this.denominaciones.editarDenominacion(item);
    }
  }

  editarCantidad(value: number) {
    if(value >= 0) {
      this.denominaciones.editarCantidad(value);
      this.instancia.editTotal();
    }
  }

  setFocusOnQty() {

    if (this.index === this.currentSelection) {
      setTimeout(() => {
        this.denominacionQty.nativeElement.focus();
        this.denominacionQty.nativeElement.setSelectionRange(0, this.denominaciones.cantidad.toString().length);
      }, 0);
    }
  }

  setFocusPago() {

    if (this.index === this.currentSelection) {
      setTimeout(() => {
        this.focusInp.nativeElement.focus();
        this.focusInp.nativeElement.setSelectionRange(0, this.cant.toString().length);
      }, 0);
    }
  }


}

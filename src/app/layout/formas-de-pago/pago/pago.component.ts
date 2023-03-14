import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LineaPago } from '../LineaPago';
import { FormasDePagoComponentInterface } from '../../../Models/FrontEnd/FormasDePagoComponentInterface';


@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  pagos;
  grandTotal: number;
  numberItems: number;

  @Input('listaPagos') listaPagos: LineaPago;
  @Input('index') index: number;
  @Output() seleccion = new EventEmitter();
  @Input('formasPago') formasPago: FormasDePagoComponentInterface;
  @Input() currentSelection: number;
  botonEliminar = false;

  constructor() {
  }

  ngOnInit() {
    //OCG alert(JSON.stringify(this.listaPagos));
    this.pagos = this.listaPagos;
    if (this.listaPagos.isAnulable) {
      this.botonEliminar = true;
    }
  }

  eliminarPago(pago) {
    this.formasPago.eliminar(pago);
  }
}




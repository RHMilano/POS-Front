import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-cancelar-transaccion',
  templateUrl: './cancelar-transaccion.component.html',
  styleUrls: ['./cancelar-transaccion.component.css']
})
export class CancelarTransaccionComponent implements OnInit {

  mensajeCancelacion: string;
  @Output() cancelarTicket = new EventEmitter();

  constructor(private _modalService: BsModalService, private _bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.mensajeCancelacion = '¿Deseas cancelar la transacci\u00F3n actual?';
  }


  declineCancelarTicket() {
    this._bsModalRef.hide();
  }

  confirmCancelarTicket() {
    localStorage.setItem('ConfirmaCancelarTransaccion', '1');
    this._bsModalRef.hide();
    this.cancelarTicket.emit(true);
  }
}

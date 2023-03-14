import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {TipoCorte} from '../../shared/GLOBAL';
import {LecturaXComponent} from '../lectura-x/lectura-x.component';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {SudoCallbackFactory} from '../../Models/General/SudoCallbackFactory';
import {TicketVirtualComponentInterface} from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-lectura-z',
  templateUrl: './lectura-z.component.html',
  styleUrls: ['./lectura-z.component.css']
})
export class LecturaZComponent implements OnInit {


  constructor(public _alertService: AlertService, public modalRef: BsModalRef, public modalService: BsModalService) { }

  ngOnInit() {
    this._alertService.getSkuBlock();
  }

  closeModal() {
    //this._alertService.unBlockElements();
    this.modalRef.hide();
  }

  confirmCorte() {
    this.closeModal();
    return new SudoCallbackFactory({
      component: this,
      ModalLevel: 1,
      passthroughAdmin: true,
      callBack: 'sudoLecturaZ',
      modalService: this.modalService
    });
  }

  sudoLecturaZ() {
    const initialState = {TipoCorte: TipoCorte.corteZ};
    const options: ModalOptions = {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
      initialState
    };
    this.modalRef = this.modalService.show(LecturaXComponent, options);
  }
}

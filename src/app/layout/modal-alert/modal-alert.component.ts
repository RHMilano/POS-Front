import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Msg } from '../../Models/General/alert.model';
import { MsgService } from '../../services/msg.service';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent implements OnInit {

  modalRef: BsModalRef;
  message: Msg = {message: '', tipo: 'info'};

  @ViewChild('templError') templateError: TemplateRef<any>;
  @ViewChild('templInfo') templateInfo: TemplateRef<any>;

  constructor(private modalService: BsModalService, private _msgService: MsgService) {
  }

  ngOnInit() {
    this._msgService.msg$.map(
      x => this.isMsg(x) ? x : false
    ).subscribe(
      (msg: Msg) => {
        if (!!msg) {
          this.message = msg;
          setTimeout(_ => {
            this.openModal();
          }, 100);
        }
      }, err => console.log
    );
  }

  openModal() {
    this.modalRef = this.modalService.show(
      (this.message.tipo === 'error' ? this.templateError : this.templateInfo),
      this.message.config ? this.message.config : null
    );
  }

  isMsg(value: any): value is Msg {
    return value && (typeof value.message === 'string');
  }
}

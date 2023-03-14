import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';
import {AutenticacionOfflineRequest} from '../../Models/InicioFin/AutenticacionOfflineRequest';
import {InicioFinDiaService} from '../../services/inicio-fin-dia.service';
import {LoginComponentInterface} from '../../Models/FrontEnd/LoginComponentInterface';
import {TipoCorte} from '../../shared/GLOBAL';
import {LecturaXComponent} from '../lectura-x/lectura-x.component';
import {FinDiaComponentInterface} from '../../Models/FrontEnd/FinDiaComponentInterface';
import {ResultadoValidacionCaja} from '../../Models/InicioFin/ResultadoValidacionCaja';
import {GeneralService} from '../../services/general.service';

@Component({
  selector: 'app-autenticacion-corte-z',
  templateUrl: './autenticacion-corte-z.component.html',
  styleUrls: ['./autenticacion-corte-z.component.css'],
  providers: [ GeneralService ]
})
export class AutenticacionCorteZComponent implements OnInit {

  @Input() codigoCaja: number;
  @Input() finDiaInstance: FinDiaComponentInterface;
  @Input() clave: string;
 // clave: string;

  constructor(public modalRef: BsModalRef, public modalService: BsModalService, private _alertService: AlertService,
              private _generalService: GeneralService) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalRef.hide();
  }

  closeValidacion() {
    this.modalService._hideModal(1);
  }

  enviarCodigo() {
    if (this.clave) {
      const autenticacion = new AutenticacionOfflineRequest();
      autenticacion.clave = this.clave;
      this._generalService.autenticacionLecturaService(autenticacion).subscribe(resp => {
        if (Number(resp.codeNumber) === 400) {
          this.lecturaZ();
          this._alertService.show({titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription});
          this.closeModal();
        } else {
          this._alertService.show({titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription});
        }
      });
    } else {
      this._alertService.show({titulo: 'Milano', tipo: 'info', mensaje: 'Favor de ingresar código de autorización'});
    }
  }

  lecturaZ() {
    this.closeModal();
    const initialState = {clave: this.clave, TipoCorte: TipoCorte.corteZ, Caja: this.codigoCaja, finDiaInstance: this.finDiaInstance};
    const options: ModalOptions = {
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false,
      initialState
    };
    this.modalRef = this.modalService.show(LecturaXComponent, options);
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {AlertService} from '../../services/alert.service';
import {AutenticacionOfflineRequest} from '../../Models/InicioFin/AutenticacionOfflineRequest';
import {InicioFinDiaService} from '../../services/inicio-fin-dia.service';
import {LoginComponentInterface} from '../../Models/FrontEnd/LoginComponentInterface';

@Component({
  selector: 'app-autenticacion-offline',
  templateUrl: './autenticacion-offline.component.html',
  styleUrls: ['./autenticacion-offline.component.css'],
  providers: [ InicioFinDiaService ]
})
export class AutenticacionOfflineComponent implements OnInit {

  clave: string;

  @Input() loginInstance: LoginComponentInterface;
  @Input() folio: string;
  @Input() fecha: Date;

  constructor(public modalRef: BsModalRef, private _iniciofinService: InicioFinDiaService, private _alertService: AlertService) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalRef.hide();
  }

  enviarCodigo() {
    if (this.clave) {
      const autenticacion = new AutenticacionOfflineRequest();
      autenticacion.clave = this.clave;
      this._iniciofinService.autenticacionOfflineService(autenticacion).subscribe(resp => {
        if (Number(resp.codeNumber) === 400) {
          this._alertService.show({titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription});
          this.closeModal();
          this.loginInstance.getConfig().then().catch(
            () => {});
        } else {
          this._alertService.show({titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription});
        }
      });
    } else {
      this._alertService.show({titulo: 'Milano', tipo: 'info', mensaje: 'Favor de ingresar código de autorización'});
    }
  }

}

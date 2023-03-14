import {Component, OnInit} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {GeneralService} from '../../services/general.service';
import {AlertService} from '../../services/alert.service';
import {changePasswordRequest} from '../../Models/Security/ChangePassword';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css'],
  providers: [GeneralService]
})
export class CambiarPasswordComponent implements OnInit {
  user: number;
  pass: string;
  passConfirm: string;

  constructor(private modalService: BsModalService, private _generalService: GeneralService, public _alertService: AlertService) {
  }

  ngOnInit() {
    let usuarioLogin = JSON.parse(localStorage.getItem('accessInfo')).numberEmployee;
    this.user = usuarioLogin;
  }

  closeModal() {
    this.modalService._hideModal(1);
  }

  onSubmit() {
    if (this.user != undefined && this.pass != undefined && this.pass == this.passConfirm) {
      let cpPet = new changePasswordRequest();
      cpPet.numberAttempts = 1;
      cpPet.numberEmployee = this.user;
      cpPet.password = this.pass;
      this._generalService.changePassword(cpPet).subscribe(resp => {

        if (Number(resp.codeNumber) === 106) {
          this._alertService.show({mensaje: resp.codeDescription, tipo: 'info', titulo: 'Milano'});
          this.closeModal();
        } else {
          //this.user = null;
          this.pass = null;
          this.passConfirm = null;
          this._alertService.show({mensaje: resp.codeDescription, tipo: 'error', titulo: 'Error'});
        }
      });
    } else if(this.pass !== this.passConfirm) {
      this._alertService.show({mensaje: 'Las contraseñas no coinciden', tipo: 'warning', titulo: 'Milano'});
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { CapturaLuzRequest } from '../../Models/InicioFin/CapturaLuzRequest';
import { AlertService } from '../../services/alert.service';
import { tipoCapturaLuz } from '../../shared/GLOBAL';
import { CashOutComponent } from '../fin-dia/cash-out/cash-out.component';
import { InicioFinDiaService } from '../../services/inicio-fin-dia.service';
import { LoginComponentInterface } from '../../Models/FrontEnd/LoginComponentInterface';
import { environment as env } from '../../../environments/environment';
@Component({
  selector: 'app-captura-luz',
  templateUrl: './captura-luz.component.html',
  styleUrls: ['./captura-luz.component.css'],
  providers: [InicioFinDiaService]
})
export class CapturaLuzComponent implements OnInit {

  consumo: number;
  tipoConsumo: string;
  consumoInicio: number;
  @Input() tipoCapturaLuz: tipoCapturaLuz;
  @Input() loginInstance: LoginComponentInterface;
  @Input() capturaInicio: boolean;

  constructor(public modalService: BsModalService, private _iniciofinService: InicioFinDiaService,
    private _alertService: AlertService, private modalRef: BsModalRef) { }

  ngOnInit() {
    if (this.tipoCapturaLuz === tipoCapturaLuz.inicio) {
      this.tipoConsumo = 'inicial';
    } else {
      this.tipoConsumo = 'final';
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  enviarConsumo() {
    if (this.consumo) {
      const capturaLuz = new CapturaLuzRequest(); // OCG: Interface para registro de luz
      capturaLuz.valorLectura = this.consumo;
      capturaLuz.versionPos = env.posversion;
      if (this.tipoCapturaLuz === tipoCapturaLuz.inicio) {
        //JSON.stringify(capturaLuz));
        this._iniciofinService.capturaLuzService(capturaLuz).subscribe(resp => {
          if (Number(resp.codeNumber) === 400) {
            this.closeModal();
            this._alertService.show({ titulo: 'Milano', tipo: 'success', mensaje: resp.codeDescription });
            this.loginInstance.getConfig().then().catch(
              () => { });
          } else {
            this._alertService.show({ titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription });
          }
        });
      } else {
        capturaLuz.valorLecturaAdicional = this.consumoInicio ? this.consumoInicio : 0;
        this._iniciofinService.capturaLuzFinService(capturaLuz).subscribe(resp => {
          if (Number(resp.codeNumber) === 100) {
            this.closeModal();
            const options: ModalOptions = {
              class: 'modal-max',
              backdrop: 'static',
              keyboard: false
            };
            this.modalRef = this.modalService.show(CashOutComponent, options);
          } else {
            this._alertService.show({ titulo: 'Milano', tipo: 'error', mensaje: resp.codeDescription });
          }
        });
      }
    } else {
      this._alertService.show({ titulo: 'Milano', tipo: 'info', mensaje: 'Favor de ingresar consumo de luz' });
    }
  }
}

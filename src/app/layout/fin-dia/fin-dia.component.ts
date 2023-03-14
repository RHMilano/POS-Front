import { Component, Input, OnInit } from '@angular/core';
import { ResultadoValidacionCaja } from '../../Models/InicioFin/ResultadoValidacionCaja';
import { AlertService } from '../../services/alert.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { tipoCapturaLuz, TipoCorte } from '../../shared/GLOBAL';
import { CapturaLuzComponent } from '../captura-luz/captura-luz.component';
import { LecturaXComponent } from '../lectura-x/lectura-x.component';
import { CashOutComponent } from './cash-out/cash-out.component';
import { InicioFinDiaService } from '../../services/inicio-fin-dia.service';
import { CapturaLuzRequest } from '../../Models/InicioFin/CapturaLuzRequest';
import { FinDiaComponentInterface } from '../../Models/FrontEnd/FinDiaComponentInterface';
import { AutenticacionCorteZComponent } from '../autenticacion-corte-z/autenticacion-corte-z.component';
@Component({
  selector: 'app-fin-dia',
  templateUrl: './fin-dia.component.html',
  styleUrls: ['./fin-dia.component.css'],
  providers: [InicioFinDiaService]
})
export class FinDiaComponent implements OnInit {

  @Input() capturaLuz: boolean;
  @Input() validacionCajas: Array<ResultadoValidacionCaja>;
  @Input() capturaLuzInicio: boolean;
  @Input() validacionCajasEjec: boolean;
  clave: string;
  FinDiaInstance: FinDiaComponentInterface;
  validacion: boolean;
  cajas = [];


  constructor(public modalRef: BsModalRef, public _alertService: AlertService, public modalService: BsModalService, public _iniciofinService: InicioFinDiaService) { }

  ngOnInit() {
    this.validacion = true;
    this.FinDiaInstance = this;
    this.fetch((data) => {
      this.cajas = data;
    });
  }

  fetch(cb) {
    cb(this.validacionCajas);
  }

  solicitarCaptura() {
    this.closeModal();
    if (this.capturaLuz) {
      const initialState = { tipoCapturaLuz: tipoCapturaLuz.fin, capturaInicio: this.capturaLuzInicio };
      const options: ModalOptions = {
        class: 'modal-md',
        backdrop: 'static',
        keyboard: false,
        initialState
      };
      this.modalRef = this.modalService.show(CapturaLuzComponent, options);
    } else {
      const capturaLuz = new CapturaLuzRequest();
      this._iniciofinService.capturaLuzFinService(capturaLuz).subscribe(resp => {
        if (Number(resp.codeNumber) === 100) {
          this.closeModal();
          const options: ModalOptions = {
            class: 'modal-max',
            backdrop: 'static',
            keyboard: false
          };
          //-FIX: resolver
          //setTimeout( this.modalRef = this.modalService.show(CashOutComponent, options), 0) ;
        }
      });
    }
  }

  closeModal() {
    this.modalService._hideModal(1);
  }

  lecturaZ(codigoCaja) {
    // this.closeModal();
    this.validacion = false;
    if (!this.clave) {
      const initialState = { clave: this.clave, codigoCaja: codigoCaja, finDiaInstance: this.FinDiaInstance };
      const options: ModalOptions = {
        class: 'modal-md',
        backdrop: 'static',
        keyboard: false,
        initialState
      };
      this.modalRef = this.modalService.show(AutenticacionCorteZComponent, options);
    } else {
      const initialState = { clave: this.clave, TipoCorte: TipoCorte.corteZ, Caja: codigoCaja, finDiaInstance: this.FinDiaInstance };
      const options: ModalOptions = {
        class: 'modal-lg',
        backdrop: 'static',
        keyboard: false,
        initialState
      };
      this.modalRef = this.modalService.show(LecturaXComponent, options);
    }
  }

  confirmaCaptura() {
    this._iniciofinService.confirmaFinDeDia().subscribe(resp => {
      if (resp.length > 0) {
        let msg = '\n Mensage Interno: \n\n' + resp + '\n';
        if(confirm(msg)) {
          this.solicitarCaptura();
        } 
      } else {
        this.solicitarCaptura();
      }
    });
  }
}

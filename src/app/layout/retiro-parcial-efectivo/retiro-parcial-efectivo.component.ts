import { Component, Input, OnInit } from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import { AlertService } from '../../services/alert.service';
import { GeneralService } from '../../services/general.service';
import { RetiroParcialEfectivoModel } from '../../Models/General/RetiroParcialEfectivo.model';
import { DataTransferService } from '../../services/data-transfer.service';
import { InformacionAsociadaRetiroEfectivo } from '../../Models/General/InformacionAsociadaRetiroEfectivo';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import {SudoCallbackFactory} from '../../Models/General/SudoCallbackFactory';

@Component({
  selector: 'app-retiro-parcial-efectivo',
  templateUrl: './retiro-parcial-efectivo.component.html',
  styleUrls: ['./retiro-parcial-efectivo.component.css'],
  providers: [GeneralService]
})
export class RetiroParcialEfectivoComponent implements OnInit {

  Importe: number;
  Confirmacion: number;
  cerrar: boolean;
  montoMaximo: number;
  cargando: boolean;
  @Input() informacionRetiro: InformacionAsociadaRetiroEfectivo;
  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;

  constructor(public modalRef: BsModalRef, private _alertService: AlertService, private retiroService: GeneralService,
              public _dataTransfer: DataTransferService, public modalService: BsModalService) {
  }

  ngOnInit() {
    if (this.informacionRetiro) {
      this.montoMaximo = this.informacionRetiro.efectivoActualCaja - this.informacionRetiro.dotacionInicialCaja;
      //this.Importe = this.montoMaximo;
      this.cerrar = false;
    } else {
      this.cerrar = true;
    }
  }


  /**Método para cerrar el diálogo de importe de retiro de efectivo*/
  closeModal() {
    this.modalRef.hide();
  }

  retirarEfectivo() {
    if (!this.Importe || this.Importe <= 0) {
      this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido'});
    } else if (this.Importe !== this.Confirmacion) {
      this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Los montos capturados deben coincidir'});
    } else {
      if (this.informacionRetiro && !this.cargando) {
          const retiroEfectivoRequest = new RetiroParcialEfectivoModel();
          retiroEfectivoRequest.monto = this.Importe;
          this.cargando = true;
          this.retiroService.retiroParcialEfectivo(retiroEfectivoRequest).subscribe(
            response => {
              if (Number(response.codeNumber) === 360) {
                this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Operación exitosa'});
                setTimeout( () => this.ticketVirtualInstance.resetTicket(), 500);
                this.ticketVirtualInstance.focusOnSkuInput();
                this.closeModal();
                this.cargando = false;
              } else {
                this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: response.codeDescription});
                this.cargando = false;
              }
            }
          );
      } else {
        if (!this.cargando) {
          this.cargando = true;
          const retiroEfectivoRequest = new RetiroParcialEfectivoModel();
          retiroEfectivoRequest.monto = this.Importe;
          this.cargando = true;
          this.retiroService.retiroParcialEfectivo(retiroEfectivoRequest).subscribe(
            response => {
              if (Number(response.codeNumber) === 360) {
                this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: response.codeDescription});
                this.closeModal();
                this.cargando = false;
              } else {
                this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: response.codeDescription});
                this.cargando = false;
              }
            }
          );
        }
      }
    }
  }

}

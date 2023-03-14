import {Component, OnInit} from '@angular/core';
import {SalesService} from '../../services/sales.service';
import {ReasonsCodesTransactionRequest} from '../../Models/Sales/ReasonsCodesTransactionRequest';
import {ReasonsCodesTransactionResponseModel} from '../../Models/Sales/ReasonsCodesTransactionResponse.model';
import {BsModalService} from 'ngx-bootstrap';
import {DataTransferService} from '../../services/data-transfer.service';
import {Botones} from '../../Models/General/Funciones.model';
import {AlertService} from '../../services/alert.service';
import {EgresoRequest} from '../../Models/General/EgresoRequest';
import {GeneralService} from '../../services/general.service';

@Component({
  selector: 'app-retiro-egresos',
  templateUrl: './retiro-egresos.component.html',
  styleUrls: ['./retiro-egresos.component.css'],
  providers: [SalesService, GeneralService]
})
export class RetiroEgresosComponent implements OnInit {

  cantidadRetirar: number;
  motivoRetiro: number;
  motivosRetiro: Array<ReasonsCodesTransactionResponseModel>;

  constructor(private _salesService: SalesService, private modalService: BsModalService,
              private dataTransfer: DataTransferService, private _alertService: AlertService, private _generalService: GeneralService) {
  }

  ngOnInit() {
    const reasonRequest = new ReasonsCodesTransactionRequest();
    reasonRequest.codigoTipoRazonMMS = 'TDS0';
    this._salesService.ReasonsCodesTransactionService(reasonRequest).subscribe(response => {
      this.motivosRetiro = response;
    });
  }

  closeModal() {
    this.modalService._hideModal(1);
  }

  cancelRetiro() {
    this.closeModal();
  }

  aceptarRetiro() {
    if (!this.cantidadRetirar || Number(this.cantidadRetirar) <= 0 ) {
      this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Favor de capturar monto válido'});
    }else {
      const egresoRequest = new EgresoRequest();
      egresoRequest.monto = this.cantidadRetirar;
      egresoRequest.codigoRazon = this.motivoRetiro;
      this._generalService.egreso(egresoRequest).subscribe( response  => {
        if (Number(response.codeNumber) === 365) {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: 'Operación exitosa'});
          this.closeModal();
        } else {
          this._alertService.show({tipo: 'info', titulo: 'Milano', mensaje: response.codeDescription});
        }
      });
      this.dataTransfer.$coordinadorFuncionesBotonera.next({
        boton: Botones.reset, action: 'enabled', dontHidde: false
      });
      this.closeModal();
    }
  }
}

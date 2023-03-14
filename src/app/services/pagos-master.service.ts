import { Injectable, OnDestroy } from '@angular/core';
import { PagosToDisplay } from '../Models/Pagos/PagosToDisplay';
import { DataTransferService } from './data-transfer.service';
import { TotalesLast } from '../Models/Pagos/TotalesLast';
import { PagosMaster } from '../Models/Pagos/PagosMaster';
import { Subscription } from 'rxjs/Subscription';
import { FlujoBloqueo, PagosOps } from '../shared/GLOBAL';
import { FormasDePagoComponentInterface } from '../Models/FrontEnd/FormasDePagoComponentInterface';
import { FormasPagoMenuComponentInterface } from '../Models/FrontEnd/FormasPagoMenuComponentInterface';
import { DescuentoService } from './descuento.service';

@Injectable()
export class PagosMasterService implements OnDestroy {

  PagosMaster: PagosMaster = new PagosMaster();
  FormasDePagoInstance: FormasDePagoComponentInterface;
  FormasDePagoMenuInstance: FormasPagoMenuComponentInterface;
  formasPagoSub: Subscription;
  formasPagoMenuSub: Subscription;
  pagoAdded: boolean;

  constructor(private _dataTransfer: DataTransferService, private _descuentoService: DescuentoService) {
    this.formasPagoSub = _dataTransfer.$setFormasDePagoInstance.subscribe(instance => this.FormasDePagoInstance = instance);
    this.formasPagoMenuSub = _dataTransfer.$setFormasDePagoMenuInstance.subscribe(instance => this.FormasDePagoMenuInstance = instance);
  }

  addPago(value: PagosToDisplay) {
    this.PagosMaster.addPagoDefinitivamente(value);
    this.FormasDePagoInstance.addPago(this.PagosMaster);
    this.pagoAdded = true;

    //console.log(`addPago value: ${value}`);

    this._descuentoService.checkFormaPagoDescuento(value.formaDePago);
  }

  ngOnDestroy(): void {
    this.formasPagoSub.unsubscribe();
    this.formasPagoMenuSub.unsubscribe();
  }

  deletePago(idPago: number) {
    const pagoToDelete = this.PagosMaster.getPagoById(idPago);
    const deletedPago = this.PagosMaster.deletePagoArray(idPago);

    if (deletedPago.PagosOps === PagosOps.efectivo) {
      this.FormasDePagoMenuInstance.bloqueaBtn(FlujoBloqueo.efectivoEliminado);
    }

    this.pagoAdded = this._descuentoService.pagoAdded = !!this.PagosMaster.pagos.length;

    this._descuentoService.checkFormaPagoDescuentoRemoved(pagoToDelete.formaDePago);

    if (!this.pagoAdded) {
      this.reset();
      this.initSecuencia(this.FormasDePagoInstance.secuencia);
    }
  }

  updateTotal(pago: TotalesLast) {
    this.PagosMaster.setTotales(pago);
  }

  reset() {
    this.pagoAdded = false;
    this.PagosMaster.reset();
    this._descuentoService.reset();
  }

  initSecuencia(secuencia: number) {
    this.PagosMaster.initSecuencia(secuencia);
  }
}

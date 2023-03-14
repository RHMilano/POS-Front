import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { FinalizarVentaRequest } from '../../Models/Sales/FinalizarVentaRequest';
import { SalesService } from '../../services/sales.service';
import { ReasonsCodesTransactionRequest } from '../../Models/Sales/ReasonsCodesTransactionRequest';
import { AlertService } from '../../services/alert.service';
import { ReasonsCodesTransactionResponse } from '../../Models/Sales/ReasonsCodesTransactionResponse';
import { PostAnularVentaRequest } from '../../Models/Sales/PostAnularVentaRequest';
import { AnularTotalizarVentaRequest } from '../../Models/Sales/AnularTotalizarVentaRequest';
import { AnularApartado } from '../../Models/Apartados/AnularApartado';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { ArticuloComponentInterface } from '../../Models/FrontEnd/ArticuloComponentInterface';
import { AutorizaCancelacionRequestModel } from '../../Models/Sales/AutorizaCancelacionRequest';


@Component({
  selector: 'app-razones-cancelacion',
  templateUrl: './razones-cancelacion.component.html',
  styleUrls: ['./razones-cancelacion.component.css'],
  providers: [SalesService]
})
export class RazonesCancelacionComponent implements OnInit, OnDestroy {

  @Input() ticketVirtualInstance: TicketVirtualComponentInterface;
  @Input() articuloInstance: ArticuloComponentInterface;
  @Input() doLogout: boolean;

  razones: Array<ReasonsCodesTransactionResponse> = [];
  cancelarSub;
  anularSub;
  finalizaVenta: FinalizarVentaRequest;
  SelectRazon;
  postAnularRequest: PostAnularVentaRequest;
  condigoSeleccionado: number;
  realizarApartado: boolean;


  constructor(public _dataTransfer: DataTransferService, public modalRef: BsModalRef,
    private router: Router, private ventaService: SalesService, private reasonsCodesTransactionService: SalesService,
    private _alertService: AlertService) {
  }


  ngOnInit() {
    this.cargaRazones();
    this.cancelarSub = this._dataTransfer.$anularTransaccionData.subscribe(
      item => this.finalizaVenta = item
    );
    this.anularSub = this._dataTransfer.$postanularTransaccionData.subscribe(
      item => this.postAnularRequest = item
    );
    if (this.ticketVirtualInstance) {
      this.realizarApartado = this.ticketVirtualInstance.realizarApartado;
    }

  }

  ngOnDestroy() {
    this.cancelarSub.unsubscribe();
    this.anularSub.unsubscribe();
  }

  cargaRazones() {

    const reasonRequest = new ReasonsCodesTransactionRequest();
    reasonRequest.codigoTipoRazonMMS = 'VOD0';

    this.reasonsCodesTransactionService.ReasonsCodesTransactionService(reasonRequest).subscribe(
      data => {
        if (data.length) {
          this.razones = [];
          data.forEach(index => {
            const razon = index;
            this.razones.push(razon);
          });
        } else {
          this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: 'No se encontraron razones de cancelación' });
        }
      }
    );
  }

  enviarRazon(Codigo) {
    this.condigoSeleccionado = Codigo;
  }

  anularTransaccion() {
    //debugger
    let invocar = false;
    if (this.postAnularRequest) {
      invocar = true;
    } else if (this.realizarApartado) {
      invocar = false;
    } else if (this.articuloInstance) {
      invocar = false;
    } else {
      invocar = true;
    }

    this.AutorizaCancelacion(invocar).then( () => {
      if (this.postAnularRequest) {
        this.postAnularRequest.codigoRazon = this.condigoSeleccionado;
        this.ventaService.PostAnularService(this.postAnularRequest).subscribe(
          response => {
            if (Number(response.codeNumber) === 308) {
              this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: 'Venta anulada exitosamente' });
              this.modalRef.hide();
            } else {
              this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: response.codeDescription });
            }
          }
        );
      } else if (this.realizarApartado) {
        const anularRequest = new AnularApartado({
          codigoRazon: Number(this.condigoSeleccionado),
          folioApartado: this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.folioOperacion
        });

        this.ventaService.anularApartado(anularRequest).subscribe(
          resp => {
            if (Number(resp.codeNumber) === 308) {
              this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: 'Venta cancelada exitosamente' });
              this.ticketVirtualInstance.resetTicket();
              this.modalRef.hide();
            } else {
              this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: resp.codeDescription });
            }
          }
        );

      } else if (this.articuloInstance) {
        this.articuloInstance.setRazonDevolucion(Number(this.condigoSeleccionado));
        this.modalRef.hide();

      } else {   
        const folio = this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.folioOperacion;

        const anularRequest = new AnularTotalizarVentaRequest({
          codigoRazon: Number(this.condigoSeleccionado),
          folioVenta: folio
        });  
        //TODO: Abrir las cosas
        this.ventaService.AnularTotalizarVentaService(anularRequest).subscribe(
          resp => {
            if (Number(resp.codeNumber) === 308) {
              this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: 'Venta cancelada exitosamente' });
              //-REGLA:
              if (this.doLogout) {
                this.ticketVirtualInstance._authService.logout();
              } else {
                this.ticketVirtualInstance.resetTicket();
              }
              this.modalRef.hide();

            } else {
              this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: resp.codeDescription });
            }
          }
        );
      }
    });
  }

  AutorizaCancelacion(invocar: boolean) {
    //debugger
    return new Promise((resolve, reject) => {

      if (invocar) {
        let cancelacionRequest = {
          codigoTipoTrxCab: Number(this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.codigoTipoCabeceraVenta),
          folioVenta: this.ticketVirtualInstance.ticketVirtual.cabeceraVenta.folioOperacion,
          transaccion: 0,
          nombreCajero: this.ticketVirtualInstance.loggedInfo.nombre,
          codigoCajeroAutorizo: Number(localStorage.getItem('CodigoCajeroAutorizo') || '0'),
          totalTransaccion: this.ticketVirtualInstance.ticketVirtual.totalSale,
          totalTransaccionPositivo: 0,
          totalPiezas: this.ticketVirtualInstance.ticketVirtual.totalPrendas,
          totalPiezasPositivas: 0,
          codigoRazonMMS: this.condigoSeleccionado.toString()
         } as AutorizaCancelacionRequestModel;
    
         this.ventaService.autorizaCancelacionService(cancelacionRequest).subscribe(
           resp => {
              if (resp.hayError == 0 && resp.autorizado == 0) {
                this._alertService.show({ tipo: 'info', titulo: 'Mensaje', mensaje: resp.sMensaje });
                reject();
              }
              else if (resp.hayError == 1 && resp.autorizado == 0) {
                this._alertService.show({ tipo: 'error', titulo: 'Mensaje', mensaje: resp.sMensaje });
                reject();
              }
              else if (resp.hayError == 0 && resp.autorizado == 1) {
                localStorage.removeItem('ConfirmaCancelarTransaccion');
                resolve(true);
              }
           }
         );
      } else {
        resolve(true);
      }

    });
  }

}

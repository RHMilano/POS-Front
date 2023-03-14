import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalFocusDirective } from '../../directives/modal-focus.directive';
import { TicketVirtualComponentInterface } from '../../Models/FrontEnd/TicketVirtualComponentInterface';
import { ProductsResponseClass } from '../../Models/General/ProductsResponse';
import { MovimientoTarjetaRequest } from '../../Models/Pagos/MovimientoTarjeta';
import { PagoTCMM } from '../../Models/Pagos/PagoTCMM';
import { PuntosTarjetaRequest } from '../../Models/Pagos/PuntosTarjetaRequest';
import { RetiroTarjetaRequest } from '../../Models/Pagos/RetiroTarjetaRequest';
import { VentaTarjetaRequest } from '../../Models/Pagos/VentaTarjetaRequest';
import { PagoWebxResponse } from '../../Models/Sales/PagoWebx';
import { InformacionTCMMRequest } from '../../Models/TCMM/InformacionTCMMRequest';
import { AlertService } from '../../services/alert.service';
import { ConfigPosService } from '../../services/config-pos.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { ElementoFormaControlService } from '../../services/elemento-forma-control.service';
import { GeneralService } from '../../services/general.service';
import { SalesService } from '../../services/sales.service';


@Component({
  selector: 'app-pago-webx',
  templateUrl: './pago-webx.component.html',
  styleUrls: ['./pago-webx.component.css'],
  providers: [SalesService] // OCG: Sino se importa el servicio como proveedor marca error
})
export class PagoWebxComponent implements OnInit {

  @Input('ticketVirtualInstance') ticketVirtualInstance: TicketVirtualComponentInterface;

  numeroTarjeta: string;
  cantidadPagar: number;
  isPagando: boolean;
  cargando: boolean;
  
  //------------
  createConvevio: boolean;
  info: PagoWebxResponse;
  encontrado: boolean;
  buscar:boolean;

  constructor(public  modalRef: BsModalRef,  
    private _service: SalesService, 
    private _alertService: AlertService,
    private _dataTransfer: DataTransferService,
    private modalService: BsModalService,
    private _salesService: SalesService,
    private _configService: ConfigPosService ) { 
      this.info = new PagoWebxResponse();
      this.encontrado = false;
      this.buscar = false;
    }

  ngOnInit() {
  }

  closeModal() {
    this.modalRef.hide();
  }

  consultaPagoWebx(folio:string){
    
   //folio = 'ML-6320'
    //Invocar servicio
  this.buscar = true;
  this.info = new  PagoWebxResponse();
  this.encontrado = false;

    this._service.verificarPagoWeb(folio).subscribe(resp => {

      if (resp.response.customerName != null) {
        this.info = {...resp}; // Actualizar clase para el front
        this.encontrado = true;
      }

      //console.log(JSON.stringify( this.info));

    }, (err) => {
      //console.log(JSON.stringify(err));
    });

  }

  agregarLineaTicketVenta () {
    
        if ( this.info.response.customerName != null) {

          const articuloPagoWeb = new ProductsResponseClass();
          articuloPagoWeb.articulo.isPagoWeb = true;
          articuloPagoWeb.articulo.estilo = 'Pago Web';
          articuloPagoWeb.articulo.precioConImpuestos = Number(this.info.response.amount);
          articuloPagoWeb.articulo.sku = this._configService.currentConfig.skuPagoTCMM;
          articuloPagoWeb.articulo.tasaImpuesto1 = 0;
          articuloPagoWeb.articulo.depto = this.info.response.orderNuber;
          articuloPagoWeb.articulo.subDepartamento = `${this.info.response.orderId}|${this.info.response.transactionId}`

          this.ticketVirtualInstance.sendPagoWeb([articuloPagoWeb]);

          this.closeModal();
        } else {
          //this._alertService.show({ tipo: 'info', titulo: 'Milano', mensaje: data.codigoRespuestaTCMM.mensajeRetorno });
          this.isPagando = false;
        }
  }
}

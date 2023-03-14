import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ProductsResponse } from '../Models/General/ProductsResponse.model';
import { EmployeeResponse } from '../Models/Sales/Employee';
import { BotoneraPagos, ShowPagosRequest } from '../Models/Pagos/Pagos.model';
import { BotoneraPeticion } from '../Models/General/Funciones.model';
import { FinalizarVentaRequest } from '../Models/Sales/FinalizarVentaRequest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Descuento } from '../Models/Sales/Descuento.model';
import { DetalleProductoSkuModel } from '../Models/General/DetalleProductoSku.model';
import { PagoApartado } from '../Models/Apartados/PagoApartado';
import { PostAnularVentaRequest } from '../Models/Sales/PostAnularVentaRequest';
import { InformacionAsociadaRetiroEfectivo } from '../Models/General/InformacionAsociadaRetiroEfectivo';


@Injectable()
export class DataTransferService {

  $ticketVirtualInstance: BehaviorSubject<any> = new BehaviorSubject(null);
  $articuloTicketVirtual: Subject<ProductsResponse | Array<ProductsResponse>> = new Subject();
  $ticketVirtualTotaliza: Subject<boolean> = new Subject();
  $vendedorTicketVirtual: Subject<EmployeeResponse> = new Subject();
  $showFormasPago: Subject<ShowPagosRequest> = new Subject<ShowPagosRequest>();
  $coordinadorFuncionesBotonera: Subject<BotoneraPeticion> = new Subject<BotoneraPeticion>();
  $funcionesBotoneraSwitch: Subject<boolean> = new Subject<boolean>();
  $tipoApartado: Subject<number> = new Subject();
  $apartadoTicketVirtual: Subject<PagoApartado> = new Subject();
  $anularTransaccion: Subject<boolean> = new Subject();
  $anularTransaccionData: Subject<FinalizarVentaRequest> = new Subject();
  $postanularTransaccionData: Subject<PostAnularVentaRequest> = new Subject();
  $applyDiscount: Subject<Descuento> = new Subject<Descuento>();
  $applyDiscountTx: Subject<Array<Descuento>> = new Subject<Array<Descuento>>();
  $suspenderTransaccion: Subject<boolean> = new Subject();
  $detalleProducto: BehaviorSubject<DetalleProductoSkuModel> = new BehaviorSubject(null);
  $coordinadorFuncionesBotoneraPagos: Subject<BotoneraPagos | string> = new Subject<BotoneraPagos | string>();
  $updateTotalVenta: Subject<number> = new Subject<number>();
  $setFormasDePagoInstance: Subject<any> = new Subject<any>();
  $setFormasDePagoMenuInstance: Subject<any> = new Subject<any>();
  $loginInstance: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
  }
}

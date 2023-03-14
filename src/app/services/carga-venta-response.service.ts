import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VentaResponseModel } from '../Models/Sales/VentaResponse.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RouterCommand, TipoCabeceraTotalizar } from '../shared/GLOBAL';

@Injectable()
export class CargaVentaResponseService {

  ventaResponseSubject: BehaviorSubject<VentaResponseModel> = new BehaviorSubject<VentaResponseModel>(null);
  $ventaResponse = this.ventaResponseSubject.asObservable();

  constructor(private _route: Router) {
  }

  private _ventaResponse: VentaResponseModel;

  set ventaResponse(value: VentaResponseModel) {
    this._ventaResponse = value;

    if (value) {
      let navigateCommand: string;

      switch (value.codigoTipoCabeceraVenta) {
        case TipoCabeceraTotalizar.ventaRegular:
        case TipoCabeceraTotalizar.apartado:
          navigateCommand = RouterCommand.regular;
          break;
        case TipoCabeceraTotalizar.ventaMayorista:
          navigateCommand = RouterCommand.mayorista;
          break;
        case TipoCabeceraTotalizar.ventaEmpleado:
          navigateCommand = RouterCommand.empleado;
      }

      this._route.navigate([navigateCommand]).then(
        () => this.ventaResponseSubject.next(this._ventaResponse)
      );
    } else {
      this.ventaResponseSubject.next(this._ventaResponse);
    }
  }
}

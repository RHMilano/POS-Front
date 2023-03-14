import { ElementRef, Injectable } from '@angular/core';
import { ConfigGeneralesCajaTiendaResponse } from '../Models/General/ConfigGeneralesCajaTiendaResponse.model';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { GLOBAL, RouterCommand, TipoVenta } from '../shared/GLOBAL';
import { ConfiguracionBoton } from '../Models/General/ConfiguracionBoton';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AlertService } from './alert.service';

@Injectable()
export class ConfigPosService {

  currentConfig: ConfigGeneralesCajaTiendaResponse;
  elements: Array<ElementRef> = [];
  currentColorConfig: TipoVenta;
  btnsConfig: Array<ConfiguracionBoton> = [];
  configLoaded: BehaviorSubject<ConfigGeneralesCajaTiendaResponse> = new BehaviorSubject(null);
  configLoaded$ = this.configLoaded.asObservable();

  constructor(private _route: Router, private _alertService: AlertService) {

    _route.events.subscribe(
      data => {
        if (data instanceof NavigationStart) {
          if (data.url === RouterCommand.login) {
            this.elements = [];
          } else {
            this.elements.splice(3);
          }
        }

        if (data instanceof NavigationEnd) {
          if (GLOBAL.includesAny(data.url, ['EMPLEADO'])) {
            this.currentColorConfig = TipoVenta.VentaEmpleado;
          } else if (GLOBAL.includesAny(data.url, ['MAYORISTA'])) {
            this.currentColorConfig = TipoVenta.VentaMayorista;
          } else if (GLOBAL.includesAny(data.url, ['DEVOLUCION'])) {
            this.currentColorConfig = TipoVenta.devoluciones;
          } else {
            this.currentColorConfig = TipoVenta.VentaRegular;
          }
          this.applyColor(this.currentColorConfig);
        }
      }
    );
  }

  applyColor(color: TipoVenta) {
    if (!!color && !!this.currentConfig) {
      this.elements.forEach(ele => {
        ele.nativeElement.style.backgroundColor = this.currentConfig[color];
      });
    }
  }

  setConfig(obj: ConfigGeneralesCajaTiendaResponse) {

    this.currentConfig = obj;
    GLOBAL.skuPagoMayorista = obj.skuPagoConValeMayorista;
    GLOBAL.skuLineaComisionPagoServicios = obj.skuComisionPagoServicios;
    GLOBAL.informacionAsociadaImpuestos = obj.informacionAsociadaImpuestos;
    this.applyColor(this.currentColorConfig);

    this.configLoaded.next(obj);
  }

  setBotones(btns: Array<ConfiguracionBoton>) {
    this.btnsConfig = btns;
  }

  adfElementRef(el: ElementRef) {
    this.elements.push(el);
  }
}

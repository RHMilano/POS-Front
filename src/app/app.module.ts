/* tslint:disable */
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing';
import { NgxPaginationModule } from 'ngx-pagination';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ToastrModule } from 'ngx-toastr';
import {BsDatepickerModule, BsLocaleService, ButtonsModule, DatepickerModule, defineLocale, esLocale, ModalModule, TabsModule} from 'ngx-bootstrap';
import { HeaderInterceptor } from './Interceptors/HeaderInterceptor';
/*
  Servicios Disponibles a todos los niveles
 */
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './shared/auth.guard';
import { MsgService } from './services/msg.service';
import { ConfigPosService } from './services/config-pos.service';
import { LoginComponent } from './layout/login/login.component';
import { ModalAlertComponent } from './layout/modal-alert/modal-alert.component';
import { BusquedaEmpleadoComponent } from './layout/busqueda-empleado/busqueda-empleado.component';
import { BusquedaAvanzadaComponent } from './layout/busqueda-avanzada/busqueda-avanzada.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { VentaTiempoAireComponent } from './layout/venta-tiempo-aire/venta-tiempo-aire.component';
import { PagoDeServiciosComponent } from './layout/pago-de-servicios/pago-de-servicios.component';
import { DataTransferService } from './services/data-transfer.service';
import { DescuentoService } from './services/descuento.service';
import { AlertModule } from 'ngx-bootstrap/alert';
import localeMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { VentaTarjetaRegaloComponent } from './layout/venta-tarjeta-regalo/venta-tarjeta-regalo.component';
import { DirectivesModule } from './modules/directives/directives.module';
import { SuperUsuarioComponent } from './layout/super-usuario/super-usuario.component';
import { BusquedaApartadoComponent } from './layout/busqueda-apartado/busqueda-apartado.component';
import { BusquedaClienteComponent } from './layout/busqueda-cliente/busqueda-cliente.component';
import { RazonesCancelacionComponent } from './layout/razones-cancelacion/razones-cancelacion.component';
import { BusquedaTransaccionComponent } from './layout/busqueda-transaccion/busqueda-transaccion.component';
import { DescuentosComponent } from './layout/descuentos/descuentos.component';
import { ConsultaSaldoTMMComponent } from './layout/consulta-saldo-TMM/consulta-saldo-TMM.component';
import { PostAnulacionComponent } from './layout/post-anulacion/post-anulacion.component';
import { ReimpresionTicketComponent } from './layout/reimpresion-ticket/reimpresion-ticket.component';
import { CambiarPasswordComponent } from './layout/cambiar-password/cambiar-password.component';
import { PagoTcmmComponent } from './layout/pago-tcmm/pago-tcmm.component';
import { RetiroEgresosComponent } from './layout/retiro-egresos/retiro-egresos.component';
import { PagoMayoristaComponent } from './layout/pago-mayorista/pago-mayorista.component';
import { CancelarTransaccionComponent } from './layout/cancelar-transaccion/cancelar-transaccion.component';
import { PagosMasterService } from './services/pagos-master.service';
import { CambioDePrecioComponent } from './layout/cambio-de-precio/cambio-de-precio.component';
import { PagoEfectivoComponent } from './layout/formas-pago-menu/pago-efectivo/pago-efectivo.component';
import { PagoTarjetaAmericanExpressComponent } from './layout/formas-pago-menu/pago-tarjeta-american-express/pago-tarjeta-american-express.component';
import { PagoFinanciamientoMayoristaComponent } from './layout/formas-pago-menu/pago-financiamiento-mayorista/pago-financiamiento-mayorista.component';
import { PagoValesComponent } from './layout/formas-pago-menu/pago-vales/pago-vales.component';
import { PagoTarjetaMmComponent } from './layout/formas-pago-menu/pago-tarjeta-mm/pago-tarjeta-mm.component';
import { PagoTarjetaRegaloComponent } from './layout/formas-pago-menu/pago-tarjeta-regalo/pago-tarjeta-regalo.component';
import { PagoFinanciamientoEmpleadoComponent } from './layout/formas-pago-menu/pago-financiamiento-empleado/pago-financiamiento-empleado.component';
import { PagoTarjetaCreditoDebitoComponent } from './layout/formas-pago-menu/pago-tarjeta-credito-debito/pago-tarjeta-credito-debito.component';
import { PagoTarjetaCreditoDebito2Component } from './layout/formas-pago-menu/pago-tarjeta-credito-debito2/pago-tarjeta-credito-debito2.component';
import { PagoMonedaExtranjeraComponent } from './layout/formas-pago-menu/pago-moneda-extranjera/pago-moneda-extranjera.component';
import { RetiroParcialEfectivoComponent } from './layout/retiro-parcial-efectivo/retiro-parcial-efectivo.component';
import { ConstructorFormaDinamicaComponent } from './layout/constructor-forma-dinamica/constructor-forma-dinamica.component';
import { ComponenteDinamicoComponent } from './layout/constructor-forma-dinamica/componente-dinamico/componente-dinamico.component';
import { CashBackAdvancedComponent } from './layout/cash-back-advanced/cash-back-advanced.component';
import { CargaVentaResponseService } from './services/carga-venta-response.service';
import { DescuentosMercanciaComponent } from './layout/descuentos-mercancia/descuentos-mercancia.component';
import { DescuentosTransaccionComponent } from './layout/descuentos-transaccion/descuentos-transaccion.component';
import { ReportesComponent } from './layout/reportes/reportes.component';
import { LecturaXComponent } from './layout/lectura-x/lectura-x.component';
import { TipoPagoComponent } from './layout/lectura-x/tipo-pago/tipo-pago.component';
import { DescuentosInformacionComponent } from './layout/formas-pago-menu/descuentos-informacion/descuentos-informacion.component';
import { LecturaZComponent } from './layout/lectura-z/lectura-z.component';
import { BusquedaMayoristaComponent } from './layout/busqueda-mayorista/busqueda-mayorista.component';

import { DeviceDetectorModule } from 'ngx-device-detector';
import {NotasDeCreditoComponent} from './layout/formas-pago-menu/notas-de-credito/notas-de-credito.component';
import {CapturaLuzComponent} from './layout/captura-luz/captura-luz.component';
import {AutenticacionOfflineComponent} from './layout/autenticacion-offline/autenticacion-offline.component';
import {FinDiaComponent} from './layout/fin-dia/fin-dia.component';
import {RedencionDeCuponesComponent} from './layout/formas-pago-menu/redencion-de-cupones/redencion-de-cupones.component';
import {FinLagComponent} from './layout/formas-pago-menu/fin-lag/fin-lag.component';
import {BusquedaClienteFinLagComponent} from './layout/formas-pago-menu/fin-lag/busqueda-cliente/busqueda-cliente-finLag.component';
import {PagoFinLagComponent} from './layout/formas-pago-menu/fin-lag/pago-fin-lag/pago-fin-lag.component';
import {RelacionCajaComponent} from './layout/fin-dia/relacion-caja/relacion-caja.component';
import {CashOutComponent} from './layout/fin-dia/cash-out/cash-out.component';
import {RelacionCajaReporteComponent} from './layout/relacion-caja-reporte/relacion-caja-reporte.component';
import {ReporteApartadosComponent} from './layout/reporteApartados/reporteApartados.component';
import {AutenticacionCorteZComponent} from './layout/autenticacion-corte-z/autenticacion-corte-z.component';
import {PinPadMovilComponent} from './layout/formas-pago-menu/pin-pad-movil/pin-pad-movil.component';
import  {PagoTransferenciaComponent} from './layout/formas-pago-menu/pago-transferencia/pago-transferencia.component'
import { PagoWebxComponent } from './layout/pago-webx/pago-webx.component';
import { TicketVirtualBuscarLealtadComponent } from './layout/ticket-virtual-buscar-lealtad/ticket-virtual-buscar-lealtad.component';
import { RedencionPuntosLealtadComponent } from './layout/formas-pago-menu/redencion-puntos-lealtad/redencion-puntos-lealtad.component';

/*
import { ComponentOneComponent } from './pruebas/component-one/component-one.component';
import { ComponentTwoComponent } from './pruebas/component-two/component-two.component';
import { ComponentBaseComponent } from './pruebas/component-base/component-base.component';
*/

/* tslint:enable */
/* *** */

registerLocaleData(localeMX);
defineLocale('es', esLocale);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ModalAlertComponent,
    BusquedaEmpleadoComponent,
    BusquedaAvanzadaComponent,
    VentaTiempoAireComponent,
    PagoDeServiciosComponent,
    VentaTarjetaRegaloComponent,
    SuperUsuarioComponent,
    BusquedaApartadoComponent,
    RazonesCancelacionComponent,
    BusquedaTransaccionComponent,
    BusquedaClienteComponent,
    DescuentosComponent,
    ConsultaSaldoTMMComponent,
    PostAnulacionComponent,
    ReimpresionTicketComponent,
    CambiarPasswordComponent,
    PagoTcmmComponent,
    RetiroEgresosComponent,
    PagoMayoristaComponent,
    CancelarTransaccionComponent,
    CambioDePrecioComponent,
    PagoEfectivoComponent,
    PagoMonedaExtranjeraComponent,
    PagoValesComponent,
    PagoTarjetaMmComponent,
    PagoTarjetaCreditoDebitoComponent,
    PagoTarjetaCreditoDebito2Component,
    PagoTarjetaAmericanExpressComponent,
    PagoTarjetaRegaloComponent,
    PagoFinanciamientoEmpleadoComponent,
    PagoFinanciamientoMayoristaComponent,
    RetiroParcialEfectivoComponent,
    ConstructorFormaDinamicaComponent,
    ComponenteDinamicoComponent,
    CashBackAdvancedComponent,
    DescuentosMercanciaComponent,
    DescuentosTransaccionComponent,
    ReportesComponent,
    DescuentosTransaccionComponent,
    LecturaXComponent,
    TipoPagoComponent,
    BusquedaAvanzadaComponent,
    DescuentosInformacionComponent,
    LecturaZComponent,
    BusquedaMayoristaComponent,
    NotasDeCreditoComponent,
    CapturaLuzComponent,
    AutenticacionOfflineComponent,
    FinDiaComponent,
    CashOutComponent,
    RelacionCajaComponent,
    FinLagComponent,
    BusquedaClienteFinLagComponent,
    PagoFinLagComponent,
    RedencionDeCuponesComponent,
    ReporteApartadosComponent,
    RelacionCajaReporteComponent,
    AutenticacionCorteZComponent,
    PinPadMovilComponent,
    PagoTransferenciaComponent,
    PagoWebxComponent,
    TicketVirtualBuscarLealtadComponent,
    RedencionPuntosLealtadComponent
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    NgxPaginationModule,
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    DirectivesModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgxDatatableModule,
    DeviceDetectorModule.forRoot(),
    TabsModule.forRoot()
  ],
  entryComponents: [
    VentaTarjetaRegaloComponent,
    BusquedaEmpleadoComponent,
    VentaTiempoAireComponent,
    PagoDeServiciosComponent,
    BusquedaClienteComponent,
    SuperUsuarioComponent,
    BusquedaApartadoComponent,
    RazonesCancelacionComponent,
    BusquedaTransaccionComponent,
    BusquedaApartadoComponent,
    DescuentosComponent,
    ConsultaSaldoTMMComponent,
    PostAnulacionComponent,
    ReimpresionTicketComponent,
    CambiarPasswordComponent,
    PagoTcmmComponent,
    RetiroEgresosComponent,
    PagoMayoristaComponent,
    CancelarTransaccionComponent,
    CambioDePrecioComponent,
    PagoEfectivoComponent,
    PagoMonedaExtranjeraComponent,
    PagoValesComponent,
    PagoTarjetaMmComponent,
    PagoTarjetaCreditoDebitoComponent,
    PagoTarjetaCreditoDebito2Component,
    PagoTarjetaAmericanExpressComponent,
    PagoTarjetaRegaloComponent,
    PagoFinanciamientoEmpleadoComponent,
    PagoFinanciamientoMayoristaComponent,
    RetiroParcialEfectivoComponent,
    ConstructorFormaDinamicaComponent,
    ComponenteDinamicoComponent,
    CashBackAdvancedComponent,
    DescuentosMercanciaComponent,
    DescuentosTransaccionComponent,
    ReportesComponent,
    DescuentosTransaccionComponent,
    LecturaXComponent,
    TipoPagoComponent,
    BusquedaAvanzadaComponent,
    DescuentosInformacionComponent,
    LecturaZComponent,
    BusquedaMayoristaComponent,
    NotasDeCreditoComponent,
    CapturaLuzComponent,
    AutenticacionOfflineComponent,
    FinDiaComponent,
    CashOutComponent,
    RelacionCajaComponent,
    FinLagComponent,
    BusquedaClienteFinLagComponent,
    PagoFinLagComponent,
    RedencionDeCuponesComponent,
    ReporteApartadosComponent,
    RelacionCajaReporteComponent,
    AutenticacionCorteZComponent,
    PinPadMovilComponent,
    PagoTransferenciaComponent,
    PagoWebxComponent,
    TicketVirtualBuscarLealtadComponent,
    RedencionPuntosLealtadComponent
  ],
  providers: [AlertService
    , AuthService
    , AuthGuard
    , MsgService
    , ConfigPosService
    , DataTransferService
    , BsLocaleService
    , PagosMasterService
    , CargaVentaResponseService
    , DescuentoService
    , {provide: LOCALE_ID, useValue: 'es-MX'},
    {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRouting } from './layout.routing';
import { PosComponent } from './venta/pos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TicketVirtualComponent } from './ticket-virtual/ticket-virtual.component';
import { ArticuloComponent } from './ticket-virtual/articulo/articulo.component';
import { ColorConfigPosDirective } from '../directives/color-config-pos.directive';
import { FuncionesComponent } from './funciones/funciones.component';
import { BsDatepickerModule, CarouselModule, TooltipModule } from 'ngx-bootstrap';
import { TicketVirtualMayoristaComponent } from './ticket-virtual-mayorista/ticket-virtual-mayorista.component';
import { TicketVirtualEmpleadoComponent } from './ticket-virtual-empleado/ticket-virtual-empleado.component';
import { FormasPagoMenuComponent } from './formas-pago-menu/formas-pago-menu.component';
import { FormasDePagoComponent } from './formas-de-pago/formas-de-pago.component';
import { PagoComponent } from './formas-de-pago/pago/pago.component';
import { DirectivesModule } from '../modules/directives/directives.module';
import { TicketVirtualDevolucionComponent } from './ticket-virtual-devolucion/ticket-virtual-devolucion.component';
import { CarrouselComponent } from './carrousel/carrousel.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ArticuloDevolucionComponent } from './ticket-virtual/articulo-devolucion/articulo-devolucion.component';
//import { RedencionPuntosLealtadComponent } from './formas-pago-menu/redencion-puntos-lealtad/redencion-puntos-lealtad.component';
//import { TicketVirtualBuscarLealtadComponent } from './ticket-virtual-buscar-lealtad/ticket-virtual-buscar-lealtad.component';

//import { PagoWebxComponent } from './pago-webx/pago-webx.component';
//import { PagoTransferenciaComponent } from './formas-pago-menu/pago-transferencia/pago-transferencia.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutRouting,
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    DirectivesModule
  ],
  declarations: [
    PosComponent,
    TicketVirtualComponent,
    ArticuloComponent,
    ColorConfigPosDirective,
    FuncionesComponent,
    TicketVirtualMayoristaComponent,
    TicketVirtualEmpleadoComponent,
    FormasPagoMenuComponent,
    FormasDePagoComponent,
    PagoComponent,
    TicketVirtualDevolucionComponent,
    CarrouselComponent,
    ArticuloDevolucionComponent,
    //RedencionPuntosLealtadComponent,
    //TicketVirtualBuscarLealtadComponent,

    //PagoWebxComponent
    //PagoTransferenciaComponent
  ],
  entryComponents: []
})

export class LayoutModule {
}


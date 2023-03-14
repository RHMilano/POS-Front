import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { PosComponent } from './venta/pos.component';
import { TicketVirtualComponent } from './ticket-virtual/ticket-virtual.component';
import { TicketVirtualMayoristaComponent } from './ticket-virtual-mayorista/ticket-virtual-mayorista.component';
import { TicketVirtualEmpleadoComponent } from './ticket-virtual-empleado/ticket-virtual-empleado.component';
import { TicketVirtualDevolucionComponent } from './ticket-virtual-devolucion/ticket-virtual-devolucion.component';
//import { TicketVirtualBuscarLealtadComponent } from './ticket-virtual-buscar-lealtad/ticket-virtual-buscar-lealtad.component';


const routes: Routes = [
  {
    path: '', component: PosComponent,
    children: [
      {path: '', component: TicketVirtualComponent},
      {path: 'MAYORISTA', component: TicketVirtualMayoristaComponent},
      //{path: 'LEALTAD', component: TicketVirtualBuscarLealtadComponent},
      {path: 'EMPLEADO', component: TicketVirtualEmpleadoComponent},
      {path: 'DEVOLUCION', component: TicketVirtualDevolucionComponent},
      {path: '**', component: NotFoundComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [NotFoundComponent],
  exports: [RouterModule]
})
export class LayoutRouting {
}

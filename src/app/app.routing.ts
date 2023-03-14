import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'POS', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard]}
  // {path: 'MOBILETEST', component: ComponentBaseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}




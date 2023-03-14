import { Component, Renderer2, ViewContainerRef } from '@angular/core';
import { AlertService } from './services/alert.service';
import { GeneralService } from './services/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GeneralService]
})
export class AppComponent {
  constructor(public _alertService: AlertService, public vcr: ViewContainerRef) {
  }
}

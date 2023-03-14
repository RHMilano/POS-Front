import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  //#region Esto elimina todos los console log en producción 
  // if(window){
  //   window.console.log=function(){};
  // }
  //#endregion
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

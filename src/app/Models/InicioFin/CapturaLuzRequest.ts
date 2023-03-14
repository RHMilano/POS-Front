import { environment as env, environment } from '../../../environments/environment';

export class CapturaLuzRequest {

  valorLectura: number;
  valorLecturaAdicional: number;
  versionPos: string; //-COD/MODIFICADO: Se agrega propiedad para pasar la version del pos al inicio de dia

  //-COD/MODIFICADO: Se agrega el constructor para que tome el numero de la version por defecto del archivo enviroment.ts
  Constructor() {
    this.versionPos;
  }

}

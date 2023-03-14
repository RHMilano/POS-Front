import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginRequest } from '../Models/LoginRequest';
import { environment as env } from '../../environments/environment';
import { UserResponse } from '../Models/Security/User.model';
import { EstatusResult, ResponseBusiness } from '../Models/General/ResponseBusiness.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthService {
  isAuth: BehaviorSubject<boolean> = new BehaviorSubject(null);
  loggedInfo: BehaviorSubject<UserResponse> = new BehaviorSubject(null);
  userInfo: Observable<UserResponse> = this.loggedInfo.asObservable();
  sudoInfo: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor(private _http: HttpClient, private _router: Router) {
  }

  login(loginRequest: LoginRequest) {

    return new Promise((resolve, reject) => {

      //const endpoint = `${env.urlSecurity}${env.loginPath}`;
      const endpoint = `${env.urlServices}${env.loginPath}`;

      //OCG: console.log(`login endpoint: ${endpoint}`);

      this._http.post(endpoint, JSON.stringify(loginRequest)).subscribe(
        (res: ResponseBusiness<UserResponse>) => {

          /*console.log(`res.data.accesstoken: ${res.data.accesstoken}`);
          console.log(`res.data.codeEstatus: ${res.data.codeEstatus}`);
          console.log(`res.data.estatus: ${res.data.estatus}`);
          console.log(`res.data.nombre: ${res.data.nombre}`);
          console.log(`res.data.numberAttempts: ${res.data.numberAttempts}`);
          console.log(`res.data.numberEmployee: ${res.data.numberEmployee}`);
          console.log(`res.data.numeroCaja: ${res.data.numeroCaja}`);
          console.log(`res.data.numeroTienda: ${res.data.numeroTienda}`);*/

          this.loggedInfo.next(res.data);

          if (res.data.codeEstatus === 100) { // Loggin Exitoso
            this.isAuth.next(true);
            localStorage.setItem('accesstoken', res.data.accesstoken);
            localStorage.setItem('accessInfo', JSON.stringify(res.data));
            resolve(true);
          } else {
            this.isAuth.next(false);
            // Mensaje Propio de Login
            reject(`${res.data.codeEstatus} - ${res.data.estatus}`);
          }


        }, (err: HttpErrorResponse) => {
          this.isAuth.next(false);
          reject(err.message);
        }
      );

    });

  }

  logout() {
    //const endpoint = `${env.urlSecurity}${env.logoutPath}`;
    const endpoint = `${env.urlServices}${env.logoutPath}`;

    this._http.get(endpoint).subscribe(() => {
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('accessInfo');
      this.isAuth.next(false);
      this.loggedInfo.next(null);
      this._router.navigate(['/']).then();
    });

  }

  validateUser(loginRequest: LoginRequest) {
    const endpoint = `${env.urlServices}${env.validacionUsuarioPath}`;
    return this._http.post<ResponseBusiness<EstatusResult>>(
      endpoint, JSON.stringify(loginRequest)).map(res => res.data);
  }
}

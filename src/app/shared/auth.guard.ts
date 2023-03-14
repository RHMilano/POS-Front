import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { UserResponse } from '../Models/Security/User.model';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  public constructor(private _auth: AuthService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this._auth.loggedInfo.do((user: UserResponse) => {
      if (user === null) {
        this._router.navigate(['']);
      }
    }).map((user: UserResponse) => !!user);

  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._auth.loggedInfo.do((user: UserResponse) => {
      if (user === null) {
        this._router.navigate(['']);
      }
    }).map((user: UserResponse) => !!user);
  }

}

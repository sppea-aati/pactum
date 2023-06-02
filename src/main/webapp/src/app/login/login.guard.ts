import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginState } from './login-state';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    private loginState: LoginState
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.loginState.logged
        .pipe(
          map(logged => {
            // console.log('[login-guard] ' + state.url + ' logged: ' + logged);
            if (!logged) {
              if (state.url === '/login') {
                return true;
              }
              this.loginState.redirectToLogin(state.url);
            }
            return logged;
          })
        );
  }
}

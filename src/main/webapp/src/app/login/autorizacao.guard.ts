import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, first } from 'rxjs/operators';
import * as login from './login-model';
import { LoginState } from './login-state';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AutorizacaoGuard implements CanActivate {

  constructor(
    private loginState: LoginState,
    private toastr: ToastrService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.loginState.usuario
        .pipe(
          map(usuario => {
            if (state.url.startsWith('/home')) {
              return login.isUser(usuario);
            }
            if (state.url.startsWith('/usuarios')) {
              return login.isUser(usuario);
            } else if (state.url.startsWith('/convenios')) {
              if (state.url.endsWith('editar')) {
                return login.isEditor(usuario);
              }
              return login.isUser(usuario);
            } else if (state.url.startsWith('/basesDados')) {
              if (state.url.endsWith('editar')) {
                return login.isEditor(usuario);
              }
              return login.isUser(usuario);
            } else if (state.url.startsWith('/acesso')) {
              return login.isGerenteAcesso(usuario);
            } else if (state.url.startsWith('/email')) {
              return login.isGerenteAcesso(usuario);
            }

            return false;
          }),
          tap((permitido) => {
            if (!permitido) {
              this.toastr.error('Acesso negado.');
            }
          }),
          first()
        );
  }

}

import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { LoginService } from './login.service';
import * as login from './login-model';
import { UsuarioLogin } from './login-model';
import { NavigationExtras } from '@angular/router/src/router';
import { Params } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LoginState {

  public logged: BehaviorSubject<boolean>;

  public usuario: BehaviorSubject<login.UsuarioLogin>;

  public isAdmin: BehaviorSubject<boolean>;

  public isProcessando: BehaviorSubject<boolean>;

  public loginErr: BehaviorSubject<string>;

  private redirectUrl: string;

  private queryParams: string;

  private navigationExtras: NavigationExtras;
  private params: Params;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    this.logged = new BehaviorSubject(false);
    this.usuario = new BehaviorSubject(null);
    this.loginErr = new BehaviorSubject(null);
    this.isAdmin = new BehaviorSubject(false);
    this.isProcessando = new BehaviorSubject(false);
    this.usuario.subscribe(usuario => {
      if (usuario) {
        this.isAdmin.next(login.isAdmin(usuario));
      }
    });

    this.loginService.fetchLoginState()
      .subscribe(state => {
        this.logged.next(state.isLogged);
        if (state.isLogged) {
          this.usuario.next(state.usuario);
        } else {
          this.usuario.next(null);
        }
      });
  }

  redirectToLogin(url?: string) {
    if (url) {
      this.redirectUrl = url;
      this.formatUrlQueryParams();
    }
    this.router.navigate(['/login']);
  }

  redirectAfterLogin() {
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl], this.navigationExtras);
    } else {
      this.router.navigate(['/home']);
    }
  }

  formatUrlQueryParams() {
    if (!this.redirectUrl) {
      return;
    }
    const tokens: string[] = this.redirectUrl.split('?');
    this.redirectUrl = tokens[0];
    if (!tokens[1]) {
      return;
    }

    const tokensQueryParam: string[] = tokens[1].split('&');
    this.queryParams = '{ "queryParams": {';
    for (let i = 0; i < tokensQueryParam.length; i++) {
      const param: string[] = tokensQueryParam[i].split('=');
      this.queryParams += ' "' + param[0] + '": "' + param[1] + '",';
    }
    this.queryParams = this.queryParams.slice(0, -1); // remove a última vírgula
    this.queryParams += ' } }';
    this.navigationExtras = JSON.parse(this.queryParams);
  }

  login(credentials: login.Credentials) {
    this.isProcessando.next(true);
    this.loginErr.next(null);
    this.loginService.login(credentials)
      .subscribe(state => {
        if (state.isLogged) {
          if (!login.isUser(state.usuario) && !login.isGerenteAcesso(state.usuario)) {
            this.logout('Nenhum perfil associado ao usuário.');
            return;
          }
          this.changeSubject(true, state.usuario, null);
          this.redirectAfterLogin();
        } else {
          this.changeSubject(false, null, state.err);
        }
        this.isProcessando.next(false);
      },
      err => {
        if (err.status === 401 || err.status === 405) {
          this.changeSubject(false, null, err.message);
        }
        this.isProcessando.next(false);
      });
  }

  logout(erro?: string) {
    this.loginService.logout()
      .subscribe(state => {
        this.changeSubject(state.isLogged, null, (erro) ? erro : null);
        this.redirectToLogin();
      });
  }

  logoutDueto401() {
    this.changeSubject(false, null, 'Sessão encerrada.');
    this.redirectToLogin(this.router.url);
  }

  private changeSubject(logged: boolean = false, usuario: UsuarioLogin = null, err: string = null) {
    this.logged.next(logged);
    this.usuario.next(usuario);
    this.loginErr.next(err);
  }

}

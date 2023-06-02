import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Router } from '@angular/router';

import { UsuarioLogin, Credentials, State } from './login-model';

@Injectable()
export class LoginService {

  private static loginUrl = 'api/login';

  private static logoutUrl = 'api/logout';

  private static userUrl = 'api/user';

  constructor(private http: HttpClient) { }

  login(credentials: Credentials): Observable<State> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('email', credentials.email);
    params.set('senha', credentials.senha);

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.post(LoginService.loginUrl, params.toString(), options)
      .pipe(
        map((usuario: UsuarioLogin) => {
          const state: State = {
            isLogged: true,
            usuario: usuario
          };
          return state;
        }),
        catchError((err, caught) => {
          let msg = 'Erro desconhecido durante o login.';
          if (err.status === 504) {
            msg = 'Aparentemente o sistema está fora do ar.';
          } else if (err.error) {
            msg = err.error.message;
          }
          const state: State = {
            isLogged: false,
            err: msg
          };
          return of(state);
        })
      );
  }

  logout(): Observable<State> {
    this.http.get(LoginService.logoutUrl, { responseType: 'text' })
      .pipe(
        map(res => {
          const state: State = {
            isLogged: false
          };
          return state;
        })
      ).subscribe();
    return of({isLogged: false});
  }

  fetchLoginState(): Observable<State> {
    return <Observable<State>>this.http.get(LoginService.userUrl);
  }

}

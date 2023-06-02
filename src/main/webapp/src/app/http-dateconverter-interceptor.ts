import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginState } from './login/login-state';

@Injectable()
export class DateConverterInterceptor implements HttpInterceptor {

  private loginState: LoginState;

  constructor(
    private injector: Injector
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap(event => {}, err => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.injector.get(LoginState).logoutDueto401();
          }
        })
      );
  }
}

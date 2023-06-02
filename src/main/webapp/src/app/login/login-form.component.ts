import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from './login.service';
import { LoginState } from './login-state';

@Component({
  selector: 'login-form',
  template: `
    <div class="container" *ngIf="!(logged | async)">
      <div class="mtb20">
        <div class="row">
          <div class="col-md-4 col-md-offset-4">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title"><i class="panel-title-icon icon-lock"></i> Autenticação</h3>
              </div>
              <div class="panel-body">
                <div *ngIf="err | async" style="text-align: center;">
                  <span style="color: red;">{{err | async}}</span>
                </div>
                <form onsubmmit="event.preventDefault(); return false;">
                <div class="form-group">
                  <label for="login">Endereço de email</label>
                  <div class="input-group">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                    <input name="email" [(ngModel)]="email" autofocus
                           class="form-control" size="30" maxlength="200"
                           placeholder="Digite seu endere&ccedil;o de email institucional">
                  </div>
                </div>
                <div class="form-group">
                  <label for="senha">Senha</label>
                  <div class="input-group">
                    <span class="input-group-addon"><i class="icon-key"></i></span>
                    <input name="senha" type="password" [(ngModel)]="senha"
                           class="form-control"size="20" maxlength="100"
                           placeholder="Digite sua senha de rede">
                  </div>
                </div>
                <button class="btn btn-primary btn-lg btn-block" (click)="enviar()" [disabled]="isProcessando | async">Entrar</button>
                </form>
                <br>
                <div class="form-group">
                  <p>
                    Para entrar no sistema, digite seu e-mail completo e sua senha de acesso &agrave; rede.<br>
                    Por exemplo:
                  </p>
                  <ul class="list-unstyled small">
                    <li><i>Usu&aacute;rio: fulano@mpf.mp.br</i></li>
                    <li><i>Senha: J4o9Uk2D</i></li>
                  </ul>
                </div>
                <div class="form-group text-center" *ngIf="isProcessando | async">
                  <img src='assets/ajax-loader.gif' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  `,
  styles: []
})
@Injectable()
export class LoginFormComponent implements OnInit {

  email: string;
  senha: string;
  public err: Observable<string>;

  public logged: Observable<boolean>;
  public isProcessando: Observable<boolean>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private loginState: LoginState
  ) {
    this.logged = this.loginState.logged;
    this.isProcessando = this.loginState.isProcessando;

  }

  ngOnInit() {
    this.err = this.loginState.loginErr;
    this.loginState.logged.subscribe(logged => {
      if (logged) {
        this.loginState.redirectAfterLogin();
      }
    });
  }

  enviar() {
    this.loginState.login({ email: this.email, senha: this.senha });
  }

}

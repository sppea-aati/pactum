import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';

import { LoginState } from '../login/login-state';

import { Usuario } from '../domain';
import { UsuarioLogin } from '../login/login-model';
import * as login from '../login/login-model';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'cabecalho',
  template: `
    <header class='navbar-pgr'>
       <div class="container-fluid">
        <div class='row'>
          <div class='col-md-5'>
            <a class='nav-logo-spea'><img src="assets/logo-spea.png" class="img-responsive"></a>
          </div>
          <div class='col-md-7 white mtb5 hidden-xs hidden-sm'>
            <h4 class='text-right white'>Pactum - SPPEA</h4>
            <span class='badge pull-right'>Versão 1.8.11</span>
          </div>
        </div>
       </div>
    </header>
    <div class="cabecalho-impressao">
      <div class="row">
        <div class="col-sm-4 col-xs-6">
          <img src="assets/logo-spea-invertido.png" class="img-responsive">
        </div>
      </div>
    </div>
    <nav *ngIf="isLogged | async" class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu-principal" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
          <a class="navbar-brand" routerLink="/home">Pactum</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse " id="menu-principal">
          <ul class="nav navbar-nav">
            <li routerLinkActive="active" *ngIf="isUser">
              <a routerLink="/usuarios">Usuários</a>
            </li>
            <li routerLinkActive="active" *ngIf="isUser">
              <a routerLink="/convenios">Convênios</a>
            </li>
            <li routerLinkActive="active" *ngIf="isUser">
              <a routerLink="/basesDados">Bases de Dados</a>
            </li>
            <li routerLinkActive="active" *ngIf="isGerenteAcesso">
              <a routerLink="/acesso">Controle de Acesso</a>
            </li>
            <li routerLinkActive="active" *ngIf="isGerenteAcesso">
              <a routerLink="/email">Lista de E-mails</a>
            </li>
          </ul>

          <ul routerLinkActive="active" class="nav navbar-nav navbar-right">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <span class="glyphicon glyphicon-user"></span>
                    <strong>{{ (usuario | async).nome }}</strong>
                    <span class="glyphicon glyphicon-chevron-down"></span>
                </a>
                <ul class="dropdown-menu">
                    <li>
                      <a (click)="logout();" class="btn btn-block"><i class="glyphicon glyphicon-remove"></i> Sair</a>
                    </li>
                </ul>
              </li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
    `
})
export class CabecalhoComponent implements OnInit, OnDestroy {

  public isLogged: Observable<boolean>;

  public usuario: Observable<UsuarioLogin>;

  public usuarioSubscription: Subscription;

  public isUser: boolean;

  public isGerenteAcesso: boolean;

  constructor(
    private loginState: LoginState
  ) {
    this.isLogged = loginState.logged;
    this.usuario = loginState.usuario;
    this.usuarioSubscription = this.usuario
      .subscribe((usuario) => {
        if (usuario) {
          this.isUser = login.isUser(usuario);
          this.isGerenteAcesso = login.isGerenteAcesso(usuario);
        }
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.usuarioSubscription.unsubscribe();
  }

  logout() {
    this.loginState.logout();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject ,  Observable ,  Subscription } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

import { Usuario } from '../domain';
import { AcessoState } from './acesso-state';
import { LoginState } from '../login/login-state';

@Component({
  selector: 'lista-pessoal',
  template: `
    <div class="table-responsive">
      <table class="no-bottom-margin table table-striped table-hover dt-responsive" width="100%">
        <thead>
          <tr>
            <th>Mat</th>
            <th>Nome</th>
            <th>email</th>
            <th>Cargo</th>
            <th>Lotação</th>
            <th>Habilitado</th>
            <th>Perfis</th>
          </tr>
        </thead>
        <tbody *ngIf="!(buscando | async)">
          <tr *ngFor="let usuario of usuarios | async; let i = index;">
            <td>{{usuario.matricula}}</td>
            <td>{{usuario.nome}}</td>
            <td>{{usuario.email}}</td>
            <td>{{usuario.cargo}}</td>
            <td>{{usuario.cargo}}</td>
            <td><input type="checkbox"
                  *ngIf="matriculaUsuarioLogado !== usuario.matricula"
                  [checked]="usuario.ativo"
                  (change)="onChange($event, i, usuario)"
                >
            </td>
            <td style='min-width: 400px; width: 400px; max-width: 400px; min-height: 100px;'>
              <ng-select [items]="acessoStatePublico.perfis.value" [multiple]="true" [closeOnSelect]="true"
              [clearable]="false" bindLabel="descricao" [(ngModel)]="usuario.roles" [ngModelOptions]="{standalone: true}"
                placeholder="Selecione" (remove)="onRemove($event, usuario)" (add)="onAdd($event, usuario)" class="custom" appendTo="body">
              </ng-select>
            </td>
          </tr>
        </tbody>
        <tbody *ngIf="buscando | async">
          <tr>
            <td colspan="6">Buscando...</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center mtb20">
      <button class="btn btn-default btn-sm" (click)="onRefreshClick()"> <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Atualizar </button>
    </div>
    `
})
export class ListaPessoalComponent implements OnDestroy {

  private matricula: Observable<string>;

  public buscando: Observable<boolean>;

  public usuarios: Observable<Usuario[]>;

  public perfis: Observable<String[]>;

  private subs: Subscription;

  perfisSelecionados: String[];

  acessoStatePublico: AcessoState;

  public matriculaUsuarioLogado: string;

  constructor(
    private http: HttpClient,
    private acessoState: AcessoState,
    private loginState: LoginState
  ) {
    this.usuarios = this.acessoState.usuarios;
    this.buscando = this.acessoState.buscando;
    this.perfis = this.acessoState.perfis;
    this.acessoStatePublico = acessoState;

    this.subs = this.loginState.usuario.subscribe((usuarioLogin) => {
      if (usuarioLogin) {
        this.matriculaUsuarioLogado = usuarioLogin.matricula;
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onRefreshClick() {
    this.acessoState.refresh();
  }

  onChange($event, i, usuario) {
    this.http.patch('api/usuarios/' + usuario.id, { ativo: $event.target.checked })
      .subscribe();
  }

  onChangeRole($event, usuario, perfil) {
    const url = 'api/controleAcesso/' + usuario.id + '/' + perfil;
    if ($event.target.checked) {
      this.http.post(url, '')
        .subscribe(() => {
        });

    } else {
      this.http.delete(url)
        .subscribe(() => {
        });
    }
  }

  onRemove($event, usuario) {
    const url = 'api/controleAcesso/' + usuario.id + '/' + $event.label;
    this.http.delete(url)
      .subscribe(() => {
      });
  }

  onAdd($event, usuario) {
    const url = 'api/controleAcesso/' + usuario.id + '/' + $event;
    this.http.post(url, '')
      .subscribe(() => {
      });
  }

  verificarUsuarioPerfil(perfis: Array<string>, perfil: string): boolean {
    return perfis.indexOf(perfil) > -1;
  }

}

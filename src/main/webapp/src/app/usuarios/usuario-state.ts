import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { UsuarioConvenio, AcessoTO, Anexo } from '../domain';
import { ListaUsuarioComponent } from './lista-usuario.component';

@Injectable()
export class UsuarioState {

  public usuarioConvenio: BehaviorSubject<UsuarioConvenio>;

  public usuariosConvenio: BehaviorSubject<UsuarioConvenio[]>;

  public acessos: BehaviorSubject<AcessoTO[]>;

  public filtroPerfil: BehaviorSubject<string>;

  public listaUsuario: ListaUsuarioComponent;

  public anexosBehavior: BehaviorSubject<Anexo[]>;

  constructor(
    private http: HttpClient
  ) {
    this.usuariosConvenio = new BehaviorSubject([]);
    this.usuarioConvenio = new BehaviorSubject(null);
    this.acessos = new BehaviorSubject([]);
    this.anexosBehavior = new BehaviorSubject([]);
    this.filtroPerfil = new BehaviorSubject('todos');
  }

  atualizarUsuario($event, usuario) {
    this.http.patch('api/usuarioConvenios/' + usuario.id, { atualizado: $event.target.checked })
      .subscribe();
  }
  selecionarUsuarioConvenio(usuarioConvenio: UsuarioConvenio) {
    this.usuarioConvenio.next(usuarioConvenio);
  }

  carregarTabela(dataTablesParameters: any, callback: (page) => void) {

    const filtroPerfil = this.filtroPerfil.value;

    const pesquisa = dataTablesParameters.search.value;
    let url = 'api/usuarioConvenio/lista?';

    url += 'pesquisa=';
    if (pesquisa) {
      url += encodeURI(pesquisa);
    }

    url += '&filtroCargo=' + filtroPerfil;

    const pageNum = dataTablesParameters.start / dataTablesParameters.length;
    const page = '&size=' + dataTablesParameters.length + '&page=' + pageNum;

    let sort = '';
    for (let i = 0; i < dataTablesParameters.order.length; i++) {
      if (dataTablesParameters.order[i].column === 0) {
        sort += '&sort=p.matricula,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 1) {
        sort += '&sort=p.nome,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 2) {
        sort += '&sort=p.email,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 3) {
        sort += '&sort=p.cpf,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 4) {
        sort += '&sort=p.lotacao.sigla,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 5) {
        sort += '&sort=p.desligado,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 6) {
        sort += '&sort=atualizado,' + dataTablesParameters.order[i].dir;
      }
    }

    this.http
      .get(url + page + sort)
      .subscribe((data: any) => {
        if (data._embedded) {
          this.usuariosConvenio.next(data._embedded.usuarioConvenios);
        } else {
          this.usuariosConvenio.next([]);
        }

        callback(data.page);
      });
  }

  getAnexosUsuario() {
    if (!this.usuarioConvenio.value) {
      return;
    }
    const url = 'api/usuarioConvenios/' + this.usuarioConvenio.value.id + '/anexos';
    this.http.get(url)
      .subscribe((data: any) => {
        this.anexosBehavior.next(data._embedded.anexos);
      });
  }

}

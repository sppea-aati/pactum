import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';




import { BaseDados, Anexo } from '../domain';

@Injectable()
export class BaseDadosState {

  public basesDados: BehaviorSubject<BaseDados[]>;

  public baseDados: BehaviorSubject<BaseDados>;

  public editando: BehaviorSubject<boolean>;

  public filtroOrgaoOrigem: BehaviorSubject<string>;

  public filtroNomeBase: BehaviorSubject<string>;

  public anexosBehavior: BehaviorSubject<Anexo[]>;

  public totalRegistros: BehaviorSubject<number>;

  constructor(
    private http: HttpClient
  ) {
    this.basesDados = new BehaviorSubject([]);
    this.filtroOrgaoOrigem = new BehaviorSubject('');
    this.filtroNomeBase = new BehaviorSubject('');
    this.baseDados = new BehaviorSubject(null);
    this.editando = new BehaviorSubject(false);
    this.anexosBehavior = new BehaviorSubject([]);
    this.totalRegistros = new BehaviorSubject(0);
  }

  selecionarBaseDados(baseDados: BaseDados) {
    this.baseDados.next(baseDados);
  }

  iniciarEdicaoBaseDados() {
    if (!this.editando.getValue()) {
      this.editando.next(true);
    }
  }

  onCancelarEdicaoBaseDados() {
    this.editando.next(false);
  }

  getAnexosBaseDados() {
    if (!this.baseDados.value) {
      return;
    }
    const url = 'api/basesDados/' + this.baseDados.value.id + '/anexos';
    this.http.get(url)
      .subscribe((data: any) => {
        this.anexosBehavior.next(data._embedded.anexos);
      });
  }

}

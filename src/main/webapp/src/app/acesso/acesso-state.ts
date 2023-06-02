import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { Usuario } from '../domain';

@Injectable()
export class AcessoState {

  public matricula: BehaviorSubject<string>;

  public buscando: BehaviorSubject<boolean>;

  public usuarios: BehaviorSubject<Usuario[]>;

  public perfis: BehaviorSubject<String[]>;

  private lastMatricula = '';

  constructor(
    private http: HttpClient
  ) {
    this.matricula = new BehaviorSubject('');
    this.buscando = new BehaviorSubject(false);
    this.usuarios = new BehaviorSubject([]);
    this.perfis = new BehaviorSubject([]);

    this.matricula.subscribe(data => this.onMatriculaChange(data));
    this.getPerfis();
  }

  onMatriculaChange(matricula: string) {
    let url = 'api/usuarios?';
    const page = '&size=10000&page=0';
    if (matricula) {
      url = 'api/usuarios/search/findByMatricula?';
      url += 'matricula=' + matricula;
      this.lastMatricula = matricula;
    } else {
      this.lastMatricula = '';
    }
    this.buscando.next(true);
    this.http.get(url + page)
      .subscribe((data: any) => {
        this.buscando.next(false);
        this.usuarios.next(data._embedded.usuarios);
      });
  }

  cadastrarMatricula(matricula: string) {
    if (!matricula) {
      return;
    }
    const url = 'api/usuario/novo/' + matricula;
    return this.http.get(url);
  }

  refresh() {
    this.onMatriculaChange(this.lastMatricula);
  }

  getPerfis() {
    const url = 'api/controleAcesso/perfis';
    this.http.get(url)
      .subscribe((data: any) => {
        this.perfis.next(data);
      });
  }
}

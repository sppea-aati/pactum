import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseDados } from '../domain';
import { ActivatedRoute, Params } from '@angular/router';

import * as util from '../util/util';

@Component({
  selector: 'lista-baseDados-impressao',
  template: `
  <div class="table-responsive">
    <table class="table table-striped table-hover table-condensed" width="100%">
      <thead>
        <tr>
          <th>Nome da Base</th>
          <th>Orgão Origem</th>
          <th>Periodicidade</th>
          <th>Data Última Extração</th>
          <th>Fonte Obtenção</th>
          <th>Situação</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let baseDados of basesDados">
          <td>{{baseDados.nomeBase}}</td>
          <td>{{baseDados.orgaoOrigem}}</td>
          <td>{{baseDados.periodicidade}}</td>
          <td>{{baseDados.ultimaDataExtracao | date:'shortDate'}}</td>
          <td>{{baseDados.fonteObtencao}}</td>
          <td>{{baseDados.situacao}}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class ListaBaseDadosImpressaoComponent {

  public basesDados: BaseDados[];

  filtroOrgaoOrigem: string;
  filtroNomeBase: string;

  totalRegistros: number;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.filtroOrgaoOrigem = params['filtroOrgaoOrigem'];
      this.filtroNomeBase = params['filtroNomeBase'];
      this.totalRegistros = params['totalRegistros'];
      this.carregarLista();
    });
  }

  carregarLista() {
    let url = 'api/basesDados/lista?';

    url += 'orgaoOrigem=' + this.filtroOrgaoOrigem;

    url += '&nomeBase=' + this.filtroNomeBase;

    url += '&excluido=N';

    url += '&size=' + this.totalRegistros;

    this.http
      .get(url)
      .subscribe((data: any) => {
        this.basesDados = data._embedded.basesDados.map((item: BaseDados) => util.situacao(item));
      });
  }

}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Convenio } from '../domain';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'lista-convenio-impressao',
  template: `
  <div class="table-responsive">
    <table class="table table-striped table-hover table-condensed" width="100%">
      <thead>
        <tr>
          <th>Sigla</th>
          <th>Nome</th>
          <th>Término da vigência</th>
          <th>Procedimento</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let convenio of convenios">
          <td>{{convenio.sigla}}</td>
          <td>{{convenio.descricao}}</td>
          <td>{{convenio.dataFimVigencia | date:'shortDate'}}</td>
          <td>{{convenio.numeroProcedimento}}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class ListaConvenioImpressaoComponent {

  public convenios: Convenio[];

  filtroSigla: string;
  filtroNome: string;
  filtroVencimento: number;
  totalRegistros: number;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.filtroSigla = params['filtroSigla'];
      this.filtroNome = params['filtroNome'];
      this.filtroVencimento = params['filtroVencimento'];
      this.totalRegistros = params['totalRegistros'];
      this.carregarLista();
    });
  }

  carregarLista() {
    let url = 'api/convenios/lista?';

    url += 'descricao=' + this.filtroNome;
    url += '&sigla=' + this.filtroSigla;
    url += '&excluido=N';
    url += '&diasAteVencimento=' + this.filtroVencimento;
    url += '&size=' + this.totalRegistros;

    this.http
      .get(url)
      .subscribe((data: any) => {
        this.convenios = data._embedded.convenios;
      });
  }

}

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ConvenioState } from './convenio-state';
import { Convenio, AcessoTO } from '../domain';
import * as util from '../util/util';


@Component({
  selector: 'lista-acesso-convenio-impressao',
  template: `
  <h4>Convênio: <span *ngIf="convenio">{{convenio.sigla}} - {{convenio.descricao}}</span></h4>
  <div class="table-responsive">
    <table class="table table-striped table-hover table-condensed" width="100%">
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Nome</th>
          <th>Cargo</th>
          <th>Lotação</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>CPF</th>
          <th>Situação</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let acesso of acessos">
          <td>{{acesso.matricula}}</td>
          <td>{{acesso.nomeUsuario}}</td>
          <td>{{acesso.descricaoCargo}}</td>
          <td>{{acesso.lotacao}}</td>
          <td>{{acesso.email}}</td>
          <td>{{acesso.telefoneComercial}}</td>
          <td>{{acesso.cpf}}</td>
          <td>{{formatarOperacaoAcesso(acesso)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class ListaAcessoConvenioImpressaoComponent {

  private idConvenio: number;
  private pesquisa: string;
  private filtroCargo: string;
  private totalRegistros: number;
  public acessos: AcessoTO[];
  public convenio: Convenio;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.idConvenio = params['idConvenio'];
      this.pesquisa = params['pesquisa'];
      this.filtroCargo = params['filtroCargo'];
      this.totalRegistros = params['totalRegistros'];
      this.carregarLista();
    });
  }

  carregarLista() {
    let url = 'api/acesso/acessosPorConvenio?convenioId=' + this.idConvenio;

    if (this.pesquisa) {
      url += '&pesquisa=' + this.pesquisa;

    } else {
      url += '&pesquisa=';
    }

    url += '&filtroCargo=' + this.filtroCargo;

    url += '&size=' + this.totalRegistros;

    url += '&sort=usuarioConvenio.pessoal.nome,asc';

    this.http
      .get(url)
      .subscribe((data: any) => {
        this.acessos = data._embedded.acessoToes;
      });
  }

  formatarOperacaoAcesso(acesso: AcessoTO): string {
    return util.formatarOperacaoAcesso(acesso);
  }
}

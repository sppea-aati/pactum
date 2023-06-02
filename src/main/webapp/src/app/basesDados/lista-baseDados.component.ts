import { Component, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';

import { BaseDados } from '../domain';
import { Router } from '@angular/router';

import { BaseDadosState } from './baseDados-state';

import * as util from '../util/util';

@Component({
  selector: 'lista-baseDados',
  template: `
  <filtros-baseDados></filtros-baseDados>
  <div class="table-responsive">
    <table id="tbl_listaBaseDados" class="table table-striped table-hover table-condensed dt-responsive" width="100%" datatable [dtOptions]="dtOptions">
      <thead>
        <tr>
          <th>Nome da Base</th>
          <th>Orgao Origem</th>
          <th>Periodicidade</th>
          <th>Data Última Extração</th>
          <th>Fonte Obtenção</th>
          <th>Situação</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let baseDados of basesDados | async; let i = index;">
          <td>{{baseDados.nomeBase}}</td>
          <td>{{baseDados.orgaoOrigem}}</td>
          <td>{{baseDados.periodicidade}}</td>
          <td>{{baseDados.ultimaDataExtracao | date:'shortDate'}}</td>
          <td>{{baseDados.fonteObtencao}}</td>
          <td><span class="label label-{{ baseDados.cls }}"> {{ baseDados.situacao }}</span></td>
          <td>
            <a href="#" (click)="selecionarBaseDados($event, baseDados)" class="clickable" data-toggle="tooltip" title="Ver detalhes">
              <span class="glyphicon glyphicon-search" style="color:#2196F3"></span>
            </a>
            <a href="#" [routerLink]="[baseDados.id, 'editar']" class="clickable" data-toggle="tooltip" title="Editar">
              <span class="glyphicon glyphicon-pencil" style="color:#FFC107"></span>
            </a>
            <a href="#" (click)="removerBaseDados($event, baseDados)" class="clickable" data-toggle="tooltip" title="Remover">
              <span class="glyphicon glyphicon-remove" style="color:#FF1111"></span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!--div class="empty-results">
    <div class="no-results no-results-message">
      <h3>Nenhum convênio de acordo com sua busca foi encontrado</h3>
      <p class="no-results-hint">Tente mudar o criterio da pesquisa ou <a href="#" [routerLink]="['/convenios/novo']">cadastre um novo convênio.</a></p>
    </div>
  </div-->
  `
})
export class ListaBaseDadosComponent implements OnDestroy, AfterViewInit {

  public basesDados: Observable<BaseDados[]>;

  public alterarFiltroOrgaoOrigemSubscription: Subscription;

  public alterarFiltroNomeBaseSubscription: Subscription;

  public dtOptions: any = {};

  private primeiraCargaOrgaoOrigem = false;
  private primeiraCargaNomeBase = false;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    private http: HttpClient,
    private baseDadosState: BaseDadosState,
    private router: Router
  ) {
    this.basesDados = this.baseDadosState.basesDados;
    this.carregarTabela();
  }

  ngAfterViewInit() {
    this.alterarFiltroOrgaoOrigemSubscription = this.baseDadosState.filtroOrgaoOrigem
      .subscribe((filtro) => {
        if (!this.primeiraCargaOrgaoOrigem) {
          this.primeiraCargaOrgaoOrigem = true;
          return;
        }
        this.rerender();
      });

    this.alterarFiltroNomeBaseSubscription = this.baseDadosState.filtroNomeBase
      .subscribe((filtro) => {
        if (!this.primeiraCargaNomeBase) {
          this.primeiraCargaNomeBase = true;
          return;
        }
        this.rerender();
      });
  }

  ngOnDestroy(): void {
    this.alterarFiltroNomeBaseSubscription.unsubscribe();
    this.alterarFiltroOrgaoOrigemSubscription.unsubscribe();
  }

  selecionarBaseDados(event, baseDados: BaseDados) {
    event.preventDefault();
    this.baseDadosState.selecionarBaseDados(baseDados);
    this.router.navigate(['/basesDados', baseDados.id]);
  }

  removerBaseDados(event, baseDados) {
    event.preventDefault();
    if (!confirm('Tem certeza que deseja apagar essa base de dados?')) {
      return;
    }
    this.http.patch('api/basesDados/' + baseDados.id, { excluido: 'true' })
      .subscribe((data: any) => {
        this.rerender();
      });
  }

  filtrar(dataTablesParameters, callback: (page) => void) {
    let url = 'api/basesDados/lista?';
    const filtroOrgaoOrigem = this.baseDadosState.filtroOrgaoOrigem.value;
    const filtroNomeBase = this.baseDadosState.filtroNomeBase.value;

    url += 'orgaoOrigem=';
    url += encodeURI(filtroOrgaoOrigem);

    url += '&nomeBase=';
    url += encodeURI(filtroNomeBase);

    const pageNum = dataTablesParameters.start / dataTablesParameters.length;
    const page = '&size=' + dataTablesParameters.length + '&page=' + pageNum;

    let sort = '';
    for (let i = 0; i < dataTablesParameters.order.length; i++) {
      if (dataTablesParameters.order[i].column === 0) {
        sort += '&sort=nomeBase,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 1) {
        sort += '&sort=orgaoOrigem,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 2) {
        sort += '&sort=periodicidade,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 3) {
        sort += '&sort=ultimaDataExtracao,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 4) {
        sort += '&sort=fonteObtencao,' + dataTablesParameters.order[i].dir;
      }
    }

    this.http
      .get(url + page + sort)
      .subscribe((data: any) => {
        let basesDados;
        if (data && data._embedded) {
          basesDados = data._embedded.basesDados.map((item: BaseDados) => util.situacao(item));
        } else {
          basesDados = [];
        }
        this.baseDadosState.basesDados.next(basesDados);
        this.baseDadosState.totalRegistros.next(data.page.totalElements);
        callback(data.page);
      });
  }

  carregarTabela() {
    this.dtOptions = {
      pageLength: 10,
      language: {
        url: 'assets/Portuguese-Brasil.json'
      },
      stateDuration: -1,
      serverSide: true,
      processing: true,
      bFilter: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.filtrar(dataTablesParameters, (page) => {
          callback({
            recordsTotal: page.totalElements,
            recordsFiltered: page.totalElements,
            data: [],
          });
        });
      },
      order: [0, 'asc'],
      columns: [
        { name: 'nomeBase', width: '20%' },
        { name: 'orgaoOrigem', width: '20%' },
        { name: 'periodicidade', width: '10%' },
        { name: 'dataUltmaExtracao', width: '10%' },
        { name: 'fonteObtencao', width: '15%' },
        { name: 'situacao', width: '10%' },
        { width: '7%' },
      ],
      columnDefs: [
        {
          targets: [5, 6],
          orderable: false,
        },
      ]
    };
  }

  rerender(): void {
    if (!this.dtElement || !this.dtElement.dtInstance) {
      return;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public limparStateTabela($event) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
}

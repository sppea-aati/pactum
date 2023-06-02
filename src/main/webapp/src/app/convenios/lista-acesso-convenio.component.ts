import { Component, HostListener } from '@angular/core';
import { OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AcessoTO, Convenio } from '../domain';
import { ConvenioState } from './convenio-state';
import { ModalHistoricoAcessoComponent } from '../usuarios/modal-hitorico-acesso';

import { DataTableDirective } from 'angular-datatables';

import * as util from '../util/util';
@Component({
  selector: 'lista-acesso-convenio',
  template: `
  <div *ngIf="convenio | async; let convenio; else noSelection">
    <div class="table-responsive">
      <div class="btn-group">
        <a class="btn">Filtro</a>
        <button type="button" [class.btn-primary]="(filtroCargoUsuario | async) === 'todos'" class="btn btn-default btn-sm" (click)="onCargoChange('todos')">Todos</button>
        <button type="button" [class.btn-primary]="(filtroCargoUsuario | async) === 'servidor'" class="btn btn-default btn-sm" (click)="onCargoChange('servidor')">Servidor</button>
        <button type="button" [class.btn-primary]="(filtroCargoUsuario | async) === 'membro'" class="btn btn-default btn-sm" (click)="onCargoChange('membro')">Membro</button>
      </div>
      <div class="btn-group">
        <a class="btn">Cadastrados</a>
        <button type="button" [class.btn-primary]="(filtroCadastrados | async) === 'todos'" class="btn btn-default btn-sm" (click)="onFiltroCadastradosChange('todos')">Todos</button>
        <button type="button" [class.btn-primary]="(filtroCadastrados | async) === 'cadastrados'" class="btn btn-default btn-sm" (click)="onFiltroCadastradosChange('cadastrados')">Cadastrados</button>
      </div>
      <a target="_blank" href="#" [routerLink]="['impressao']" [queryParams]="{idConvenio: this.convenioSelecionado.id, pesquisa: convenioState.filtroPesquisa.value, filtroCargo: convenioState.filtroCargoUsuario.value, totalRegistros: convenioState.totalRegistros.value}" class="btn btn-default btn-sm pull-right">
          <span class="glyphicon glyphicon-print" aria-hidden="true"></span> Imprimir
      </a>
      <hr>
      <table id="tbl_listaAcessosConvenio" class="table table-striped table-hover table-condensed" datatable [dtOptions]="dtOptions">
        <thead>
        <tr>
                    <th>Matrícula</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th>Lotação</th>
                    <th>Desligado</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>&nbsp;</th>
                    <th>Histórico</th>
                </tr>
        </thead>
        <tbody>
          <tr *ngFor="let acesso of acessos | async; let i = index;">
            <td>{{acesso.matricula}}</td>
            <td>{{acesso.nomeUsuario}}</td>
            <td>{{acesso.email}}</td>
            <td>{{formatarCPF(acesso.cpf)}}</td>
            <td>{{acesso.lotacao}}</td>
            <td>{{acesso.desligado}}</td>
            <td><span [class]='this.operacaoAcessoLabelClass(acesso)'>{{formatarOperacaoAcesso(acesso)}}</span></td>
            <td>{{formatarDataAcesso(acesso)}}</td>
            <td class="text-center">
              <button type="button" class="btn btn-default btn-sm" [disabled]="this.buttonDisabled(acesso.operacaoAcesso, 'cadastrar') || (acesso.desligado === 'SIM')"
                (click)="realizarAcesso(acesso, 'CADASTRAR')">Cadastrar</button>
              <button type="button" class="btn btn-default btn-sm" [disabled]="this.buttonDisabled(acesso.operacaoAcesso, 'recadastrar') || (acesso.desligado === 'SIM')"
                (click)="realizarAcesso(acesso, 'RECADASTRAR')">Recadastrar</button>
              <button type="button" class="btn btn-default btn-sm" [disabled]="this.buttonDisabled(acesso.operacaoAcesso, 'remover')"
                (click)="realizarAcesso(acesso, 'REMOVER')">Remover</button>
            </td>
            <td class="text-center">
              <span class="glyphicon glyphicon-search" style="font-size: 18px; color:#2196F3" (click)="exibirHistorico(acesso)"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div #modalHitoricoAcesso></div>
  </div>
  <ng-template #noSelection>Nenhum convênio selecionado.</ng-template>
`

})
export class ListaAcessoConvenioComponent implements OnInit {

  public acessos: Observable<AcessoTO[]>;

  public convenio: Observable<Convenio>;

  public convenioSelecionado: Convenio;

  public dtOptions: DataTables.Settings = {};

  public filtroCargoUsuario: Observable<string>;

  public filtroCadastrados: Observable<string>;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  @ViewChild('modalHitoricoAcesso', { read: ViewContainerRef })
  target: ViewContainerRef;
  private componentRef: ComponentRef<ModalHistoricoAcessoComponent>;

  constructor(
    private convenioState: ConvenioState,
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.convenio = this.convenioState.convenio;
    this.acessos = this.convenioState.acessos;
    this.filtroCargoUsuario = this.convenioState.filtroCargoUsuario;
    this.filtroCadastrados = this.convenioState.filtroCadastrados;
  }

  ngOnInit(): void {
    this.convenio.subscribe(convenio => {
      this.convenioSelecionado = convenio;
      this.rerender();
    });
    this.carregarTabela();
  }

  carregarTabela() {
    this.dtOptions = {
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      language: {
        url: 'assets/Portuguese-Brasil.json'
      },
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        if (this.convenioSelecionado) {
          this.convenioState.carregarTabelaAcessoConvenio(this.convenioSelecionado.id, dataTablesParameters, (page) => {
            callback({
              recordsTotal: page.totalElements,
              recordsFiltered: page.totalElements,
              data: [],
            });
          });
        } else {
          callback({
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        }
      },
      order: [ [6, 'asc'], [1, 'asc'] ],
      columns: [
        { width: '5%' }, // Matrícula
        { width: '10%' }, // Nome
        { width: '10%' }, // E-mail
        { width: '7%' }, // CPF
        { width: '25%' }, // Lotação
        { width: '5%' }, // Desligado
        { width: '5%' }, // status
        { width: '8%' }, // data
        { width: '18%' }, // Ações
        { width: '5%' }, // historico
      ],
      columnDefs: [{
          targets: [5, 8, 9],
          orderable: false
        }
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

  onChangeAtivo($event, i, acesso) {
    this.http.patch('api/acessos/' + acesso.id, { ativo: $event.target.checked })
      .subscribe();
  }

  onCargoChange(cargo) {
    this.convenioState.setFiltroCargoUsuario(cargo);
    this.rerender();
  }

  onFiltroCadastradosChange(cadastrados) {
    this.convenioState.setFiltroCadastrados(cadastrados);
    this.rerender();
  }

  formatarCPF(cpf: string): string {
    return util.formatarCPF(cpf);
  }

  buttonDisabled(operacao: string, botao: string): boolean {
    if (!operacao) {
      if (botao === 'cadastrar') {
        return false;
      } else {
        return true;
      }
    } else {
      if (operacao === 'CADASTRAR' || operacao === 'RECADASTRAR') {
        if (botao === 'cadastrar') {
          return true;
        } else {
          return false;
        }
      } else if (operacao === 'REMOVER') {
        if (botao === 'cadastrar') {
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  }

  formatarOperacaoAcesso(acesso: AcessoTO): string {
    return util.formatarOperacaoAcesso(acesso);
  }

  operacaoAcessoLabelClass(acesso: AcessoTO): string {
    if (!acesso.operacaoAcesso) {
      return '';
    }
    let labelClass = '';
    if (acesso.operacaoAcesso === 'CADASTRAR' || acesso.operacaoAcesso === 'RECADASTRAR') {
      labelClass = 'label label-success';
    } else if (acesso.operacaoAcesso === 'REMOVER') {
      labelClass = 'label label-danger';
    }
    return labelClass;
  }

  formatarDataAcesso(acesso: AcessoTO): string {
    if (!acesso.data) {
      return '';
    }
    return util.getFormattedDate(new Date(acesso.data));
  }

  realizarAcesso(acesso: AcessoTO, operacao: string) {

    this.http.post('api/acessos', {
      convenio: '/api/convenios/' + this.convenioSelecionado.id,
      usuarioConvenio: '/api/usuariosConvenio/' + acesso.usuarioId,
      operacaoAcesso: operacao
    }).subscribe((data) => {
      this.rerender();
    });
  }

  exibirHistorico(acesso: AcessoTO) {
    const url = 'api/acesso/acessosUsuarioConvenio?idUsuario=' + acesso.usuarioId + '&idConvenio=' + this.convenioSelecionado.id;

    this.http.get(url).subscribe((data) => {
      const childComponent = this.componentFactoryResolver.resolveComponentFactory(ModalHistoricoAcessoComponent);
      this.componentRef = this.target.createComponent(childComponent);

      this.componentRef.instance.toggleModal(data, this.target);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public limparStateTabela($event) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }

}

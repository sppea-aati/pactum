import { Component, HostListener } from '@angular/core';
import { OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { AcessoTO, Acesso, UsuarioConvenio, Convenio } from '../domain';
import { UsuarioState } from './usuario-state';
import * as util from '../util/util';
// import { MatDialog } from '@angular/material';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ConvenioService } from '../convenios/convenio.service';
import { ModalHistoricoAcessoComponent } from './modal-hitorico-acesso';
import { TargetLocator } from 'selenium-webdriver';

@Component({
  selector: 'lista-convenio-usuario',
  templateUrl: 'lista-convenio-usuario.html'
})
export class ListaConvenioUsuarioComponent implements OnInit, OnDestroy {

  public usuarioConvenio: BehaviorSubject<UsuarioConvenio>;

  private usuarioConvenioSubscription: Subscription;

  public acessos: Observable<AcessoTO[]>;

  public dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  @ViewChild('modalHitoricoAcesso', { read: ViewContainerRef })
  target: ViewContainerRef;
  private componentRef: ComponentRef<ModalHistoricoAcessoComponent>;

  constructor(private usuarioState: UsuarioState, private convenioService: ConvenioService, private http: HttpClient, private componentFactoryResolver: ComponentFactoryResolver) {
    this.usuarioConvenio = this.usuarioState.usuarioConvenio;
    this.acessos = this.usuarioState.acessos;
  }

  ngOnInit(): void {
    this.usuarioConvenioSubscription = this.usuarioConvenio.subscribe(usuarioConvenio => {
      this.rerender();
    });
    this.carregarTabela();
  }

  buttonDisabled(operacao: string, botao: string): boolean {
    if (!operacao) {
      if (botao === 'cadastrar' && this.usuarioConvenio.value.pessoal.desligado === 'NÃO') {
        return false;
      } else {
        return true;
      }
    } else {
      if ((botao === 'cadastrar' || botao === 'recadastrar') && this.usuarioConvenio.value.pessoal.desligado === 'SIM') {
        return true;
      }
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

  realizarAcesso(acesso: AcessoTO, operacao: string) {

    this.http.post('api/acessos', {
      convenio: '/api/convenios/' + acesso.convenioId,
      usuarioConvenio: '/api/usuariosConvenio/' + this.usuarioConvenio.value.id,
      operacaoAcesso: operacao
    }).subscribe((data) => {
      this.rerender();
    });

  }

  exibirHistorico(acesso: AcessoTO) {
    const url = 'api/acesso/acessosUsuarioConvenio?idUsuario=' + this.usuarioConvenio.value.id + '&idConvenio=' + acesso.convenioId;

    this.http.get(url).subscribe((data) => {
      const childComponent = this.componentFactoryResolver.resolveComponentFactory(ModalHistoricoAcessoComponent);
      this.componentRef = this.target.createComponent(childComponent);

      this.componentRef.instance.toggleModal(data, this.target);
    });
  }

  formatarOperacaoAcesso(acesso: AcessoTO): string {
    if (!acesso.operacaoAcesso) {
      return '';
    }
    let operacao = '';
    if (acesso.operacaoAcesso === 'CADASTRAR') {
      operacao = 'Cadastrado';
    } else if (acesso.operacaoAcesso === 'RECADASTRAR') {
      operacao = 'Recadastrado';
    } else if (acesso.operacaoAcesso === 'REMOVER') {
      operacao = 'Removido';
    }
    return operacao;
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

  ngOnDestroy() {
    this.usuarioConvenioSubscription.unsubscribe();
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
        if (this.usuarioConvenio.value) {
          this.filtrar(dataTablesParameters, (page) => {
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
      columns: [
        { name: 'convenio.sigla', width: '12%' },
        { name: 'convenio.descricao', width: '30%' },
        { name: 'operacaoAcesso', width: '14%' },
        { name: 'data', width: '14%' },
        { name: 'operacao', width: '25%', orderable: false },
        { name: 'historico', width: '5%', orderable: false }
      ],
      order: [[2, 'asc'], [0, 'asc']],
    };
  }

  filtrar(dataTablesParameters, callback: (page) => void) {

    const sortColumn = new Array();
    const sortDirection = new Array();

    for (let i = 0; i < dataTablesParameters.order.length; i++) {
      sortColumn[i] = dataTablesParameters.columns[dataTablesParameters.order[i].column].name;
      sortDirection[i] = dataTablesParameters.order[i].dir;
    }

    this.convenioService.consultarAcessosConvenio(this.usuarioConvenio.value.id,
      dataTablesParameters.search.value,
      dataTablesParameters.start,
      dataTablesParameters.length,
      sortColumn,
      sortDirection)
      .subscribe((data: any) => {
        if (data._embedded) {
          this.usuarioState.acessos.next(data._embedded.acessoToes);
        } else {
          this.usuarioState.acessos.next([]);
        }
        callback(data.page);
      });
  }

  rerender(): void {
    if (!this.dtElement || !this.dtElement.dtInstance) {
      return;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public limparStateTabela($event) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }

}

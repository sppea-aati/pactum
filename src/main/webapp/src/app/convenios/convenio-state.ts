import { Injectable, Component } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Convenio, AcessoTO, UsuarioConvenio, Anexo, FiltrosConvenios, Filter } from '../domain';

@Injectable()
export class ConvenioState {

  public convenios: BehaviorSubject<Convenio[]>;

  public convenio: BehaviorSubject<Convenio>;

  public editando: BehaviorSubject<boolean>;

  private convenioBackup: Convenio;

  public acessos: BehaviorSubject<AcessoTO[]>;

  public anexosBehavior: BehaviorSubject<Anexo[]>;

  public filtroSigla: BehaviorSubject<string>;

  public filtroNome: BehaviorSubject<string>;

  public filtroDiasAteVencimento: BehaviorSubject<number>;

  public alterarFiltro: BehaviorSubject<null>;

  public filtroExcluido: BehaviorSubject<string>;

  public filtroCargoUsuario: BehaviorSubject<string>;

  public filtroCadastrados: BehaviorSubject<string>;

  public filtroPesquisa: BehaviorSubject<string>;

  public totalRegistros: BehaviorSubject<number>;

  constructor(
    private http: HttpClient
  ) {
    this.convenios = new BehaviorSubject([]);
    this.convenio = new BehaviorSubject(null);
    this.editando = new BehaviorSubject(false);
    this.acessos = new BehaviorSubject([]);
    this.anexosBehavior = new BehaviorSubject([]);
    this.filtroSigla = new BehaviorSubject('');
    this.filtroNome = new BehaviorSubject('');
    this.filtroExcluido = new BehaviorSubject('N');
    this.filtroDiasAteVencimento = new BehaviorSubject(-1);
    this.alterarFiltro = new BehaviorSubject(null);
    this.filtroCargoUsuario = new BehaviorSubject('todos');
    this.filtroCadastrados = new BehaviorSubject('todos');
    this.filtroPesquisa = new BehaviorSubject('');
    this.totalRegistros = new BehaviorSubject(0);
  }

  selecionarConvenio(convenio: Convenio) {
    this.convenio.next(convenio);
  }

  selecionarFiltro(filtrosConvenio: Filter[]) {
    // this.filtrosConvenios.next(filtrosConvenio);
  }

  setFiltroCargoUsuario(filtroCargoUsuario: string) {
    this.filtroCargoUsuario.next(filtroCargoUsuario);
  }

  setFiltroCadastrados(filtroCadastrados: string) {
    this.filtroCadastrados.next(filtroCadastrados);
  }

  carregarTabelaAcessoConvenio(idConvenio: number, dataTablesParameters: any, callback: (page) => void) {
    this.filtroPesquisa.next(dataTablesParameters.search.value);
    const pesquisa = dataTablesParameters.search.value;
    let url = 'api/acesso/acessosPorConvenio?convenioId=' + idConvenio;

    if (pesquisa) {
      url += '&pesquisa=' + pesquisa;

    } else {
      url += '&pesquisa=';
    }

    url += '&filtroCargo=' + this.filtroCargoUsuario.value;

    url += '&filtroCadastrados=' + this.filtroCadastrados.value;

    const pageNum = dataTablesParameters.start / dataTablesParameters.length;
    url += '&size=' + dataTablesParameters.length + '&page=' + pageNum;

    for (let i = 0; i < dataTablesParameters.order.length; i++) {
      if (dataTablesParameters.order[i].column === 0) {
        url += '&sort=usuarioConvenio.pessoal.matricula,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 1) {
        url += '&sort=usuarioConvenio.pessoal.nome,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 2) {
        url += '&sort=usuarioConvenio.pessoal.email,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 3) {
        url += '&sort=usuarioConvenio.pessoal.cpf,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 4) {
        url += '&sort=usuarioConvenio.pessoal.lotacao,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 6) {
        url += '&sort=operacaoAcesso,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 7) {
        url += '&sort=data,' + dataTablesParameters.order[i].dir;
      }
    }

    this.http
      .get(url)
      .subscribe((data: any) => {
        if (data._embedded) {
          this.acessos.next(data._embedded.acessoToes);
        } else {
          this.acessos.next([]);
        }
        this.totalRegistros.next(data.page.totalElements);
        callback(data.page);
      });
  }

  iniciarEdicaoConvenio() {
    if (!this.editando.getValue()) {
      this.convenioBackup = this.convenio.getValue();
      this.convenio.next({ ...this.convenioBackup });
      this.editando.next(true);
    }
  }

  onSalvarEdicaoConvenio() {
    const c = this.convenio.getValue();
    this.http.patch('api/convenios/' + c.id, c)
      .subscribe(() => {
        this.editando.next(false);
      });
  }

  onCancelarEdicaoConvenio() {
    this.editando.next(false);
    this.convenio.next(this.convenioBackup);
    this.convenioBackup = null;
  }

  getAnexosConvenio() {
    if (!this.convenio.value) {
      return;
    }
    const url = 'api/convenios/' + this.convenio.value.id + '/anexos';
    this.http.get(url)
      .subscribe((data: any) => {
        this.anexosBehavior.next(data._embedded.anexos);
      });
  }

}

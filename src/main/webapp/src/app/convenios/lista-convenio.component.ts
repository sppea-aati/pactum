import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subscription } from 'rxjs';
import { Convenio, Filter } from '../domain';
import { ConvenioState } from './convenio-state';
import { ConvenioService } from './convenio.service';





@Component({
  selector: 'lista-convenio',
  template: `
  <filtros-convenio></filtros-convenio>
  <div class="table-responsive">
    <table id="tbl_listaConvenio" class="table table-striped table-hover table-condensed dt-responsive" width="100%" datatable [dtOptions]="dtOptions">
      <thead>
        <tr>
          <th>Sigla</th>
          <th>Nome</th>
          <th>Término da vigência</th>
          <th>Situação</th>
          <th>Procedimento</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let convenio of convenios | async; let i = index;">
          <td>{{convenio.sigla}}</td>
          <td>{{convenio.descricao}}</td>
          <td>{{convenio.dataFimVigencia | date:'shortDate'}}</td>
          <td><span class="label label-{{ convenio.cls }}"> {{ convenio.situacao }}</span></td>
          <td>{{convenio.numeroProcedimento}}</td>
          <td>
            <a href="#" (click)="selecionarConvenio($event, convenio)" class="clickable" data-toggle="tooltip" title="Ver detalhes">
              <span class="glyphicon glyphicon-search" style="color:#2196F3"></span>
            </a>
            <a href="#" [routerLink]="[convenio.id, 'editar']" class="clickable" data-toggle="tooltip" title="Editar">
              <span class="glyphicon glyphicon-pencil" style="color:#FFC107"></span>
            </a>
            <a href="#" (click)="removerConvenio($event, convenio)" class="clickable" data-toggle="tooltip" title="Remover">
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
export class ListaConvenioComponent implements OnDestroy, AfterViewInit {

  public convenios: Observable<Convenio[]>;

  public dtOptions: any = {};

  public filtrosConvenios: Observable<Filter[]>;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  private primeiraCargaFiltroNome = false;

  private primeiraCargaFiltroSigla = false;

  private primeiraCargaFiltroDiasAteVencimento = false;

  private alterarFiltroNomeSubscription: Subscription;

  private alterarFiltroSiglaSubscription: Subscription;

  private alterarFiltroDiasAteVencimentoSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private convenioState: ConvenioState,
    private router: Router
  ) {
    this.convenios = this.convenioState.convenios;
    this.carregarTabela();
  }

  ngAfterViewInit() {
    this.alterarFiltroNomeSubscription = this.convenioState.filtroNome
      .subscribe((filtro) => {
        if (!this.primeiraCargaFiltroNome) {
          this.primeiraCargaFiltroNome = true;
          return;
        }
        this.rerender();
      });

    this.alterarFiltroSiglaSubscription = this.convenioState.filtroSigla
      .subscribe((filtro) => {
        if (!this.primeiraCargaFiltroSigla) {
          this.primeiraCargaFiltroSigla = true;
          return;
        }
        this.rerender();
      });

    this.alterarFiltroDiasAteVencimentoSubscription = this.convenioState.filtroDiasAteVencimento
      .subscribe((filtro) => {
        if (!this.primeiraCargaFiltroDiasAteVencimento) {
          this.primeiraCargaFiltroDiasAteVencimento = true;
          return;
        }
        this.rerender();
      });
  }

  ngOnDestroy(): void {
    this.alterarFiltroNomeSubscription.unsubscribe();
    this.alterarFiltroSiglaSubscription.unsubscribe();
    this.alterarFiltroDiasAteVencimentoSubscription.unsubscribe();
  }

  selecionarConvenio(event, convenio: Convenio) {
    event.preventDefault();
    this.convenioState.selecionarConvenio(convenio);
    this.router.navigate(['/convenios', convenio.id]);
  }

  removerConvenio(event, convenio) {
    event.preventDefault();
    if (!confirm('Tem certeza que deseja apagar esse convênio?')) {
      return;
    }
    this.http.patch('api/convenios/' + convenio.id, { excluido: 'true' })
      .subscribe((data: any) => {
        this.rerender();
      });
  }


  filtrar(dataTablesParameters, callback: (page) => void) {
    let url = 'api/convenios/lista?';
    const filtroNome = this.convenioState.filtroNome.value;
    const filtroSigla = this.convenioState.filtroSigla.value;
    const filtroExcluido = this.convenioState.filtroExcluido.value;
    const filtroDiasAteVencimento = this.convenioState.filtroDiasAteVencimento.value;

    url += 'descricao=';
    url += encodeURI(filtroNome);

    url += '&sigla=';
    url += encodeURI(filtroSigla);

    url += '&excluido=';
    url += encodeURI(filtroExcluido);

    url += '&diasAteVencimento=';
    url += filtroDiasAteVencimento;

    const pageNum = dataTablesParameters.start / dataTablesParameters.length;
    const page = '&size=' + dataTablesParameters.length + '&page=' + pageNum;

    let sort = '';

    for (let i = 0; i < dataTablesParameters.order.length; i++) {
      if (dataTablesParameters.order[i].column === 0) {
        sort += '&sort=sigla,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 1) {
        sort += '&sort=descricao,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 2) {
        sort += '&sort=dataFimVigencia,' + dataTablesParameters.order[i].dir;
      } else if (dataTablesParameters.order[i].column === 4) {
        sort += '&sort=numeroProcedimento,' + dataTablesParameters.order[i].dir;
      }
    }


    this.http
      .get(url + page + sort)
      .subscribe((data: any) => {
        let convenios;
        if (data && data._embedded) {
          convenios = data._embedded.convenios.map((item: Convenio) => this.situacao(item));
        } else {
          convenios = [];
        }
        this.convenioState.convenios.next(convenios);
        this.convenioState.totalRegistros.next(data.page.totalElements);
        callback(data.page);
      });
  }

  carregarTabela() {
    this.dtOptions = {
      pageLength: 10,
      stateDuration: -1,
      language: {
        url: 'assets/Portuguese-Brasil.json'
      },
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
        { name: 'sigla', width: '15%' },
        { name: 'descricao', width: '35%' },
        { name: 'dataFimVigencia', width: '10%' },
        { name: 'situacao', width: '10%' },
        { name: 'numeroProcedimento', width: '15%' },
        { width: '10%' },
      ],
      columnDefs: [
        {
          targets: [3, 5],
          orderable: false,
        },
      ]
    };
  }

  situacao(convenio: Convenio): Convenio {
    convenio.situacao = '';
    convenio.cls = '';
    if (convenio.diasAteVencimento == null) {
      convenio.situacao = '';
      convenio.cls = 'muted';
    } else if (convenio.diasAteVencimento < 0) {
      convenio.situacao = 'Vencido';
      convenio.cls = 'danger';
    } else if (convenio.diasAteVencimento === 0) {
      convenio.situacao = 'Vence hoje';
      convenio.cls = 'warning';
    } else if (convenio.diasAteVencimento <= 15) {
      convenio.situacao = 'Vencimento próximo';
      convenio.cls = 'info';
    } else if (convenio.diasAteVencimento > 15) {
      convenio.situacao = 'Em vigência';
      convenio.cls = 'success';
    }
    return convenio;
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

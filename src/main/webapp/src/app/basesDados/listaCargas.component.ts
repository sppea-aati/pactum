import { Component, ViewChild } from '@angular/core';
import { CargaBaseDados } from '../domain';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { CargaState } from './carga-state';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'listaCargas',
  template: `
  <div>
    <div class="row row-filtros">
    <div class="col-sm-12">
      <ul class="list-inline" style="margin-bottom:0">
        <li class="pull-left">
          <a href="#" [routerLink]="['carga/novo']" class="btn btn-primary btn-sm btn-adicionar-convenios">
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Adicionar carga
          </a>
        </li>
      </ul>
    </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover table-condensed dt-responsive" width="100%" datatable [dtOptions]="dtOptions">
        <thead>
          <tr>
            <th>Data Extracao</th>
            <th>Data Início</th>
            <th>Data Fim</th>
            <th>Data Carga Radar</th>
            <th>Tamanho da base</th>
            <th>Formato da Base</th>
            <th>Anexo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let carga of cargas | async; let i = index;">
              <td>{{carga.dataExtracao | date:'shortDate'}}</td>
              <td>{{carga.dataInicio | date:'shortDate'}}</td>
              <td>{{carga.dataFim | date:'shortDate'}}</td>
              <td>{{carga.dataCargaRadar | date:'shortDate'}}</td>
              <td>{{carga.tamanhoBase}} {{carga.unidadeTamanho}}  {{carga.idAnexo}} </td>
              <td>{{carga.formatoBase}}</td>
              <td>
                <div *ngIf="carga.nomeAnexo">
                  {{carga.nomeAnexo}}
                  <a href="api\/anexo\/carga\/{{carga.idAnexo}}" target="_blank"><span class="glyphicon glyphicon-download" aria-hidden="true"></span></a>
                    <span class="glyphicon glyphicon-remove" aria-hidden="true" (click)="excluirAnexo(carga.idAnexo, carga.id)" style="cursor: pointer;"></span>
                </div>
                <div *ngIf="!carga.nomeAnexo">
                  <div *ngIf="idCarga === -1">
                  <button class="btn btn-sm btn-default" (click)="upload.click()" style="margin-top: 5px; margin-bottom: 5px;">
                    <span class="icon-upload" aria-hidden="true"></span>
                    Enviar arquivo
                  </button>
                  <input type="file" (change)="salvarAnexo($event, carga.id)" #upload style="display: none;">
                  </div>
                  <div *ngIf="progresso | async; let progresso;">
                    <div class="progress" *ngIf="progresso > 0 && idCarga === carga.id">
                      <div class="progress-bar" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"
                        [style.width]="progresso + '%'"
                        [class.progress-bar-success]="progresso === 100"
                        style="transition: width .1s ease">
                        {{ progresso < 100 ? progresso + '%' : '100% - aguardando finalização...'}}
                      </div>
                    </div>
                  </div>

                </div>
              </td>
              <td>
                <a (click)="editarCarga($event, carga)" class="clickable" data-toggle="tooltip" title="Editar">
                  <span class="glyphicon glyphicon-pencil" style="color:#FFC107"></span>
                </a>
                <a href="#" (click)="removerCarga($event, carga)" class="clickable" data-toggle="tooltip" title="Remover">
                  <span class="glyphicon glyphicon-remove" style="color:#FF1111"></span>
                </a>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
  `
})
export class ListaCargasComponent {
  public dtOptions: any = {};
  public cargas: Observable<CargaBaseDados[]>;
  private baseDadosID: number;
  public progresso = new BehaviorSubject(-1);
  public idCarga = -1;

  @ViewChild(DataTableDirective)
  private dtElement: DataTableDirective;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cargaState: CargaState,
    private toastrService: ToastrService
  ) {
    this.cargas = this.cargaState.cargas;
    this.baseDadosID = +this.activatedRoute.snapshot.paramMap.get('id');
    this.carregarTabela();
  }

  salvarAnexo(evento, idCarga: number) {

    const fileList: FileList = evento.target.files;
    const formData: FormData = new FormData();

    this.idCarga = idCarga;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      formData.append('file', file);

      if (file.size > 52428800) {
        this.toastrService.error('O tamanho máximo do anexo é de até 50MB.');
        return;
      }

      const req = new HttpRequest('POST', 'api/anexo/carga?cargaId=' + idCarga, formData, {
        reportProgress: true,
      });

      this.progresso.next(0);

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progresso.next(Math.round(100 * event.loaded / event.total));
        } else if (event instanceof HttpResponse) {
          this.progresso.next(-1);
          this.idCarga = -1;
          this.toastrService.success('Arquivo carregado com sucesso.');
          this.rerender();
        }
      });
    }
  }

  removerCarga(event, carga) {
    event.preventDefault();
    if (!confirm('Tem certeza que deseja apagar essa carga?')) {
      return;
    }
    this.http.delete('api/cargasBaseDados/' + carga.id)
      .subscribe((data: any) => {
        this.http.get('api/basesDados/atualizarUltimaDataExtracaoBD?baseDadosId=' + this.baseDadosID)
          .subscribe((dt: any) => {
            this.rerender();
          });
      });
  }

  editarCarga(event, carga) {
    event.preventDefault();
    this.cargaState.selecionarCarga(carga);
    this.router.navigate(['basesDados/' + this.baseDadosID + '/carga/editar']);
  }

  excluirAnexo(idAnexo: string, idCarga: number) {
    this.http.get('api/basesDados/removerAnexoCarga?cargaId=' + idCarga)
      .subscribe((dt: any) => {
        this.http.delete('api/anexos/' + idAnexo).subscribe(data => {
          this.rerender();
        });
      });
  }

  carregarTabela() {
    this.dtOptions = {
      pageLength: 10,
      language: {
        url: 'assets/Portuguese-Brasil.json'
      },
      serverSide: true,
      processing: true,
      bFilter: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.cargaState.carregarTabela(dataTablesParameters, (page) => {
          callback({
            recordsTotal: page.totalElements,
            recordsFiltered: page.totalElements,
            data: [],
          });
        }, this.baseDadosID);
      },
      order: [0, 'desc'],
      columns: [
        { width: '11%' },
        { width: '11%' },
        { width: '11%' },
        { width: '11%' },
        { width: '11%' },
        { width: '11%' },
        { width: '25%' },
        { width: '5%' },
      ],
      columnDefs: [{
        targets: [0, 1, 2, 3, 4, 5, 6, 7],
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
      dtInstance.ajax.reload(null, false);
    });
  }

}

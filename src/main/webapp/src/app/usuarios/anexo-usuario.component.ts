import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable ,  BehaviorSubject ,  Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Anexo, UsuarioConvenio } from '../domain';
import { UsuarioState } from './usuario-state';

@Component({
  selector: 'anexo-usuario',
  template: `
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-lg-3">
        <button class="btn btn-sm btn-default" (click)="upload.click()" style="margin-top: 5px; margin-bottom: 5px;">
          <span class="icon-upload" aria-hidden="true"></span>
          Enviar arquivo
        </button>
        <input type="file" (change)="salvarAnexo($event)" #upload style="display: none;">
        <div *ngIf="progresso | async; let progresso;">
          <div class="progress" *ngIf="progresso > 0">
            <div class="progress-bar" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"
              [style.width]="progresso + '%'"
              [class.progress-bar-success]="progresso === 100"
              style="transition: width .1s ease"
            >
              {{ progresso < 100 ? progresso + '%' : '100% - aguardando finalização...'}}
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-9">
        <table class="no-bottom-margin table table-striped table-hover table-condensed" *ngIf="(anexos | async).length > 0; else listaVazia">
          <tbody>
            <tr *ngFor="let anexo of anexos | async; let i = index;">
              <td>{{anexo.nomeArquivo}}</td>
              <td style="text-align: right;">
                <a href="api\/anexo\/usuarioConvenio\/{{anexo.id}}" target="_blank"><span class="glyphicon glyphicon-download" aria-hidden="true"></span></a>
                <span class="glyphicon glyphicon-remove" aria-hidden="true" (click)="excluirAnexo(anexo.id)" style="cursor: pointer;"></span>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #listaVazia>
          <div style="margin-top: 5px;">
            Esse usuário não possui arquivos. Clique no botão "Enviar arquivo" para adicionar um arquivo.
          </div>
        </ng-template>
      </div>
    </div>
  </div>
  `
})
export class AnexoUsuarioComponent implements OnInit, OnDestroy {

  public usuario: UsuarioConvenio;

  public usuarioSubscription: Subscription;

  public anexos: Observable<Anexo[]>;

  public progresso = new BehaviorSubject(-1);

  constructor(
    private http: HttpClient,
    private usuarioState: UsuarioState,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.usuarioSubscription = this.usuarioState.usuarioConvenio
      .subscribe((usuario) => {
        this.usuario = usuario;
        if (usuario) {
          this.getAnexosUsuario();
        }
      });
    this.anexos = this.usuarioState.anexosBehavior;
  }

  ngOnDestroy() {
    this.usuarioSubscription.unsubscribe();
  }

  excluirAnexo(idAnexo: number) {
    const url = 'api/anexos/' + idAnexo;
    this.http.delete(url).subscribe(data => {
      this.getAnexosUsuario();
    });
  }

  getAnexosUsuario() {
    this.usuarioState.getAnexosUsuario();
  }

  salvarAnexo(evento) {

    const fileList: FileList = evento.target.files;
    const formData: FormData = new FormData();

    if (fileList.length > 0) {
      const file: File = fileList[0];
      formData.append('file', file);

      if (file.size > 52428800) {
        this.toastrService.error('O tamanho máximo do anexo é de até 50MB.');
        return;
      }

      const req = new HttpRequest('POST', 'api/anexo/usuarioConvenio?usuarioId=' + this.usuario.id, formData, {
        reportProgress: true,
      });

      this.progresso.next(0);

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progresso.next(Math.round(100 * event.loaded / event.total));
        } else if (event instanceof HttpResponse) {
          this.progresso.next(-1);
          this.toastrService.success('Arquivo carregado com sucesso.');
          this.getAnexosUsuario();
        }
      });
    }
  }

}

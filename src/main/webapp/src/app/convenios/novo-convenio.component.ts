import { Component } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { ConvenioState } from './convenio-state';
import { Convenio } from '../domain';
import * as moment from 'moment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as util from '../util/util';

@Component({
  selector: 'novo-convenio',
  styles: [`
    .pad-left {
      margin-left: 2px;
    }
  `],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-2 col-lg-8">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Cadastrar Convênio</h3>
            </div>
            <div class="panel-body">
              <form class="form-horizontal">
                <div class="form-group">
                  <label for="sigla" class="col-sm-3 col-md-3 control-label">Sigla:</label>
                  <div class="col-sm-9 col-md-9">
                    <input type="text" class="form-control" id="sigla" name="sigla" [(ngModel)]="convenio.sigla" >
                  </div>
                </div>
                <div class="form-group">
                  <label for="descricao" class="col-sm-3 col-md-3 control-label">Descrição:</label>
                  <div class="col-sm-9 col-md-9">
                    <input type="text" class="form-control" id="descricao" name="descricao" [(ngModel)]="convenio.descricao">
                  </div>
                </div>
                <div class="form-group">
                  <label for="orgaoVinculo" class="col-sm-3 col-md-3 control-label">Órgão do Vínculo:</label>
                  <div class="col-sm-9 col-md-9">
                    <input type="text" class="form-control" id="orgaoVinculo" name="orgaoVinculo"[(ngModel)]="convenio.orgaoVinculo">
                  </div>
                </div>
                <div class="form-group">
                  <label for="dataInicioVigencia" class="col-sm-3 col-md-3 control-label">Início da vigência:</label>
                  <div class="col-sm-6 col-md-5 col-lg-5">
                    <div class="input-group">
                      <input class="form-control" style="float:none" ngx-mydatepicker name="dataInicioVigencia"
                        [(ngModel)]="dataInicioVigencia" [options]="myOptions" #dpInicio="ngx-mydatepicker" />
                      <span class="input-group-btn">
                        <button type="button" class="btn btn-default" (click)="dpInicio.clearDate()">
                          <i class="glyphicon glyphicon-remove"></i>
                        </button>
                        <button type="button" class="btn btn-default" (click)="dpInicio.toggleCalendar()">
                          <i class="glyphicon glyphicon-calendar"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="dataFimVigencia" class="col-sm-3 col-md-3 control-label">Fim da vigência:</label>
                  <div class="col-sm-6 col-md-5 col-lg-5">
                    <div class="input-group">
                      <input class="form-control" style="float:none" ngx-mydatepicker name="datafimVigencia"
                        [(ngModel)]="dataFimVigencia" [options]="myOptions" #dpFim="ngx-mydatepicker" />
                      <span class="input-group-btn">
                        <button type="button" class="btn btn-default" (click)="dpFim.clearDate()">
                          <i class="glyphicon glyphicon-remove"></i>
                        </button>
                        <button type="button" class="btn btn-default" (click)="dpFim.toggleCalendar()">
                          <i class="glyphicon glyphicon-calendar"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="contato" class="col-sm-3 col-md-3 control-label">Contatos:</label>
                  <div class="col-sm-9 col-md-9">
                    <textarea class="form-control" id="contatos" name="contatos" [(ngModel)]="convenio.contatos"></textarea>
                  </div>
                </div>
                <div class="form-group">
                  <label for="resumo" class="col-sm-3 col-md-3 control-label">Resumo:</label>
                  <div class="col-sm-9 col-md-9">
                    <textarea class="form-control" id="resumo" name="resumo" [(ngModel)]="convenio.resumo"></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div class="panel-footer clearfix">
              <button class="btn btn-primary pull-right pad-left" type="button" (click)="onAdicionar()">Salvar</button>
              <button class="btn btn-default pull-right" type="button" (click)="onCancelar()">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NovoConvenioComponent {

  public myOptions = util.ngxMyOptions;

  public convenio: Convenio;

  public dataInicioVigencia: any;

  public dataFimVigencia: any;


  constructor(private http: HttpClient, private router: Router) {
    this.convenio = new Convenio();
  }
  onAdicionar() {
    if (!this.convenio.sigla || this.convenio.sigla.length < 1) {
      alert('Informe a sigla do convênio!');
      return;
    }
    if (this.dataInicioVigencia) {
      this.convenio.dataInicioVigencia = new Date(this.dataInicioVigencia.jsdate);
    }
    if (this.dataFimVigencia) {
      this.convenio.dataFimVigencia = new Date(this.dataFimVigencia.jsdate);
    }
    const url = 'api/convenios';
    this.http.post(url, this.convenio).subscribe(
      (data) => {
        this.router.navigate(['convenios']);
      },
      (err: HttpErrorResponse) => {
        alert(err);
      }
    );
  }

  onCancelar() {
    this.router.navigate(['convenios']);
  }

}

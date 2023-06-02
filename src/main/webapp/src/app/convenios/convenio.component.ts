import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Observable ,  Subscription ,  BehaviorSubject } from 'rxjs';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { ConvenioState } from './convenio-state';
import { Convenio } from '../domain';
import * as moment from 'moment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import * as util from '../util/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConvenioService } from './convenio.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'convenio',
  template: `
  <div *ngIf="convenio | async; let convenio;">

    <form [formGroup]="form" class="form-horizontal hide-input-disabled" (ngSubmit)="salvar()">

      <div class="row panel-line form-group-sm">
        <div class="col-sm-4 col-md-3" [class.invalid]="form.controls.sigla.touched && !form.controls.sigla.valid">
          <div class="field-label required">
            Sigla
          </div>
          <div class="field-content">
            <input type="text"
                   #sigla
                   formControlName="sigla"
                   [(ngModel)]="convenio.sigla"
                   [readonly]="!(editando | async)"
                   class="form-control" autofocus="true">
            <div *ngIf="form.controls.sigla.touched && form.controls.sigla.invalid" class="alert-danger">
              <span *ngIf="form.controls.sigla.errors.required">A sigla é obrigatória</span>
              <span *ngIf="form.controls.sigla.errors.maxlength">A sigla deve conter no máximo 20 caracteres.</span>
            </div>
          </div>
        </div>
        <div class="col-sm-5 col-md-6" [class.invalid]="form.controls.descricao.touched && !form.controls.descricao.valid">
          <div class="field-label required">
            Descrição
          </div>
          <div class="field-content">
            <input type="text" formControlName="descricao" [(ngModel)]="convenio.descricao" [readonly]="!(editando | async)" class="form-control">
            <div *ngIf="form.controls.descricao.touched && form.controls.descricao.invalid" class="alert-danger">
              <span *ngIf="form.controls.descricao.errors.required">A descrição é obrigatória</span>
              <span *ngIf="form.controls.descricao.errors.maxlength">A descrição deve conter no máximo 80 caracteres.</span>
            </div>
          </div>
        </div>

        <div class="col-sm-3 col-md-3" [class.invalid]="form.controls.numeroProcedimento.touched && !form.controls.numeroProcedimento.valid">
          <div class="field-label">
            Número do procedimento
          </div>
          <div class="field-content">
            <input type="text" formControlName="numeroProcedimento" [(ngModel)]="convenio.numeroProcedimento"
            [readonly]="!(editando | async)" class="form-control" onKeyPress="if(this.value.length>22) return false;">
            <div *ngIf="form.controls.numeroProcedimento.touched && form.controls.numeroProcedimento.invalid" class="alert-danger">
              <span *ngIf="form.controls.numeroProcedimento.errors.maxlength">O número do procedimento deve conter no máximo 23 caracteres.</span>
            </div>
          </div>
        </div>

      </div>

      <div class="row panel-line form-group-sm">
        <div class="col-sm-5 col-md-6" [class.invalid]="form.controls.orgaoVinculo.touched && !form.controls.orgaoVinculo.valid">
          <div class="field-label">
            Órgão do vínculo
          </div>
          <div class="field-content">
            <input type="text" formControlName="orgaoVinculo" [(ngModel)]="convenio.orgaoVinculo" [readonly]="!(editando | async)" class="form-control">
            <div *ngIf="form.controls.orgaoVinculo.touched && form.controls.orgaoVinculo.invalid" class="alert-danger">
              <span *ngIf="form.controls.orgaoVinculo.errors.required">O órgão do vínculo é obrigatório</span>
              <span *ngIf="form.controls.orgaoVinculo.errors.maxlength">O órgão do vínculo deve conter no máximo 80 caracteres.</span>
            </div>

          </div>
        </div>

        <div class="col-sm-3 col-md-3">
          <div class="field-label">
            Início da vigência
          </div>
          <div class="field-content">
            <div class="input-group input-group-sm">
              <input ngx-mydatepicker formControlName="dataInicioVigencia"
                [(ngModel)]="dataInicioVigencia" [options]="myOptions" #dpInicio="ngx-mydatepicker" [readonly]="!(editando | async)"
                (dateChanged)="onDataInicioChanged($event)" class="form-control" style="float:none" />
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" (click)="dpInicio.clearDate()" [disabled]="!(editando | async)">
                  <i class="glyphicon glyphicon-remove"></i>
                </button>
                <button type="button" class="btn btn-default" (click)="dpInicio.toggleCalendar()" [disabled]="!(editando | async)">
                  <i class="glyphicon glyphicon-calendar"></i>
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="col-sm-3 col-md-3">
          <div class="field-label">Fim da vigência</div>
          <div class="field-content">
            <div class="input-group input-group-sm">
              <input ngx-mydatepicker formControlName="dataFimVigencia"
                [(ngModel)]="dataFimVigencia" [options]="myOptions" #dpFim="ngx-mydatepicker" [readonly]="!(editando | async)"
                (dateChanged)="onDataFimChanged($event)"
                class="form-control" style="float:none"
              />
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" (click)="dpFim.clearDate()" [disabled]="!(editando | async)">
                  <i class="glyphicon glyphicon-remove"></i>
                </button>
                <button type="button" class="btn btn-default" (click)="dpFim.toggleCalendar()" [disabled]="!(editando | async)">
                  <i class="glyphicon glyphicon-calendar"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="row panel-line">
        <div class="col-md-6">
          <div class="field-label">
            Contatos
          </div>
          <div class="field-content">
            <textarea formControlName="contatos" [(ngModel)]="convenio.contatos" [readonly]="!(editando | async)" class="form-control"></textarea>
          </div>
        </div>

        <div class="col-md-6">
          <div class="field-label">
            Resumo
          </div>
          <div class="field-content">
            <textarea formControlName="resumo" [(ngModel)]="convenio.resumo" [readonly]="!(editando | async)" class="form-control"></textarea>
          </div>
        </div>
      </div>

      <div class="row panel-line">
        <div class="col-md-6">
          <div class="field-label">
            Anotações
          </div>
          <div class="field-content">
            <textarea formControlName="anotacao" [(ngModel)]="convenio.anotacao" [readonly]="!(editando | async)" class="form-control"></textarea>
          </div>
        </div>
      </div>

      <div class="row" *ngIf="(editando | async)">
        <div class="panel-footer clearfix">
          <div class="pull-right">
            <button class="btn btn-sm btn-primary" type="submit" [disabled]="!form.valid">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
              Salvar
            </button>
            <button class="btn btn-sm btn-default" type="button" (click)="cancelar()">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              Cancelar
            </button>
          </div>
        </div>
      </div>

    </form>

  </div>
  <ng-template #noSelection>Nenhum convênio selecionado.</ng-template>
  `
})
export class ConvenioComponent implements OnDestroy, AfterViewInit {

  public myOptions = util.ngxMyOptions;

  public convenio: BehaviorSubject<Convenio>;

  public convenioSubscription: Subscription;

  public dataInicioVigencia: any = '';

  public dataFimVigencia: any = '';

  public editando: Observable<boolean>;

  public form: FormGroup;

  @ViewChild('sigla') inputSigla: ElementRef;

  constructor(
    private convenioState: ConvenioState,
    private convenioService: ConvenioService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private router: Router,
    formBuilder: FormBuilder,
    private location: Location
  ) {
    this.convenio = this.convenioState.convenio;
    this.editando = this.convenioState.editando;
    this.convenioSubscription = this.convenio.subscribe((convenio) => {
      if (!convenio) {
        return;
      }

      this.dataInicioVigencia = convenio.dataInicioVigencia ? { jsdate: moment(convenio.dataInicioVigencia).toDate() } : null;
      this.dataFimVigencia = convenio.dataFimVigencia ? { jsdate: moment(convenio.dataFimVigencia).toDate() } : null;
    });

    this.form = formBuilder.group({
      sigla: ['', [
        Validators.required,
        Validators.maxLength(20),
      ]],
      descricao: ['', [
        Validators.required,
        Validators.maxLength(80),
      ]],
      orgaoVinculo: ['', [
        Validators.maxLength(90),
      ]],
      numeroProcedimento: ['', Validators.maxLength(23)],
      dataInicioVigencia: [],
      dataFimVigencia: [],
      contatos: ['', [
        Validators.maxLength(500),
      ]],
      resumo: ['', [
        Validators.maxLength(4000),
      ]],
      anotacao: ['', [
        Validators.maxLength(4000),
      ]]
    });
  }

  ngAfterViewInit() {
    // inputSigla é undefined se o input não estiver sendo exibido
    // Ele não é exibido enquanto convenio for nulo:
    //   <div *ngIf="convenio | async; let convenio;">
    if (this.inputSigla) {
      this.inputSigla.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.convenioSubscription.unsubscribe();
  }

  salvar() {
    const convenio = this.convenio.value;

    if (this.dataInicioVigencia) {
      convenio.dataInicioVigencia = new Date(this.dataInicioVigencia.jsdate);
    }
    if (this.dataFimVigencia) {
      convenio.dataFimVigencia = new Date(this.dataFimVigencia.jsdate);
    }

    this.convenioService.save(convenio).subscribe(
      (data: any) => {
        this.toastrService.success('Convênio salvo com sucesso!'),
        this.convenioState.selecionarConvenio(data);
        this.router.navigate(['convenios/' + data.id]);
      },
      (err: HttpErrorResponse) => {
        this.toastrService.success('Erro: ' + err.error);
      }
    );
  }

  onDataInicioChanged(event: IMyDateModel) {
    this.convenio.getValue().dataInicioVigencia = moment(event.jsdate).toISOString();
  }

  onDataFimChanged(event: IMyDateModel) {
    this.convenio.getValue().dataFimVigencia = moment(event.jsdate).toISOString();
  }

  cancelar() {
    this.convenioState.onCancelarEdicaoConvenio();
    this.location.back();
  }
}

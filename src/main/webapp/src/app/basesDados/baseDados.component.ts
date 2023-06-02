import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Observable ,  Subscription ,  BehaviorSubject } from 'rxjs';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { BaseDadosState } from './baseDados-state';
import { Convenio, BaseDados } from '../domain';
import * as moment from 'moment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import * as util from '../util/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseDadosService } from './baseDados.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'baseDados',
  template: `
  <div *ngIf="baseDados | async; let baseDados;">

    <form [formGroup]="form" class="form-horizontal hide-input-disabled" (ngSubmit)="salvar()">

      <div class="row panel-line form-group-sm">
        <div class="col-sm-4 col-md-4" [class.invalid]="form.controls.nomeBase.touched && !form.controls.nomeBase.valid">
          <div class="field-label">
            Nome da Base
          </div>
          <div class="field-content">
            <input type="text" formControlName="nomeBase" [(ngModel)]="baseDados.nomeBase" [readonly]="!(editando | async)" class="form-control">
            <div *ngIf="form.controls.nomeBase.touched && form.controls.nomeBase.invalid" class="alert-danger">
              <span *ngIf="form.controls.nomeBase.errors.required">O nome da base é obrigatório</span>
              <span *ngIf="form.controls.nomeBase.errors.maxlength">O órgão de origem deve conter no máximo 180 caracteres.</span>
            </div>
          </div>
        </div>

        <div class="col-sm-5 col-md-5" [class.invalid]="form.controls.orgaoOrigem.touched && !form.controls.orgaoOrigem.valid">
          <div class="field-label">
            Órgão do vínculo
          </div>
          <div class="field-content">
            <input type="text" formControlName="orgaoOrigem" [(ngModel)]="baseDados.orgaoOrigem" [readonly]="!(editando | async)" class="form-control">
            <div *ngIf="form.controls.orgaoOrigem.touched && form.controls.orgaoOrigem.invalid" class="alert-danger">
              <span *ngIf="form.controls.orgaoOrigem.errors.required">O órgão de origem é obrigatório</span>
              <span *ngIf="form.controls.orgaoOrigem.errors.maxlength">O órgão de origem deve conter no máximo 90 caracteres.</span>
            </div>
          </div>
        </div>

        <div class="col-sm-3 col-md-3" [class.invalid]="form.controls.numeroProcedimento.touched && !form.controls.numeroProcedimento.valid">
          <div class="field-label">
            Número do procedimento
          </div>
          <div class="field-content">
            <input type="text" formControlName="numeroProcedimento" [(ngModel)]="baseDados.numeroProcedimento"
            [readonly]="!(editando | async)" class="form-control" onKeyPress="if(this.value.length>22) return false;">
            <div *ngIf="form.controls.numeroProcedimento.touched && form.controls.numeroProcedimento.invalid" class="alert-danger">
              <span *ngIf="form.controls.numeroProcedimento.errors.maxlength">O número do procedimento deve conter no máximo 23 caracteres.</span>
            </div>
          </div>
        </div>

      </div>

      <div class="row panel-line">

        <div class="col-sm-2 col-md-2">
          <div class="field-label">
            Periodicidade
          </div>
          <div class="field-content">
            <span *ngIf="!(editando | async)">
              <input type="text" formControlName="periodicidade" [readonly]="true" value="{{baseDados.periodicidade}}" class="form-control">
            </span>
            <span *ngIf="(editando | async)">
              <select [(ngModel)]="baseDados.periodicidade" class="form-control" formControlName="periodicidade">
                <option *ngFor="let p of periodicidades" [ngValue]="p.valor">{{p.texto}}</option>
              </select>
            </span>
          </div>
        </div>

        <div class="col-sm-2 col-md-2">
          <div class="field-label">
            Fonte de Obtenção
          </div>
          <div class="field-content">
            <span *ngIf="!(editando | async)">
              <input type="text" formControlName="fonteObtencao" [readonly]="true" value="{{baseDados.fonteObtencao}}" class="form-control">
            </span>
            <span *ngIf="(editando | async)">
              <select [(ngModel)]="baseDados.fonteObtencao" class="form-control" formControlName="fonteObtencao">
                <option *ngFor="let f of fontesObtencao" [ngValue]="f.valor">{{f.texto}}</option>
              </select>
            </span>
          </div>
        </div>
      </div>

      <div class="row panel-line">
        <div class="col-md-6">
          <div class="field-label">
            Contatos
          </div>
          <div class="field-content">
            <textarea formControlName="contatos" [(ngModel)]="baseDados.contatos" [readonly]="!(editando | async)" class="form-control"></textarea>
          </div>
        </div>

        <div class="col-md-6">
          <div class="field-label">
            Resumo
          </div>
          <div class="field-content">
            <textarea formControlName="resumo" [(ngModel)]="baseDados.resumo" [readonly]="!(editando | async)" class="form-control"></textarea>
          </div>
        </div>
      </div>

      <div class="row panel-line">
        <div class="col-md-6">
          <div class="field-label">
            Anotações
          </div>
          <div class="field-content">
            <textarea formControlName="anotacao" [(ngModel)]="baseDados.anotacao" [readonly]="!(editando | async)" class="form-control"></textarea>
          </div>
        </div>
      </div>

      <div class="row panel-line">
        <div class="col-md-4">
          <div class="field-label">
            Avisar Vencimento
          </div>
          <p class="field-content">
            <input type="checkbox" formControlName="avisoVencimento" [(ngModel)]="baseDados.avisoVencimento" (click)="isEditando()"/>
          </p>
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
  <ng-template #noSelection>Nenhuma Base de Dados selecionado.</ng-template>
  `
})
export class BaseDadosComponent implements OnDestroy, AfterViewInit {

  public periodicidades = [
    { texto: 'Mensal', valor: 'MENSAL' },
    { texto: 'Bimestral', valor: 'BIMESTRAL' },
    { texto: 'Trimestral', valor: 'TRIMESTRAL' },
    { texto: 'Semestral', valor: 'SEMESTRAL' },
    { texto: 'Anual', valor: 'ANUAL' },
    { texto: 'Não Atualizável', valor: 'NAO_ATUALIZAVEL' }
  ];

  public fontesObtencao = [
    { texto: 'Convênio', valor: 'CONVENIO' },
    { texto: 'Requisição Direta', valor: 'REQUISICAO_DIRETA' },
    { texto: 'Dados Transparência', valor: 'DADOS_TRANSPARENCIA' }
  ];

  public unidadesTamanho = [
    { texto: 'KB', valor: 'KB' },
    { texto: 'MB', valor: 'MB' },
    { texto: 'GB', valor: 'GB' }
  ];

  public myOptions = util.ngxMyOptions;

  public baseDados: BehaviorSubject<BaseDados>;

  public baseDadosSubscription: Subscription;

  public editando: Observable<boolean>;

  public form: FormGroup;

  @ViewChild('sigla') inputSigla: ElementRef;

  constructor(
    private baseDadosState: BaseDadosState,
    private baseDadosService: BaseDadosService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private router: Router,
    formBuilder: FormBuilder,
    private location: Location
  ) {
    this.baseDados = this.baseDadosState.baseDados;
    this.editando = this.baseDadosState.editando;
    this.baseDadosSubscription = this.baseDados.subscribe((baseDados) => {
      if (!baseDados) {
        return;
      }
    });

    this.form = formBuilder.group({
      orgaoOrigem: ['', [
        Validators.required,
        Validators.maxLength(90),
      ]],
      nomeBase: ['', [
        Validators.required,
        Validators.maxLength(180),
      ]],
      numeroProcedimento: ['', Validators.maxLength(23)],
      periodicidade: [],
      fonteObtencao: [],
      avisoVencimento: [],
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
    this.baseDadosSubscription.unsubscribe();
  }

  salvar() {
    const baseDados = this.baseDados.value;

    this.baseDadosService.save(baseDados).subscribe(
      (data: any) => {
        this.toastrService.success('Base de Dados salva com sucesso!'),
          this.baseDadosState.selecionarBaseDados(data);
        this.router.navigate(['basesDados/' + data.id]);
      },
      (err: HttpErrorResponse) => {
        this.toastrService.success('Erro ao gravar Base de Dados!');
      }
    );
  }

  cancelar() {
    this.baseDadosState.onCancelarEdicaoBaseDados();
    this.location.back();
  }

  isEditando(): boolean {
    return this.baseDadosState.editando.value;
  }
}

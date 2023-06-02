import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { IMyDateModel } from 'ngx-mydatepicker';
import { CargaBaseDados, BaseDados } from '../domain';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as util from '../util/util';
import * as moment from 'moment';
import { CargaBaseDadosService } from './cargaBaseDados.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CargaState } from './carga-state';

@Component({
  selector: 'carga',
  template: `
  <div class="container-fluid">

    <form [formGroup]="form" class="form-horizontal hide-input-disabled" (ngSubmit)="salvar()">

      <div class="row panel-line">

      <div class="col-sm-2 col-md-2">
          <div class="field-label">
            Início do período
          </div>
          <div class="field-content">
            <div class="input-group input-group-sm">
              <input ngx-mydatepicker formControlName="dataInicio"
                [(ngModel)]="dataInicio" [options]="myOptions" #dpInicio="ngx-mydatepicker"
                class="form-control" style="float:none" >
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

        <div class="col-sm-2 col-md-2">
          <div class="field-label">
            Fim período
          </div>
          <div class="field-content">
            <div class="input-group input-group-sm">
              <input ngx-mydatepicker formControlName="dataFim"
                [(ngModel)]="dataFim" [options]="myOptions" #dpFim="ngx-mydatepicker"
                class="form-control" style="float:none" >
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

        <div class="col-sm-2 col-md-2">
          <div class="field-label">
            Data da Extração
          </div>
          <div class="field-content">
            <div class="input-group input-group-sm">
              <input ngx-mydatepicker formControlName="dataExtracao"
                [(ngModel)]="dataExtracao" [options]="myOptions" #dpExtracao="ngx-mydatepicker"
                class="form-control" style="float:none">
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" (click)="dpExtracao.clearDate()">
                  <i class="glyphicon glyphicon-remove"></i>
                </button>
                <button type="button" class="btn btn-default" (click)="dpExtracao.toggleCalendar()">
                  <i class="glyphicon glyphicon-calendar"></i>
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="col-sm-2 col-md-2">
          <div class="field-label">
            Data Carga Radar
          </div>
          <div class="field-content">
            <div class="input-group input-group-sm">
              <input ngx-mydatepicker formControlName="dataCargaRadar"
                [(ngModel)]="dataCargaRadar" [options]="myOptions" #dpCargaRadar="ngx-mydatepicker"
                class="form-control" style="float:none">
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" (click)="dpCargaRadar.clearDate()">
                  <i class="glyphicon glyphicon-remove"></i>
                </button>
                <button type="button" class="btn btn-default" (click)="dpCargaRadar.toggleCalendar()">
                  <i class="glyphicon glyphicon-calendar"></i>
                </button>
              </span>
            </div>
          </div>
        </div>

      </div>

      <div class="row panel-line">
      <div class="col-sm-2 col-md-2">
          <div class="field-label">
            Tamanho da Base
          </div>
          <div class="field-content">
            <span>
              <div class="input-group input-group-sm">
                <input type="number" formControlName="tamanhoBase" [(ngModel)]="carga.tamanhoBase" class="form-control" />
                <span class="input-group-addon">
                  <select formControlName="unidadeTamanho" [(ngModel)]="carga.unidadeTamanho">
                    <option *ngFor="let ut of unidadesTamanho" [ngValue]="ut.valor">{{ut.texto}}</option>
                  </select>
                </span>
              </div>
            </span>
          </div>
        </div>

        <div class="col-md-2">
          <div class="field-label">
            Formato da base
          </div>
          <div class="field-content">
            <input type="text" formControlName="formatoBase" [(ngModel)]="carga.formatoBase" class="form-control" />
          </div>
        </div>

      <div class="col-md-6">
          <div class="field-label">
            Anotações
          </div>
          <div class="field-content">
            <textarea formControlName="anotacao" [(ngModel)]="this.carga.anotacao" class="form-control"></textarea>
          </div>
        </div>
      </div>

      <div class="row panel-line">
        <div class="col-md-6">
          <div class="field-label">
            Layout do arquivo
          </div>
          <div class="field-content">
            <textarea rows="20" formControlName="layoutArquivo" [(ngModel)]="this.carga.layoutArquivo" class="form-control"></textarea>
          </div>
          <div *ngIf="form.controls.layoutArquivo.touched && form.controls.layoutArquivo.invalid" class="alert-danger">
              <span *ngIf="form.controls.layoutArquivo.errors.maxlength">O layout deve conter no máximo 4000 caracteres.</span>
          </div>
        </div>
      </div>

      <div class="row">
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
  `
})
export class CargaComponent implements OnInit, OnDestroy {

  public unidadesTamanho = [
    { texto: 'KB', valor: 'KB' },
    { texto: 'MB', valor: 'MB' },
    { texto: 'GB', valor: 'GB' }
  ];

  public myOptions = util.ngxMyOptions;

  public carga: CargaBaseDados;

  public dataInicio: any = '';
  public dataFim: any = '';
  public dataExtracao: any = '';
  public dataCargaRadar: any = '';

  public form: FormGroup;

  private baseDadosID: string;

  constructor(
    formBuilder: FormBuilder,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private cargaBaseDadosService: CargaBaseDadosService,
    private toastrService: ToastrService,
    private router: Router,
    private cargaState: CargaState,
    private http: HttpClient

  ) {
    this.form = formBuilder.group({
      dataInicio: ['', [Validators.required]],
      dataFim: ['', [Validators.required]],
      dataExtracao: ['', [Validators.required]],
      dataCargaRadar: [],
      tamanhoBase: [],
      unidadeTamanho: [],
      formatoBase: [],
      anotacao: ['', [
        Validators.maxLength(4000),
      ]],
      layoutArquivo: ['', [
        Validators.maxLength(4000),
      ]]
    });
  }

  ngOnInit() {
    this.baseDadosID = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.cargaState.carga.getValue() != null) {
      this.carga = this.cargaState.carga.getValue();
      this.dataInicio = this.carga.dataInicio ? { jsdate: moment(this.carga.dataInicio).toDate() } : null;
      this.dataFim = this.carga.dataFim ? { jsdate: moment(this.carga.dataFim).toDate() } : null;
      this.dataExtracao = this.carga.dataExtracao ? { jsdate: moment(this.carga.dataExtracao).toDate() } : null;
      this.dataCargaRadar = this.carga.dataCargaRadar ? { jsdate: moment(this.carga.dataCargaRadar).toDate() } : null;
      return;
    }
    this.carga = new CargaBaseDados();
  }

  ngOnDestroy() {
    this.cargaState.selecionarCarga(null);
  }

  salvar() {
    if (this.dataInicio) {
      this.carga.dataInicio = new Date(this.dataInicio.jsdate);
    }
    if (this.dataFim) {
      this.carga.dataFim = new Date(this.dataFim.jsdate);
    }
    if (this.dataExtracao) {
      this.carga.dataExtracao = new Date(this.dataExtracao.jsdate);
    }

    if (this.dataCargaRadar) {
      this.carga.dataCargaRadar = new Date(this.dataCargaRadar.jsdate);
    }

    this.carga.baseDados = '/api/baseDados/' + this.baseDadosID;

    this.cargaBaseDadosService.save(this.carga).subscribe(
      (data: any) => {
        this.http.get('api/basesDados/atualizarUltimaDataExtracaoBD?baseDadosId=' + this.baseDadosID)
          .subscribe((dt: any) => {
            this.toastrService.success('Carga salva com sucesso!');
            this.router.navigate(['basesDados/' + this.baseDadosID]);
          },
            (err: HttpErrorResponse) => {
              this.toastrService.success('Erro ao gravar carga!');
            }
          );
      }
    );
  }

  cancelar() {
    this.router.navigate(['basesDados/' + this.baseDadosID]);
  }

}

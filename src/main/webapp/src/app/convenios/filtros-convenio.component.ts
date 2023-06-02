import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router/';
import { ConvenioState } from './convenio-state';
import { Convenio, FiltrosConvenios } from '../domain';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'filtros-convenio',
  styles: [`
    .pad-left {
      margin-left: 2px;
    }
  `],
  template: `
    <div class="row row-filtros">
        <div class="col-sm-6">
            <div class="form-inline">
              <div class="form-group">
                <label>Sigla</label>
                <input type="text" #inputSigla [(ngModel)]="filtroSigla" tabindex="1" class="form-control input-sm">
              </div>

              <div class="form-group">
                <label>Nome</label>
                <input type="text" #inputNome [(ngModel)]="filtroNome" tabindex="2" class="form-control input-sm">
              </div>

              <div class="form-group">
                <label class="sr-only" for="Sigla">Sigla</label>
                <div class="input-group input-group-sm">
                  <div class="input-group-addon">Vencimento</div>
                  <select #selectVencimento [(ngModel)]="filtroVencimento" tabindex="3" class="form-control">
                    <option value='-1'>Qualquer data</option>
                    <option value="0">Já vencidos</option>
                    <option value="30">Até 30 dias</option>
                    <option value="60">Até 60 dias</option>
                    <option value="90">Até 90 dias</option>
                    <option value="180">Até 180 dias</option>
                  </select>
                </div>
              </div>
            </div>
        </div>

        <div class="col-sm-6">
          <ul class="list-inline pull-right">
            <li>
              <a href="#" [routerLink]="['novo']" class="btn btn-primary btn-sm btn-adicionar-convenios">
                <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Adicionar convênio
              </a>
            </li>
            <li>
              <a target="_blank" href="#" [routerLink]="['impressao']" [queryParams]="{filtroSigla: filtroSigla, filtroNome: filtroNome, filtroVencimento: filtroVencimento, totalRegistros: convenioStatePublic.totalRegistros.value}" class="btn btn-default btn-sm btn-adicionar-convenios">
                <span class="glyphicon glyphicon-print" aria-hidden="true"></span> Imprimir
              </a>
            </li>
          </ul>
        </div>
    </div>
  `
})
export class FiltrosConvenioComponent implements OnInit {

  @ViewChild('inputSigla')
  inputSigla: ElementRef;

  filtroSigla = '';

  @ViewChild('inputNome')
  inputNome: ElementRef;

  filtroNome = '';

  @ViewChild('selectVencimento')
  selectVencimento: ElementRef;

  filtroVencimento = -1;

  delay = 800;

  convenioStatePublic: ConvenioState;

  path: string;

  constructor(
    public convenioState: ConvenioState,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.convenioStatePublic = convenioState;

    this.filtroSigla = this.activatedRoute.snapshot.queryParamMap.get('filtroSigla');
    if (!this.filtroSigla) {
      this.filtroSigla = '';
    }
    this.convenioState.filtroSigla.next(this.filtroSigla);

    this.filtroNome = this.activatedRoute.snapshot.queryParamMap.get('filtroNome');
    if (!this.filtroNome) {
      this.filtroNome = '';
    }
    this.convenioState.filtroNome.next(this.filtroNome);

    this.filtroVencimento = +this.activatedRoute.snapshot.queryParamMap.get('filtroVencimento');
    if (!this.filtroVencimento || (this.filtroVencimento !== -1 && this.filtroVencimento !== 0
      && this.filtroVencimento !== 30 && this.filtroVencimento !== 60
      && this.filtroVencimento !== 90 && this.filtroVencimento !== 180)) {
      this.filtroVencimento = -1;
    }
    this.convenioState.filtroDiasAteVencimento.next(this.filtroVencimento);
  }

  ngOnInit(): void {

    fromEvent(this.inputSigla.nativeElement, 'keyup')
      .pipe(
        debounceTime(this.delay)
      )
      .subscribe(value => this.atualizar('inputSigla'));

    fromEvent(this.inputNome.nativeElement, 'keyup')
      .pipe(
        debounceTime(this.delay)
      )
      .subscribe(value => this.atualizar('inputNome'));

    fromEvent(this.selectVencimento.nativeElement, 'change')
      .pipe(
        debounceTime(this.delay)
      )
      .subscribe(value => this.atualizar('selectVencimento'));

  }

  atualizar(elemento: String) {
    this.path = this.location.path();
    const idx = this.path.indexOf('?');
    if (idx > 0) {
      this.path = this.path.slice(0, idx);
    }
    this.path = this.path + '?';

    if (elemento === 'inputSigla') {
      this.path = this.path + '&filtroSigla=';
      if (this.filtroSigla && this.filtroSigla.length > 0) {
        this.path = this.path + this.filtroSigla;
        this.convenioState.filtroSigla.next(this.filtroSigla);
      } else {
        this.convenioState.filtroSigla.next('');
      }
    }

    if (elemento === 'inputNome') {
      this.path = this.path + '&filtroNome=';
      if (this.filtroNome && this.filtroNome.length > 0) {
        this.path = this.path + this.filtroNome;
        this.convenioState.filtroNome.next(this.filtroNome);
      } else {
        this.convenioState.filtroNome.next('');
      }
    }

    if (elemento === 'selectVencimento') {
      this.path = this.path + '&filtroVencimento=';
      if (this.filtroVencimento) {
        this.path = this.path + this.filtroVencimento;
        this.convenioState.filtroDiasAteVencimento.next(this.filtroVencimento);
      } else {
        this.convenioState.filtroDiasAteVencimento.next(-1);
      }
    }

    this.location.go(this.path);
  }


}

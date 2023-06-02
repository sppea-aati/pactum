import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseDadosState } from './baseDados-state';
import { Location } from '@angular/common';

@Component({
  selector: 'filtros-baseDados',
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
                <label>Nome Base</label>
                <input type="text" #inputNomeBase [(ngModel)]="filtroNomeBase" tabindex="1" class="form-control input-sm">
              </div>
              <div class="form-group">
                <label>Órgão Origem</label>
                <input type="text" #inputOrgaoOrigem [(ngModel)]="filtroOrgaoOrigem" tabindex="1" class="form-control input-sm">
              </div>

            </div>
        </div>

        <div class="col-sm-6">
          <ul class="list-inline pull-right">
            <li>
              <a href="#" [routerLink]="['novo']" class="btn btn-primary btn-sm btn-adicionar-convenios">
                <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Adicionar Base de Dados
              </a>
            </li>
            <li>
              <a target="_blank" href="#" [routerLink]="['impressao']" [queryParams]="{filtroNomeBase: filtroNomeBase, filtroOrgaoOrigem: filtroOrgaoOrigem, totalRegistros: baseDadosStatePublic.totalRegistros.value}" class="btn btn-default btn-sm btn-adicionar-convenios">
                <span class="glyphicon glyphicon-print" aria-hidden="true"></span> Imprimir
              </a>
            </li>
          </ul>
        </div>
    </div>
  `
})
export class FiltrosBaseDadosComponent implements OnInit {

  @ViewChild('inputOrgaoOrigem')
  inputOrgaoOrigem: ElementRef;

  @ViewChild('inputNomeBase')
  inputNomeBase: ElementRef;

  public filtroOrgaoOrigem: string;
  public filtroNomeBase: string;

  delay = 800;

  baseDadosStatePublic: BaseDadosState;

  path: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private baseDadosState: BaseDadosState
  ) {
    this.baseDadosStatePublic = this.baseDadosState;
    this.filtroOrgaoOrigem = this.activatedRoute.snapshot.queryParamMap.get('orgaoOrigem');
    this.filtroNomeBase = this.activatedRoute.snapshot.queryParamMap.get('nomeBase');

    if (!this.filtroOrgaoOrigem) {
      this.filtroOrgaoOrigem = '';
    }

    if (!this.filtroNomeBase) {
      this.filtroNomeBase = '';
    }

    this.baseDadosState.filtroOrgaoOrigem.next(this.filtroOrgaoOrigem);
    this.baseDadosState.filtroNomeBase.next(this.filtroNomeBase);
  }

  ngOnInit(): void {
    fromEvent(this.inputOrgaoOrigem.nativeElement, 'keyup')
      .pipe(
        debounceTime(this.delay)
      )
      .subscribe(value => {
        this.atualizar('orgaoOrigem');
      });

    fromEvent(this.inputNomeBase.nativeElement, 'keyup')
      .pipe(
        debounceTime(this.delay)
      )
      .subscribe(value => {
        this.atualizar('nomeBase');
      });
  }

  atualizar(elemento: String) {

    this.path = this.location.path();
    const idx = this.path.indexOf('?');
    if (idx > 0) {
      this.path = this.path.slice(0, idx);
    }
    this.path += '?';

    if (elemento === 'orgaoOrigem') {
      if (this.filtroOrgaoOrigem && this.filtroOrgaoOrigem.length > 0) {
        this.path += 'orgaoOrigem=' + this.filtroOrgaoOrigem;
        this.baseDadosState.filtroOrgaoOrigem.next(this.filtroOrgaoOrigem);
      } else {
        this.baseDadosState.filtroOrgaoOrigem.next('');
      }
    }

    if (elemento === 'nomeBase') {
      if (this.filtroNomeBase && this.filtroNomeBase.length > 0) {
        this.path += 'nomeBase=' + this.filtroNomeBase;
        this.baseDadosState.filtroNomeBase.next(this.filtroNomeBase);
      } else {
        this.baseDadosState.filtroNomeBase.next('');
      }
    }
    this.location.go(this.path);
  }

}

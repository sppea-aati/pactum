import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DetalheBaseDadosComponent } from './detalhe-baseDados.component';
import { BaseDadosState } from './baseDados-state';
import { BaseDados } from '../domain';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/* tslint:disable:use-life-cycle-interface */
@Component({
  selector: 'editar-baseDados',
  templateUrl: './editar-baseDados.html'
})
export class EditarBaseDadosComponent implements OnInit {

  public baseDados: BehaviorSubject<BaseDados>;
  public acao = '';

  public idBaseDados: number;

  constructor(
    protected baseDadosState: BaseDadosState,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) {
    this.baseDados = baseDadosState.baseDados;
  }
  ngOnInit(): void {
    this.baseDados = this.baseDadosState.baseDados;
    this.baseDadosState.iniciarEdicaoBaseDados();

    this.activatedRoute.params.subscribe((params: Params) => {
      this.idBaseDados = params['id'];

      if (!this.idBaseDados) {
        this.baseDadosState.selecionarBaseDados(new BaseDados());
        this.acao = 'Cadastrar';
        return;
      }
      this.acao = 'Editar';
      this.http.get('api/basesDados/' + this.idBaseDados).subscribe(
        (data: BaseDados) => {
          this.baseDadosState.selecionarBaseDados(data);
        },
        (err: HttpErrorResponse) => {
        }
      );
    });
  }

}

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { BaseDados } from '../domain';
import { BaseDadosState } from './baseDados-state';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Location } from '@angular/common';

@Component({
  selector: 'detalhe-baseDados',
  templateUrl: './detalhe-baseDados.html'
})
export class DetalheBaseDadosComponent implements OnInit {

  public baseDados: BehaviorSubject<BaseDados>;

  public idBaseDados: number;

  constructor(protected baseDadosState: BaseDadosState,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private http: HttpClient) {
    this.baseDados = baseDadosState.baseDados;
  }

  ngOnInit(): void {

    this.baseDadosState.editando.next(false);

    this.activatedRoute.params.subscribe((params: Params) => {
        this.idBaseDados = params['id'];

        if (!this.idBaseDados) {
            this.baseDadosState.selecionarBaseDados(new BaseDados());
            return;
        }

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

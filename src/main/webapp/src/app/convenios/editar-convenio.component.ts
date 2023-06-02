import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UsuarioConvenio, Convenio } from '../domain';
import { ConvenioState } from './convenio-state';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { DetalheConvenioComponent } from './detalhe-convenio.component';

/* tslint:disable:use-life-cycle-interface */
@Component({
  selector: 'editar-convenio',
  templateUrl: './editar-convenio.html'
})
export class EditarConvenioComponent implements OnInit {

  public convenio: BehaviorSubject<Convenio>;
  public acao = '';

  public idConvenio: number;

  constructor(
    protected convenioState: ConvenioState,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) {
    this.convenio = convenioState.convenio;
  }

  ngOnInit(): void {
    this.convenio = this.convenioState.convenio;
    this.convenioState.iniciarEdicaoConvenio();

    this.activatedRoute.params.subscribe((params: Params) => {
      this.idConvenio = params['id'];

      if (!this.idConvenio) {
        this.convenioState.selecionarConvenio(new Convenio());
        this.acao = 'Cadastrar';
        return;
      }
      this.acao = 'Editar';
      this.http.get('api/convenios/' + this.idConvenio).subscribe(
        (data: Convenio) => {
          this.convenioState.selecionarConvenio(data);
        },
        (err: HttpErrorResponse) => {
        }
      );
    });
  }

}

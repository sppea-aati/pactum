import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { UsuarioConvenio, Convenio } from '../domain';
import { ConvenioState } from './convenio-state';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Location } from '@angular/common';

@Component({
  selector: 'detalhe-convenio',
  templateUrl: './detalhe-convenio.html'
})
export class DetalheConvenioComponent implements OnInit {

  public convenio: BehaviorSubject<Convenio>;

  public idConvenio: number;

  constructor(protected convenioState: ConvenioState,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private http: HttpClient) {
    this.convenio = convenioState.convenio;
  }

  ngOnInit(): void {

    this.convenioState.editando.next(false);

    this.activatedRoute.params.subscribe((params: Params) => {
        this.idConvenio = params['id'];

        if (!this.idConvenio) {
            this.convenioState.selecionarConvenio(new Convenio());
            return;
        }

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

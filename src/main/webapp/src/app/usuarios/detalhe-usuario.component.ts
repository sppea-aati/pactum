import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { UsuarioConvenio } from '../domain';
import { UsuarioState } from './usuario-state';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';

@Component({
  selector: 'detalhe-usuario',
  templateUrl: './detalhe-usuario.html'
})
export class DetalheUsuarioComponent implements OnInit {

  public usuarioConvenio: BehaviorSubject<UsuarioConvenio>;

  public idUsuarioConvenio: number;

  constructor(private usuarioState: UsuarioState,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {
    this.usuarioConvenio = usuarioState.usuarioConvenio;
  }

  ngOnInit(): void {
    this.usuarioState.selecionarUsuarioConvenio(null);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.idUsuarioConvenio = params['id'];

      this.http.get('api/usuarioConvenios/' + this.idUsuarioConvenio).subscribe(
        (data: UsuarioConvenio) => {
          this.usuarioState.selecionarUsuarioConvenio(data);
        },
        (err: HttpErrorResponse) => {
        }
      );
    });
  }

}

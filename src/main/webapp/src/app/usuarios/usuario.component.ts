import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { UsuarioConvenio } from '../domain';
import { UsuarioState } from './usuario-state';

import * as util from '../util/util';


@Component({
  selector: 'usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

  public usuarioConvenio: BehaviorSubject<UsuarioConvenio>;

  constructor(private usuarioState: UsuarioState) {
    this.usuarioConvenio = usuarioState.usuarioConvenio;
  }

  ngOnInit(): void {
    setTimeout(() => {
      $('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
    }, 500);
  }

  formatarCPF(cpf: string): string {
    return util.formatarCPF(cpf);
  }

  atualizarUsuario($event, usuarioConvenio) {
    this.usuarioState.atualizarUsuario($event, usuarioConvenio);

  }

}

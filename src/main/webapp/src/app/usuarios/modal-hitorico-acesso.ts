import { Component, Inject } from '@angular/core';
import { ViewContainerRef } from '@angular/core';

import * as util from '../util/util';

@Component({
  selector: 'modalHitoricoAcesso',
  template: `
    <div class="modal fade" data-backdrop="static" id="modalHitoricoAcesso" tabindex="-1" role="dialog" aria-labelledby="idNovoUsuario">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" (click)="hideModal()" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">Histórico</h4>
          </div>
          <table class="table table-striped table-hover table-condensed dt-responsive" width="100%">
            <tbody>
              <tr *ngFor="let d of data">
                <td>{{formatarOperacaoAcesso(d)}}</td>
              </tr>
            </tbody>
          </table>
          <div class="modal-footer">
              <button type="button" class="btn btn-default" (click)="hideModal()">Fechar</button>
          </div>
      </div>
  </div>
</div>
  `
})
export class ModalHistoricoAcessoComponent {

  public data: any;
  private target: ViewContainerRef;

  hideModal(): void {
    $('#modalHitoricoAcesso').modal('hide');
    this.target.clear();
  }

  toggleModal(data: any, target: ViewContainerRef) {
    this.data = data;
    this.target = target;

    $('#modalHitoricoAcesso').modal('toggle');
  }

  formatarOperacaoAcesso(acesso: any): string {
    if (!acesso.operacaoAcesso) {
      return '';
    }
    let operacao = '';
    if (acesso.operacaoAcesso === 'CADASTRAR') {
      operacao = 'Cadastrado';
    } else if (acesso.operacaoAcesso === 'RECADASTRAR') {
      operacao = 'Recadastrado';
    } else if (acesso.operacaoAcesso === 'REMOVER') {
      operacao = 'Removido';
    }
    const strData = util.getFormattedDate(new Date(acesso.data));
    return strData + ' - ' + operacao;
  }



}

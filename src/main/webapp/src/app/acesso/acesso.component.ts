import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AcessoState } from './acesso-state';

@Component({
  selector: 'acesso',
  styles: [`
    .pull-right {
      float: right !important;
    }
    .margins {
      margin-right: 15px;
      margin-left: 15px;
    }
  `],
  template: `
    <div class="container-fluid">
      <!-- Campo Matrícula -->
      <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title"><i class="glyphicon glyphicon-user"></i> Controle de Acesso</h3>
          </div>
          <div class="panel-body">
              <form class="form-inline mb20 pull-right">
                  <div class="form-group">
                    <label class="sr-only" for="exampleInputAmount">Matrícula</label>
                    <div class="input-group input-group-sm">
                      <div class="input-group-addon">Matrícula</div>
                      <input type="text"
                      class="form-control" id="matricula" placeholder="Digite a matrícula"
                      (keyup)="onMatriculaChange($event.target.value)"
                    >
                    </div>
                  </div>
                  <button type="submit" class="btn btn-default btn-sm" (click)="onCadastrarClick()"><i class="glyphicon glyphicon-plus-sign"></i> Cadastrar</button>
                </form>
                <div class="clearfix"></div>
            <lista-pessoal></lista-pessoal>
          </div>
        </div>
    </div>
    `
})
export class AcessoComponent {

  private matricula = '';

  constructor(private acessoState: AcessoState, private toastrService: ToastrService) {}

  onMatriculaChange(matricula: string) {
    this.matricula = matricula;
    this.acessoState.matricula.next(matricula);
  }

  onCadastrarClick() {
    this.acessoState.cadastrarMatricula(this.matricula)
      .subscribe((data: any) => {
        if (data.error) {
          this.toastrService.error(data.error);
        } else {
          this.toastrService.success(data.mensagem);
          this.onMatriculaChange(this.matricula);
        }
      });
  }

}

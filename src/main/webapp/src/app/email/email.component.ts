import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { EmailState, Email } from './email-state';
import { LoginState } from '../login/login-state';

@Component({
  selector: 'email',
  styles: [`
    .pull-right {
      float: none;
    }
    @media (min-width: 768px)
    .pull-right {
      float: right !important;
    }
  `],
  template: `
    <div class="container">
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="panel-title"><i class="glyphicon glyphicon-envelope"></i> Lista de E-Mails</div>
        </div>
        <div class="panel-body">
            <form class="form-inline pull-right">
              <div class="form-group">
                <label class="sr-only" for="exampleInputAmount">Lista de E-mails</label>
                <div class="input-group input-group-sm">
                  <div class="input-group-addon">Filtrar e-mails</div>
                  <input type="text"
                  name="email-input"
                  [(ngModel)]="email"
                  (keyup)="onEmailChange($event.target.value)"
                  class="form-control" id="matricula" placeholder="Digite o e-mail"
                >
                </div>
              </div>
              <button type="submit" class="btn btn-default btn-sm"
              (click)="onCadastrarClick()"><i class="glyphicon glyphicon-plus-sign"></i> Cadastrar</button>
            </form>
            <div class="clearfix"></div>
            <br>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>E-mail</th>
                        <th>Base de Dados</th>
                        <th>Convênios</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let email of emails | async; let i = index;">
                      <td>{{email.email}}</td>
                      <td>
                        <input type="checkbox"
                        [checked]="email.enviarBaseDados"
                        (change)="onChange($event, 'enviarBaseDados', email)">
                      </td>
                      <td>
                        <input type="checkbox"
                        [checked]="email.enviarConvenio"
                        (change)="onChange($event, 'enviarConvenio', email)">
                      </td>
                      <td>
                        <button class="btn btn-danger btn-xs" (click)="onExcluirClick(email)">
                          <i class="glyphicon glyphicon-remove" aria-hidden="true"></i>
                          Excluir
                        </button>
                      </td>
                    </tr>
                </tbody>
            </table>

            <div class="alert alert-warning" *ngIf="(emails | async).length === 0">
                <p>Nenhum e-mail localizado.</p>
            </div>
        </div>

        <div class="panel-footer">
          <button class="btn btn-default btn-sm" (click)="onRefreshClick()">
                <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Atualizar
          </button>
          <button *ngIf="loginState.isAdmin | async" class="btn btn-primary btn-sm" (click)="onTestarClick()"> <i class="glyphicon glyphicon-envelope"></i> Testar envio de e-mail</button>
        </div>
      </div>
    </div>
  `
})
export class EmailComponent implements OnInit {

  public email = '';

  public emails: Observable<Email[]>;

  constructor(
    private emailState: EmailState,
    private toastrService: ToastrService,
    public loginState: LoginState
  ) {
    this.emails = this.emailState.emails;
    this.onRefreshClick();
  }

  ngOnInit(): void {
  }

  onEmailChange(email: string) {
    this.emailState.email.next(email);
  }

  onCadastrarClick() {
    if (this.email === '') {
      return;
    }
    const novoEmail = new Email();
    novoEmail.email = this.email;
    novoEmail.enviarBaseDados = false;
    novoEmail.enviarConvenio = false;
    this.emailState.cadastrarEmail(novoEmail)
      .subscribe(
      (data) => {
        this.toastrService.success('E-mail ' + this.email + ' cadastrado com sucesso.');
        this.email = '';
        this.onEmailChange('');
      },
      (err: HttpErrorResponse) => {
        this.toastrService.error('E-mail já cadastrado.');
      }
      );
  }

  onExcluirClick(email: Email) {
    this.emailState.excluirEmail(email)
      .subscribe(data => {
        this.toastrService.success('E-mail ' + email.email + 'excluído com sucesso.');
        this.onEmailChange(this.email);
      });
  }

  onRefreshClick() {
    this.emailState.refresh();
  }

  onTestarClick() {
    this.emailState.testarEmail().subscribe((data: any) => alert(data.mensagem));
  }

  onChange($event, tipoEnvio, email) {
    this.emailState.onChange($event, tipoEnvio, email);
  }

}

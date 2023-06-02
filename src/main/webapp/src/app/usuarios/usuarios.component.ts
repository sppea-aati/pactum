import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaUsuarioComponent } from './lista-usuario.component';
import { MessageService } from '../util/message-service';
import { Router } from '@angular/router';
import { UsuarioState } from './usuario-state';

@Component({
  selector: 'usuarios',
  templateUrl: 'usuarios.component.html'
})
export class UsuariosComponent implements OnInit {

  matricula: String;

  form: FormGroup;

  @ViewChild(ListaUsuarioComponent) listaUsuarioComponent: ListaUsuarioComponent;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private messageService: MessageService, private router: Router, private usuarioState: UsuarioState) {

    this.form = formBuilder.group({
      matricula: ['', [
        Validators.required,
      ]]
    });
  }

  ngOnInit(): void {
  }

  adicionarUsuario() {

    const url = 'api/usuarioConvenio/';

    this.http.post(url + this.matricula, {}).subscribe(
      (data: any) => {
        this.messageService.success('Sucesso', 'Usuário cadastrado com sucesso.');
        this.router.navigate(['usuarios/' + data.id]);
      },
      (err: HttpErrorResponse) => {
        if (err.error.message.indexOf('object references an unsaved transient instance') >= 0) {
        //  this.falha = 'Matrícula não encontrada.';
        //  this.scheduleHideAlerts();
        //  return;
        }
        if (err.error.message.indexOf('ConstraintViolationException') >= 0) {
          this.messageService.error('Erro', 'Usuário não encontrado');
          return;
        }
        this.messageService.error('Erro', err.error.message);
        this.matricula = null;
        console.log('ERRO', err);
      }
    );
  }

}

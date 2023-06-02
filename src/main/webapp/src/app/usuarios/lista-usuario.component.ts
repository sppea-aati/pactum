import { Component, HostListener } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UsuarioConvenio, Pessoal } from '../domain';
import { UsuarioState } from './usuario-state';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

import * as util from '../util/util';


@Component({
  selector: 'lista-usuario',
  templateUrl: 'lista-usuario.component.html'

})
export class ListaUsuarioComponent implements OnInit {

  public usuariosConvenio: Observable<UsuarioConvenio[]>;

  public filtroPerfil: BehaviorSubject<string>;

  public dtOptions: DataTables.Settings = {};

  public matriculaNovo: string;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    private usuarioState: UsuarioState,
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.usuariosConvenio = this.usuarioState.usuariosConvenio;
    this.filtroPerfil = this.usuarioState.filtroPerfil;
    this.carregarTabela();
  }

  @HostListener('window:beforeunload', ['$event'])
  public limparStateTabela($event) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }

  onPerfilChange(perfil) {
    this.filtroPerfil.next(perfil);
    this.rerender();
  }

  ngOnInit(): void {
  }

  formatarCPF(cpf: string): string {
    return util.formatarCPF(cpf);
  }

  atualizadoLabelClass(campo: string): string {
    if (!campo) {
      return '';
    }
    let labelClass = '';
    if (campo === 'SIM') {
      labelClass = 'label label-success';
    } else {
      labelClass = 'label label-danger';
    }
    return labelClass;
  }

  desligadoLabelClass(campo: string): string {
    if (!campo) {
      return '';
    }
    let labelClass = '';
    if (campo === 'NÃO') {
      labelClass = 'label label-success';
    } else {
      labelClass = 'label label-danger';
    }
    return labelClass;
  }

  isAtualizado(atualizado: boolean): string {
    if (atualizado) {
      return 'SIM';
    } else {
      return 'NÃO';
    }
  }

  carregarTabela() {
    this.dtOptions = {
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      language: {
        url: 'assets/Portuguese-Brasil.json'
      },
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.usuarioState.carregarTabela(dataTablesParameters, (page) => {
          callback({
            recordsTotal: page.totalElements,
            recordsFiltered: page.totalElements,
            data: [],
          });
        });
      },
      order: [[5, 'asc'], [6, 'asc'], [1, 'asc']],
      columns: [
        { width: '5%' }, // Matrícula
        { width: '25%' }, // Nome
        { width: '20%' }, // E-mail
        { width: '8%' }, // CPF
        { width: '25%' }, // Lotação
        { width: '6%' }, // Desligado
        { width: '6%' }, // Atualizado
        { width: '5%' }, // Ações
      ],
      columnDefs: [{
        targets: [7],
        orderable: false
      }
      ]
    };
  }

  rerender(): void {
    if (!this.dtElement || !this.dtElement.dtInstance) {
      return;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
    });
  }

  onAdicionar() {
    if (!this.matriculaNovo || this.matriculaNovo.length < 1) {
      alert('Informe a matrícula!');
      return;
    }
    let usuario: UsuarioConvenio;
    usuario = new UsuarioConvenio();
    usuario.pessoal = new Pessoal();
    usuario.pessoal.matricula = this.matriculaNovo;
    const url = 'api/usuarioConvenios';
    this.http.post(url, usuario).subscribe(
      (data) => {
        this.toastrService.success('Usuário cadastrado com sucesso.');
        this.matriculaNovo = '';
        this.rerender();
      },
      (err: HttpErrorResponse) => {
        if (err.error.message.indexOf('object references an unsaved transient instance') >= 0) {
          this.toastrService.error('Matrícula não encontrada.');
          return;
        }
        if (err.error.message.indexOf('ConstraintViolationException') >= 0) {
          this.toastrService.error('Matrícula já cadastrada.');
          return;
        }
      }
    );
  }
}

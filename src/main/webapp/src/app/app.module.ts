import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { LOCALE_ID } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateConverterInterceptor } from './http-dateconverter-interceptor';
import 'moment/locale/pt-br';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';

import { LoginModule } from './login/login.module';

import { SearchService } from './util/search-service';

import { HomeComponent } from './home/home.component';
import { CabecalhoComponent } from './cabecalho/cabecalho.component';
import { ConveniosComponent } from './convenios/convenios.component';
import { ConvenioComponent } from './convenios/convenio.component';
import { ConvenioService } from './convenios/convenio.service';
import { ListaConvenioComponent } from './convenios/lista-convenio.component';
import { ListaConvenioImpressaoComponent } from './convenios/lista-convenio-impressao.component';
import { ListaAcessoConvenioComponent } from './convenios/lista-acesso-convenio.component';
import { ListaAcessoConvenioImpressaoComponent } from './convenios/lista-acesso-convenio-impressao.component';
import { NovoConvenioComponent } from './convenios/novo-convenio.component';
import { EditarConvenioComponent } from './convenios/editar-convenio.component';
import { AnexoConvenioComponent } from './convenios/anexo-convenio.component';
import { FiltrosConvenioComponent } from './convenios/filtros-convenio.component';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuarios/usuario.component';
import { DetalheUsuarioComponent } from './usuarios/detalhe-usuario.component';
import { ListaUsuarioComponent } from './usuarios/lista-usuario.component';
import { ListaConvenioUsuarioComponent } from './usuarios/lista-convenio-usuario.component';
import { AnexoUsuarioComponent } from './usuarios/anexo-usuario.component';
import { ModalHistoricoAcessoComponent } from './usuarios/modal-hitorico-acesso';

import { BasesDadosComponent } from './basesDados/basesDados.component';
import { FiltrosBaseDadosComponent } from './basesDados/filtros-baseDados.component';
import { ListaBaseDadosComponent } from './basesDados/lista-baseDados.component';
import { BaseDadosService } from './basesDados/baseDados.service';
import { EditarBaseDadosComponent } from './basesDados/editar-baseDados.component';
import { DetalheBaseDadosComponent } from './basesDados/detalhe-baseDados.component';
import { BaseDadosComponent } from './basesDados/baseDados.component';
import { AnexoBaseDadosComponent } from './basesDados/anexo-baseDados.component';
import { ListaBaseDadosImpressaoComponent } from './basesDados/lista-baseDados-impressao.component';
import { CargaComponent } from './basesDados/carga.component';
import { ListaCargasComponent } from './basesDados/listaCargas.component';
import { CargaBaseDadosService } from './basesDados/cargaBaseDados.service';
import { CargaState } from './basesDados/carga-state';

import { AcessoComponent } from './acesso/acesso.component';
import { ListaPessoalComponent } from './acesso/lista-pessoal.component';

import { EmailComponent } from './email/email.component';
import { EmailState } from './email/email-state';

import { AcessoState } from './acesso/acesso-state';
import { ConvenioState } from './convenios/convenio-state';
import { UsuarioState } from './usuarios/usuario-state';
import { BaseDadosState } from './basesDados/baseDados-state';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TrataErro } from './util/trata-erro';
import { MessageService } from './util/message-service';
import { DetalheConvenioComponent } from './convenios/detalhe-convenio.component';
import { VoltarButtonComponent } from './voltar-button/voltar-button.component';

@NgModule({
  declarations: [
    AppComponent,
    CabecalhoComponent,
    HomeComponent,
    ConveniosComponent,
    DetalheConvenioComponent,
    ConvenioComponent,
    ListaConvenioComponent,
    ListaConvenioImpressaoComponent,
    ListaAcessoConvenioComponent,
    ListaAcessoConvenioImpressaoComponent,
    NovoConvenioComponent,
    EditarConvenioComponent,
    UsuariosComponent,
    UsuarioComponent,
    DetalheUsuarioComponent,
    ListaUsuarioComponent,
    ListaConvenioUsuarioComponent,
    AnexoConvenioComponent,
    AnexoUsuarioComponent,
    FiltrosConvenioComponent,
    AcessoComponent,
    ListaPessoalComponent,
    EmailComponent,
    ModalHistoricoAcessoComponent,
    BasesDadosComponent,
    FiltrosBaseDadosComponent,
    ListaBaseDadosComponent,
    EditarBaseDadosComponent,
    DetalheBaseDadosComponent,
    BaseDadosComponent,
    AnexoBaseDadosComponent,
    ListaBaseDadosImpressaoComponent,
    CargaComponent,
    ListaCargasComponent,
    VoltarButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    LoginModule,
    BrowserAnimationsModule,
    NgxMyDatePickerModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true
    }),
    NgSelectModule
  ],
  entryComponents: [
    ModalHistoricoAcessoComponent

  ],
  providers: [
    { provide: ErrorHandler, useClass: TrataErro },
    { provide: LOCALE_ID, useValue: 'pt' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateConverterInterceptor,
      multi: true,
    },
    AcessoState,
    ConvenioState,
    ConvenioService,
    BaseDadosState,
    BaseDadosService,
    CargaBaseDadosService,
    EmailState,
    UsuarioState,
    MessageService,
    ToastrService,
    CargaState
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

  constructor() {
    registerLocaleData(localePt);
  }
}

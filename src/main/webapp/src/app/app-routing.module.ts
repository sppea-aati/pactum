import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from './login/login.guard';
import { AutorizacaoGuard } from './login/autorizacao.guard';

import { LoginFormComponent } from './login/login-form.component';
import { HomeComponent } from './home/home.component';
import { ConveniosComponent } from './convenios/convenios.component';
import { ListaConvenioImpressaoComponent } from './convenios/lista-convenio-impressao.component';

import { DetalheConvenioComponent } from './convenios/detalhe-convenio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DetalheUsuarioComponent } from './usuarios/detalhe-usuario.component';
import { AcessoComponent } from './acesso/acesso.component';
import { EmailComponent } from './email/email.component';
import { NovoConvenioComponent } from './convenios/novo-convenio.component';
import { EditarConvenioComponent } from './convenios/editar-convenio.component';
import { AnexoConvenioComponent } from './convenios/anexo-convenio.component';
import { ListaAcessoConvenioImpressaoComponent } from './convenios/lista-acesso-convenio-impressao.component';

import { BasesDadosComponent } from './basesDados/basesDados.component';
import { EditarBaseDadosComponent } from './basesDados/editar-baseDados.component';
import { DetalheBaseDadosComponent } from './basesDados/detalhe-baseDados.component';
import { ListaBaseDadosImpressaoComponent } from './basesDados/lista-baseDados-impressao.component';
import { CargaComponent } from './basesDados/carga.component';

const routes: Routes = [
  { path: 'login', canActivate: [LoginGuard], component: LoginFormComponent },

  { path: 'home', canActivate: [LoginGuard, AutorizacaoGuard], component: HomeComponent },
  { path: 'usuarios', canActivate: [LoginGuard, AutorizacaoGuard], component: UsuariosComponent },
  { path: 'usuarios/:id', canActivate: [LoginGuard, AutorizacaoGuard], component: DetalheUsuarioComponent },
  { path: 'convenios/anexo/:id', canActivate: [LoginGuard, AutorizacaoGuard], component: AnexoConvenioComponent },
  { path: 'convenios', canActivate: [LoginGuard, AutorizacaoGuard], component: ConveniosComponent },
  { path: 'convenios/impressao', canActivate: [LoginGuard, AutorizacaoGuard], component: ListaConvenioImpressaoComponent },
  { path: 'convenios/novo', canActivate: [LoginGuard, AutorizacaoGuard], component: EditarConvenioComponent },
  { path: 'convenios/:id', canActivate: [LoginGuard, AutorizacaoGuard], component: DetalheConvenioComponent },
  { path: 'convenios/:id/editar', canActivate: [LoginGuard, AutorizacaoGuard], component: EditarConvenioComponent },
  { path: 'convenios/:id/impressao', canActivate: [LoginGuard, AutorizacaoGuard], component: ListaAcessoConvenioImpressaoComponent },
  { path: 'basesDados', canActivate: [LoginGuard, AutorizacaoGuard], component: BasesDadosComponent },
  { path: 'basesDados/impressao', canActivate: [LoginGuard, AutorizacaoGuard], component: ListaBaseDadosImpressaoComponent },
  { path: 'basesDados/novo', canActivate: [LoginGuard, AutorizacaoGuard], component: EditarBaseDadosComponent },
  { path: 'basesDados/:id', canActivate: [LoginGuard, AutorizacaoGuard], component: DetalheBaseDadosComponent },
  { path: 'basesDados/:id/editar', canActivate: [LoginGuard, AutorizacaoGuard], component: EditarBaseDadosComponent },
  { path: 'basesDados/:id/carga/novo', canActivate: [LoginGuard, AutorizacaoGuard], component: CargaComponent },
  { path: 'basesDados/:id/carga/editar', canActivate: [LoginGuard, AutorizacaoGuard], component: CargaComponent },
  { path: 'acesso', canActivate: [LoginGuard, AutorizacaoGuard], component: AcessoComponent },
  { path: 'email', canActivate: [LoginGuard, AutorizacaoGuard], component: EmailComponent },

  { path: '', component: LoginFormComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes
    // , { enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

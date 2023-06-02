import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginService } from './login.service';
import { LoginGuard } from './login.guard';
import { AutorizacaoGuard } from './autorizacao.guard';
import { LoginFormComponent } from './login-form.component';
import { LoginState } from './login-state';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LoginFormComponent
  ],
  declarations: [
    LoginFormComponent
  ],
  providers: [
    LoginService,
    LoginGuard,
    AutorizacaoGuard,
    LoginState
  ]
})
export class LoginModule { }

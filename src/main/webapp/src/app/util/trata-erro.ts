import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TrataErro implements ErrorHandler {

  toastrService: ToastrService;

  constructor(private injector: Injector) {
  }

  handleError(error) {

    if (this.toastrService == null) {
      this.toastrService = this.injector.get(ToastrService);
    }

    let messageShowed = false;
    if (error._body) {
      try {
        const e = JSON.parse(error._body);
        if (e.message) {
          this.toastrService.error(e.message, 'Erro');
          messageShowed = true;
        }
      } catch (e) {
        console.log('Erro no parse: ' + error._body);
      }
    }

    if (error.status === 403) {
      const router = <Router>this.injector.get(Router);
      router.navigate(['']);
      return;
    } else if (error.status === 401) {
      const router = <Router>this.injector.get(Router);
      router.navigate(['login']);
      return;
    } else if (error.status === 504) {
      alert('Aparentemente o sistema está fora do ar.');
      messageShowed = true;
    }

    if (error.error && error.error.message) {
      this.toastrService.error(error.error.message, 'Erro');
      messageShowed = true;
    }

    if (messageShowed) {
      return;
    }

    this.toastrService.error('Ocorreu um erro inesperado no sistema.', 'Erro');
    console.log('Ocorreu um erro inesperado no sistema.');
    console.log(error);
  }
}

import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

export class Email {
  id?: number;
  email: string;
  enviarBaseDados: boolean;
  enviarConvenio: boolean;
}

@Injectable()
export class EmailState {

  public email: BehaviorSubject<string>;

  public buscando: BehaviorSubject<boolean>;

  public emails: BehaviorSubject<Email[]>;

  private lastEmail = '';

  constructor(
    private http: HttpClient
  ) {
    this.email = new BehaviorSubject('');
    this.buscando = new BehaviorSubject(false);
    this.emails = new BehaviorSubject([]);

    this.email.subscribe(data => this.onEmailChange(data));
  }

  onEmailChange(email: string) {
    let url = 'api/emails?';
    if (email) {
      url = 'api/emails/search/findByEmailIgnoreCaseContaining?';
      url += 'email=' + email;
      this.lastEmail = email;
    } else {
      this.lastEmail = '';
    }
    this.buscando.next(true);
    this.http.get(url)
      .subscribe((data: any) => {
        this.buscando.next(false);
        this.emails.next(data._embedded.emails);
      });
  }

  cadastrarEmail(email: Email) {
    const url = 'api/emails';
    return this.http.post(url, email);
  }

  testarEmail() {
    const url = 'api/email/testeEnvioEmail';
    return this.http.get(url);
  }

  excluirEmail(email: Email) {
    const url = 'api/emails/' + email.id;
    return this.http.delete(url);
  }

  refresh() {
    this.onEmailChange(this.lastEmail);
  }

  onChange($event, tipoEnvio, email) {
    if (tipoEnvio === 'enviarBaseDados') {
      this.http.patch('api/emails/' + email.id, { enviarBaseDados: $event.target.checked })
        .subscribe(() => { this.refresh(); });
    } else if (tipoEnvio === 'enviarConvenio') {
      this.http.patch('api/emails/' + email.id, { enviarConvenio: $event.target.checked })
        .subscribe(() => { this.refresh(); });

    }
  }
}

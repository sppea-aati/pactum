import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'botao-voltar',
  template: `
    <a class="btn btn-default btn-sm" style="margin-top: -4px;" (click)="click()">
      <i class="icon-arrow-left"></i> Voltar
    </a>
  `,
  styles: []
})
export class VoltarButtonComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  click() {
    this.location.back();
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router/';

@Component({
  selector: 'convenios',
  styles: [`
    .pad-left {
      margin-left: 2px;
    }
  `],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 lista-convenios-col-esquerda">
          <div class="panel panel-default">
            <div class="panel-heading clearfix">
              <h3 class="panel-title"><i class="panel-title-icon icon-share2"></i> Convênios</h3>
            </div>
            <div class="panel-body">
              <lista-convenio></lista-convenio>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConveniosComponent {

  // public convenio: Observable<Convenio>;

  // public editando: Observable<boolean>;

  // private oldConvenio: Convenio;

  constructor(
    private router: Router,
    // private convenioState: ConvenioState
  ) {
    // this.convenio = this.convenioState.convenio;
    // this.editando = this.convenioState.editando;
  }

}

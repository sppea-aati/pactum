import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../util/search-service';
import { AcessoTO } from '../domain';

@Injectable()
export class ConvenioService extends SearchService {

  getUrl() {
    return 'api/convenios';
  }

  consultarAcessosConvenio(idConvenio: number, filtro, start, limit, sortColumn, sortDirection) {
    let url = `api/acesso/acessosDisponiveisPorUsuario?idUsuarioConvenio=${idConvenio}`;

    if (filtro) {
      url += `&pesquisa=${filtro}`;
    }

    url += `&${this._mountPageUrl(start, limit)}`;

    for (let i = 0; i < sortColumn.length; i++) {
      url += `&${this._mountSortUrl(sortColumn[i], sortDirection[i])}`;
    }

    return this.http.get(url);
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CargaBaseDados } from '../domain';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CargaState {

  public carga: BehaviorSubject<CargaBaseDados>;
  public cargas: BehaviorSubject<CargaBaseDados[]>;

  constructor(private http: HttpClient) {
    this.carga = new BehaviorSubject(null);
    this.cargas = new BehaviorSubject([]);
  }

  selecionarCarga(carga: CargaBaseDados) {
    this.carga.next(carga);
  }

  carregarTabela(dataTablesParameters: any, callback: (page) => void, baseDadosID: number) {

    const url = 'api/cargasBaseDados/search/findByBaseDados_Id?Id=' + baseDadosID;
    const pageNum = dataTablesParameters.start / dataTablesParameters.length;
    const page = '&size=' + dataTablesParameters.length + '&page=' + pageNum;
    const sort = '&sort=dataExtracao,desc';

    this.http
      .get(url + page + sort)
      .subscribe((data: any) => {
        if (data._embedded) {
          this.cargas.next(data._embedded.cargasBaseDados);
        } else {
          this.cargas.next(new CargaBaseDados[0]);
        }
        callback(data.page);
      });
  }
}

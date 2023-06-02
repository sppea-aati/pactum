import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../util/search-service';
import { AcessoTO } from '../domain';

@Injectable()
export class CargaBaseDadosService extends SearchService {

    getUrl() {
        return 'api/cargasBaseDados';
    }

}

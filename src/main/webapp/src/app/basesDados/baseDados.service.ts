import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../util/search-service';
import { AcessoTO } from '../domain';

@Injectable()
export class BaseDadosService extends SearchService {

    getUrl() {
        return 'api/basesDados';
    }

}

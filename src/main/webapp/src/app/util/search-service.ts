import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export abstract class SearchService {

    constructor(protected http: HttpClient) { }

    protected abstract getUrl();

    save(entity) {
        if (entity.id) {
            return this.update(entity);
        } else {
            return this.insert(entity);
        }
    }

    insert(entity) {
        return this.http.post(this.getUrl(), entity);
    }

    update(entity) {
        return this.http.patch(`${this.getUrl()}/${entity.id}`, entity);
    }

    findById(id: string) {
        return this.http.get(`${this.getUrl()}/${id}`);
    }

    findAll(start, limit, sort) {
        return this.http.get(this.getUrl());
    }

    search(filters: Array<any>, start, limit, sortColumn, sortDirection) {
        return this.http.get(`${this.getUrl()}/?${this._mountSearchUrl(filters)}&${this._mountPageUrl(start, limit)}&${this._mountSortUrl(sortColumn, sortDirection)}`);
    }

    protected _mountSearchUrl(filters: Array<any>) {
        if (filters) {
            let filterUrl = '';
            filters.forEach(f => {
                if (f && f.value) {
                    filterUrl += f.key + f.operation + (f.useContains ? '*' : '') + f.value + (f.useContains ? '*' : '') + ',';
                }
            });
            return `search=${filterUrl}`;
        }
        return '';
    }

    protected _mountPageUrl(start, limit) {
        let pageUrl = '';
        if (start != null) {
            const pageNumber = start / limit;
            pageUrl += `size=${limit}&page=${pageNumber}`;
        }
        return pageUrl;
    }

    protected _mountSortUrl(sortColumn, sortDirection) {
        let sortUrl = '';
        if (sortColumn) {
            sortUrl += `sort=${sortColumn}${sortDirection ? ',' + sortDirection : 'asc'}`;
        }
        return sortUrl;
    }

}

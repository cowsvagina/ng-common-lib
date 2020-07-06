import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { APIResponse } from './APIResponse';
import { AuthorizeTokenService } from './AuthorizeTokenService';
import { SessionService } from './Session.service';

@Injectable({
    providedIn: 'root'
})
export class BaseClientService {
    private isRequesting = false;

    constructor(
        private client: HttpClient,
        private tokenService: AuthorizeTokenService,
        private session: SessionService,
    ) {
    }

    get IsRequesting(): boolean {
        return this.isRequesting;
    }

    private get(uri: string, params: {}) {
        this.isRequesting = true;

        const options = this.prepareOptions();
        options.params = new HttpParams({fromObject: params});
        return this.client.get(uri, options)
            .pipe(
                mergeMap((response: APIResponse<any>) => {
                    return of(response);
                }),
                catchError((response: HttpErrorResponse) => {
                    return throwError(response.error);
                }),
                finalize(() => {
                    this.isRequesting = false;
                })
            );
    }

    protected post(uri: string, params: {}) {
        this.isRequesting = true;

        const httpParams: any = new HttpParams({
            fromObject: params,
            encoder: (new HttpUrlEncodingCodec()),
        });
        const options = this.prepareOptions();
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        return this.client.post(uri, httpParams, options)
            .pipe(
                mergeMap((response: APIResponse<any>) => {
                    return of(response);
                }),
                catchError((response: HttpErrorResponse) => {
                    return throwError(response.error);
                }),
                finalize(() => {
                    this.isRequesting = false;
                })
            );
    }

    protected put(uri: string, params: {}) {
        this.isRequesting = true;

        const httpParams: any = new HttpParams({
            fromObject: params,
            encoder: (new HttpUrlEncodingCodec()),
        });
        const options = this.prepareOptions();
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        return this.client.put(uri, httpParams, options)
            .pipe(
                mergeMap((response: APIResponse<any>) => {
                    return of(response);
                }),
                catchError((response: HttpErrorResponse) => {
                    return throwError(response.error);
                }),
                finalize(() => {
                    this.isRequesting = false;
                })
            );
    }

    private delete(uri, params: {}) {
        this.isRequesting = true;
        const options = this.prepareOptions();
        options.params = new HttpParams({fromObject: params});
        return this.client.delete(uri, options)
            .pipe(
                mergeMap((response: APIResponse<any>) => {
                    return of(response);
                }),
                catchError((response: HttpErrorResponse) => {
                    return throwError(response.error);
                }),
                finalize(() => {
                    this.isRequesting = false;
                })
            );
      }

    private prepareOptions() {
        const options: {
            headers?: {
                [header: string]: string | string[];
            };
            observe?: 'body';
            params?: HttpParams | {
                [param: string]: string | string[];
            };
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = {
            headers: {
                'X-App-Session-Id': this.session.ID,
            }
        };
        const authToken = this.tokenService.token();
        if (authToken) {
            options.headers.Authentication = authToken;
        }

        return options;
    }
}

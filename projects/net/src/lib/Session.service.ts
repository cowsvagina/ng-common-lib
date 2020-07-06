import {Injectable} from '@angular/core';

const sessionIDName = 'appSessionID';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private id: string;

    constructor() {
        this.id = sessionStorage.getItem(sessionIDName) || '';
        if (this.id === '') {
            this.id = `${(new Date()).getTime()}${Math.random() * 10000}`;
            sessionStorage.setItem(sessionIDName, this.id);
        }
    }

    get ID(): string {
        return this.id;
    }
}

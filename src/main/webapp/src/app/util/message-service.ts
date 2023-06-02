import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';

import { Message, MessageType } from './message';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class MessageService {

    private subject = new Subject<Message>();
    private keepAfterRouteChange = false;

    constructor(private router: Router, private toastr: ToastrService) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        /*router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });*/
    }

    success(title: string, message: string) {
        this.toastr.success(message, title);
    }

    error(title: string, message: string) {
        this.toastr.error(message, title);
    }

    info(title: string, message: string) {
        this.toastr.info(message, title);
    }

    warn(title: string, message: string) {
        this.toastr.warning(message, title);
    }

    /*getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false) {
        this.alert(MessageType.Success, message, keepAfterRouteChange);
    }

    error(message: string, keepAfterRouteChange = false) {
        this.alert(MessageType.Error, message, keepAfterRouteChange);
    }

    info(message: string, keepAfterRouteChange = false) {
        this.alert(MessageType.Info, message, keepAfterRouteChange);
    }

    warn(message: string, keepAfterRouteChange = false) {
        this.alert(MessageType.Warning, message, keepAfterRouteChange);
    }

    alert(type: MessageType, message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Message>{ type: type, message: message });
    }

    clear() {
        // clear alerts
        this.subject.next();
    }*/
}
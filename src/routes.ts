import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {FakeBackendRoute, FakeBackendRoutes} from './core';

export class HttpRequestUrlFBRoute implements FakeBackendRoute {

  constructor(private url: string, private event: HttpEvent<any>) {
  }

  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req.url.endsWith(this.url) ? Observable.of(this.event) : next.handle(req);
  }

}

export class FakeBackendRoutesFactory {

  static empty(): FakeBackendRoutes {
    return [];
  }

  static makeUrlRouter<T>(url: string, event: HttpEvent<T>): FakeBackendRoute {
    return new HttpRequestUrlFBRoute(url, event);
  }

}

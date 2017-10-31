import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';


export interface FakeBackendRoute<T> {
  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<T>>;
}

export interface FakeBackendConfig {
  routes: Array<FakeBackendRoute<any>>;
}

export const FAKE_BACKEND_CONFIG = new InjectionToken<FakeBackendConfig>('FAKE_BACKEND_CONFIG');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor(@Inject(FAKE_BACKEND_CONFIG) protected config: FakeBackendConfig) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**
     * Recursively iterate over list of routes. The one satisfying the {@link FakeBackendRoute.match} will return from the function.
     */
    const matchNextRoute = function (req1: HttpRequest<any>,
                                     routes: Array<FakeBackendRoute<any>>,
                                     routeId: number = 0): Observable<HttpEvent<any>> {
      const route = routes[routeId];
      return route ? route.match(req1, <HttpHandler> {
        handle(req2: HttpRequest<any>): Observable<HttpEvent<any>> {
          return matchNextRoute(req2, routes, ++routeId);
        }
      }) : next.handle(req);
    };

    return matchNextRoute(req, this.config.routes);

  }
}

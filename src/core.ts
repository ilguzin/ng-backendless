import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

export const FAKE_BACKEND_ROUTES = new InjectionToken<FakeBackendRoutes>('FAKE_BACKEND_ROUTES');

export interface FakeBackendRoute {
  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

export declare type FakeBackendRoutes = Array<FakeBackendRoute>;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor(@Inject(FAKE_BACKEND_ROUTES) protected routes: FakeBackendRoutes) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**
     * Recursively iterate over list of routes. The one satisfying the {@link FakeBackendRoute.match} will return from the function.
     */
    const matchNextRoute = function (req1: HttpRequest<any>, routes: FakeBackendRoutes, routeId: number = 0): Observable<HttpEvent<any>> {
      const route = routes[routeId];
      return route ? route.match(req1, <HttpHandler> {
        handle(req2: HttpRequest<any>): Observable<HttpEvent<any>> {
          return matchNextRoute(req2, routes, ++routeId);
        }
      }) : next.handle(req);
    };

    return matchNextRoute(req, this.routes);

  }
}

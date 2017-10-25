import {ModuleWithProviders, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {FAKE_BACKEND_ROUTES, FakeBackendInterceptor, FakeBackendRoutes} from './core';
import {FakeBackendRoutesFactory} from './routes';

@NgModule({
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true}
  ]
})
export class FakeBackend {

  static forRoot(routes: FakeBackendRoutes = FakeBackendRoutesFactory.empty()): ModuleWithProviders {
    return {
      ngModule: FakeBackend,
      providers: [
        {provide: FAKE_BACKEND_ROUTES, useValue: routes}
      ]
    };
  }

}

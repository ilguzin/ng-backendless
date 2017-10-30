import {ModuleWithProviders, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {FAKE_BACKEND_CONFIG, FakeBackendInterceptor, FakeBackendConfig} from './core';

@NgModule({
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true}
  ]
})
export class FakeBackendModule {

  static forRoot(config: FakeBackendConfig): ModuleWithProviders {
    return {
      ngModule: FakeBackendModule,
      providers: [
        {provide: FAKE_BACKEND_CONFIG, useValue: config}
      ]
    };
  }

}

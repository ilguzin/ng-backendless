
# ng-backendless
[![Build Status](https://travis-ci.org/ilguzin/ng-backendless.svg?branch=master)](https://travis-ci.org/ilguzin/ng-backendless)
[![Coverage Status](https://coveralls.io/repos/github/ilguzin/ng-backendless/badge.svg)](https://coveralls.io/github/ilguzin/ng-backendless)

Fully featured, extensible and flexible Angular (4+) module for application backendless development. The functionality 
is based on injecting (via [HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor)) of a list of fake 
backend API mappings that will be used by HttpClient implicitly when you run http calls in your application.

## How to use

```typescript

import {NgModule} from '@angular/core';
import {HttpClientModule, HttpResponse} from '@angular/common/http';
import {FakeBackendModule, FakeBackendConfig, SimpleUrlMatchRoute} from 'ng-backendless';

class Value {
  constructor(public val: number) {}
}

export function fakeBackendConfigFactory() {
  return <FakeBackendConfig>{
    routes: [
      new SimpleUrlMatchRoute('/api/values', new HttpResponse({body: [new Value(100)], status: 200, statusText: 'OK'}))
    ]
  };
}


@NgModule({
  imports: [
    HttpClientModule,
    FakeBackendModule.forRoot(fakeBackendConfigFactory)
  ],
  declarations: [
  ],
  bootstrap: []
})
export class AppModule {
}


```

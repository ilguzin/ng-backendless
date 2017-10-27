# ng-backendless

Fully featured, extensible and flexible Angular (4+) module for application backendless development. The functionality 
is based on injecting (via [HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor)) of a list of fake 
backend API mappings that will be used by HttpClient implicitly when you run http calls in your application.

## How to use

```typescript

import {NgModule} from '@angular/core';
import {HttpClientModule, HttpResponse} from '@angular/common/http';
import {FakeBackendModule, FakeBackendRoutesFactory, FakeBackendRoutes} from 'ng-backendless';

class Value {
  constructor(public val: number) {}
}

const fakeBackendRoutes: FakeBackendRoutes = FakeBackendRoutesFactory.empty();

fakeBackendRoutes.push(FakeBackendRoutesFactory.makeSimpleUrlMatchRouter<Value>(
  '/api/value',
  new HttpResponse<Value>({body: new Value(10), status: 200, statusText: 'OK'})
));

@NgModule({
  imports: [
    HttpClientModule,
    FakeBackendModule.forRoot(fakeBackendRoutes)
  ],
  declarations: [
  ],
  bootstrap: []
})
export class AppModule {
}


```

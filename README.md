# ng-backendless

Fully featured, extensible and flexible Angular (4+) module for application backendless development.

## How to use

```typescript

import {NgModule} from '@angular/core';
import {HttpClientModule, HttpResponse} from '@angular/common/http';
import {FakeBackend, FakeBackendRoutesFactory, FakeBackendRoutes} from 'ng-backendless';

class Value {
  constructor(public val: number) {}
}

const fakeBackendRoutes: FakeBackendRoutes = FakeBackendRoutesFactory.empty();

fakeBackendRoutes.push(FakeBackendRoutesFactory.makeUrlRouter<Value>(
  '/api/value',
  new HttpResponse<Value>({body: new Value(10), status: 200, statusText: 'OK'})
));

@NgModule({
  imports: [
    HttpClientModule,
    FakeBackend.forRoot(fakeBackendRoutes)
  ],
  declarations: [
  ],
  bootstrap: []
})
export class AppModule {
}


```

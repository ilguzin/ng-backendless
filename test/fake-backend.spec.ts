import {HttpClient, HttpClientModule, HttpResponse} from '@angular/common/http';
import {TestBed, async, inject} from '@angular/core/testing';

import * as _ from 'lodash';

import {FakeBackendConfig, FakeBackendRoutesFactory, FakeBackendModule} from '../ng-backendless';


class Value {
  constructor(public id: number, public val: number) {
  }
}

const testValue1 = new Value(1, 10);
const testValue2 = new Value(2, 20);
const testValue3 = new Value(3, 30);
const testValues = [testValue1, testValue2, testValue3];

export function createFactory(elements: Array<any>, data: any) {
  const maxIdValue = _.maxBy<Value>(testValues, function(value) { return value.id; });
  const newValue = new Value(maxIdValue.id + 1, data.val);
  return newValue;
}

export function fakeBackendConfigFactory() {
  return <FakeBackendConfig>{
    routes: [
      FakeBackendRoutesFactory.makeSimpleUrlMatchEntityRouter<Value[]>('/api/values', testValues),
      FakeBackendRoutesFactory.makeCreateElementRoute<Value>('/api/values', testValues, createFactory),
      FakeBackendRoutesFactory.makeReadByParamsRoute<Value>('/api/values/:id', testValues),
      FakeBackendRoutesFactory.makeUpdateByParamsRoute('/api/values/:id', testValues),
      FakeBackendRoutesFactory.makeDeleteByParamsRoute('/api/values/:id', testValues)
    ]
  };
}

describe('FakeBackendModule tests', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientModule,
        FakeBackendModule.forRoot(fakeBackendConfigFactory)
      ]
    }).compileComponents();
  });

  it('should return list of values', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      httpClient.get<Value[]>('/api/values').subscribe((result: Value[]) => {
        expect(result.length).toBe(testValues.length);
        expect(result).toContain(testValue1);
        expect(result).toContain(testValue2);
      });

    })
  ));

  it('should return single value by id', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      httpClient.get<Value>('/api/values/' + testValue1.id).subscribe((result: Value) => {
        expect(result.id).toBe(testValue1.id);
        expect(result.val).toBe(testValue1.val);
      });

    })
  ));

  it('should return "Not found" error for look up by id', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      httpClient.get<Value>('/api/values/100', {observe: 'response'}).subscribe((response) => {
        expect(response.status).toBe(404);
      });
    })
  ));

  it('should delete single value by id', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      const initialLength = testValues.length;
      httpClient.delete<Value>('/api/values/' + testValue1.id).subscribe(() => {
        httpClient.get<Value[]>('/api/values').subscribe((result: Value[]) => {
          expect(result.length).toBe(initialLength - 1);
        });
      });
    })
  ));

  it('should return "Not found" error for delete by id', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      httpClient.delete<Value>('/api/values/100', {observe: 'response'}).subscribe((response) => {
        expect(response.status).toBe(404);
      });
    })
  ));

  it('should update single value by id', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      const newValue = 200;
      httpClient.put<Value>('/api/values/' + testValue3.id, {val: newValue}, {observe: 'response'}).subscribe((response) => {
        expect(response.status).toBe(200);
        httpClient.get<Value>('/api/values/' + testValue3.id).subscribe((result: Value) => {
          expect(result.val).toBe(newValue);
        });
      });
    })
  ));

  it('should return "Not found" if update unknown value by id', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      const newValue = 100;
      httpClient.put<Value>('/api/values/100', {val: newValue}, {observe: 'response'}).subscribe((response) => {
        expect(response.status).toBe(404);
      });
    })
  ));

  it('should successfully create new element', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      const newValue = 1234;
      httpClient.post<Value>('/api/values', {val: newValue}, {observe: 'response'}).subscribe((response: HttpResponse<Value>) => {
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testValue3.id + 1);
      });
    })
  ));

});

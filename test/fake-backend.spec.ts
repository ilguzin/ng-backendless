import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestBed, async, inject} from '@angular/core/testing';
import {FakeBackendRoutes} from '../src/core';
import {FakeBackendRoutesFactory} from '../src/routes';
import {FakeBackendModule} from '../src/fake-backend';

class Value {
  constructor(public id: number, public val: number) {}
}

const testValue1 = new Value(1, 10);
const testValue2 = new Value(1, 10);
const testValues = [testValue1, testValue2];

const fakeBackendRoutes: FakeBackendRoutes = FakeBackendRoutesFactory.empty();

fakeBackendRoutes.push(FakeBackendRoutesFactory.makeSimpleUrlMatchEntityRouter<Value[]>('/api/values', testValues));
fakeBackendRoutes.push(FakeBackendRoutesFactory.makeReadByParamsRoute<Value>('/api/values/:id', testValues));

describe('FakeBackendModule tests', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientModule,
        FakeBackendModule.forRoot(fakeBackendRoutes)
      ]
    }).compileComponents();
  });

  it('should return list of values', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      httpClient.get<Value[]>('/api/values').subscribe( (result: Value[]) => {
        expect(result.length).toBe(testValues.length);
        expect(result).toContain(testValue1);
        expect(result).toContain(testValue2);
      });

    })
  ));

  it('should return single value by id', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      httpClient.get<Value>('/api/values/' + testValue1.id).subscribe( (result: Value) => {
        expect(result).toBe(testValue1);
      });

    })
  ));

});

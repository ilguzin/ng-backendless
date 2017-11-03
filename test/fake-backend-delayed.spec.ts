import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TestBed, async, inject} from '@angular/core/testing';

import {FakeBackendConfig, FakeBackendRoutesFactory, FakeBackendModule} from '../ng-backendless';


const MOCK_ENTITY = [1, 2, 3];

const EMULATE_DELAY = 1000;

export function fakeBackendConfigFactory() {
  return <FakeBackendConfig>{
    routes: [
      FakeBackendRoutesFactory.makeSimpleUrlMatchEntityRouter<number[]>('/api/values', MOCK_ENTITY)
    ],
    emulateDelay: EMULATE_DELAY
  };
}

describe('FakeBackendModule delay emulation test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientModule,
        FakeBackendModule.forRoot(fakeBackendConfigFactory)
      ]
    }).compileComponents();
  });

  it('should return list of values in ' + EMULATE_DELAY + 'ms', async(
    inject([HttpClient], (httpClient: HttpClient) => {
      const startTime = Date.now();
      httpClient.get<number[]>('/api/values').subscribe((result: number[]) => {
        expect(result.length).toBe(MOCK_ENTITY.length);
        expect(EMULATE_DELAY).toBeLessThanOrEqual(Date.now() - startTime);
      });

    })
  ));

});

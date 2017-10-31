import {matchAndParseParamsFromUrl} from '../ng-backendless';

describe('helpers tests', () => {

  it('should unpack params from url string', () => {
    const result = matchAndParseParamsFromUrl('/api/elements/10', '/api/elements/:id');
    expect(result['id']).toBe('10');
  });

});

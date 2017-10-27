import {HttpResponse} from '@angular/common/http';

export const SUCCESS_RESPONSE = new HttpResponse({body: {}, status: 200, statusText: 'OK'});
export const ELEMENT_NOT_FOUND_ERROR_RESPONSE = new HttpResponse({status: 404, statusText: 'Not found'});

export function matchAndParseParamsFromUrl(url: string, urlSpec: string): { [param: string]: string; } {

  const PARAM_REGEXP = /^:([a-z0-9]+)/;

  const urlParts = url.split('/');
  const urlSpecParts = urlSpec.split('/');

  const match = urlSpecParts.reduce((memo, urlSpecPart, urlSpecPartIndex) => {
    return memo && (!!urlSpecPart.match(PARAM_REGEXP) || urlSpecPart === urlParts[urlSpecPartIndex]);
  }, true);

  let params: { [param: string]: string; } = null;

  if (match) {
    params = {};
    urlSpecParts.forEach((urlSpecPart, urlSpecPartIndex) => {
      const m = urlSpecPart.match(PARAM_REGEXP);
      if (m && m[1]) {
        params[m[1]] = urlParts[urlSpecPartIndex];
      }
    });
  }

  return params;
}

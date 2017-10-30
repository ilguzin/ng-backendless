export {matchAndParseParamsFromUrl, SUCCESS_RESPONSE, ELEMENT_NOT_FOUND_ERROR_RESPONSE} from './src/helpers';

export {FakeBackendRoute, FakeBackendConfig, FAKE_BACKEND_CONFIG, FakeBackendInterceptor} from './src/core';

export {
  UrlParamsParserRoute,
  SimpleUrlMatchRoute,
  CreateElementRoute,
  ReadElementByParamsRoute,
  UpdateElementByParamsRoute,
  DeleteElementByParamsRoute,
  FakeBackendRoutesFactory
} from './src/routes';

export {FakeBackendModule} from './src/fake-backend';

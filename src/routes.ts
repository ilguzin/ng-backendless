import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as _ from 'lodash';

import {FakeBackendRoute} from './core';
import {SUCCESS_RESPONSE, ELEMENT_NOT_FOUND_ERROR_RESPONSE, matchAndParseParamsFromUrl} from './helpers';

export abstract class UrlParamsParserRoute<T> implements FakeBackendRoute<T>, HttpHandler {

  constructor(protected urlSpec: string) {
  }

  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const params = matchAndParseParamsFromUrl(req.url, this.urlSpec);

    return params ? this.handle(req.clone({setParams: params})) : next.handle(req);
  }

  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<T>>;

}

export class SimpleUrlMatchRoute<T> implements FakeBackendRoute<T> {

  constructor(protected url: string, protected event: HttpResponse<T>) {
  }

  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<T>> {
    return req.method === 'GET' && req.url.endsWith(this.url) ?
      Observable.of(this.event.clone({body: _.cloneDeep(this.event.body)})) : next.handle(req);
  }

}

export class CreateElementRoute<T> extends UrlParamsParserRoute<T> {

  constructor(protected urlSpec: string, protected elements: T[],
              protected createFactory: (elements: T[], newData: any) => T) {
    super(urlSpec);
  }

  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Additional filer by POST method
    return req.method === 'POST' ? super.match(req, next) : next.handle(req);
  }

  handle(req: HttpRequest<any>): Observable<HttpResponse<T>> {
    const newElement = this.createFactory(this.elements, req.body);
    this.elements.push(newElement);
    return Observable.of(new HttpResponse<T>({body: _.cloneDeep(newElement), status: 200, statusText: 'OK'}));
  }

}

export class ReadElementByParamsRoute<T> extends UrlParamsParserRoute<T> {

  constructor(protected urlSpec: string, protected elements: T[]) {
    super(urlSpec);
  }

  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Additional filer by GET method
    return req.method === 'GET' ? super.match(req, next) : next.handle(req);
  }

  handle(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    const element: T = this.elements.find((elm: { [key: string]: any }) => {
      return req.params.keys().reduce((memo, paramKey) => memo && elm[paramKey].toString() === req.params.get(paramKey).toString(), true);
    });

    return element ?
      Observable.of(new HttpResponse<T>({body: _.cloneDeep(element), status: 200, statusText: 'OK'})) :
      Observable.of(ELEMENT_NOT_FOUND_ERROR_RESPONSE);
  }

}

export class UpdateElementByParamsRoute<T> extends UrlParamsParserRoute<T> {

  constructor(protected urlSpec: string, protected elements: T[]) {
    super(urlSpec);
  }

  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Additional filer by PUT method
    return req.method === 'PUT' ? super.match(req, next) : next.handle(req);
  }

  handle(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    const element: T = this.elements.find((elm: { [key: string]: any }) => {
      return req.params.keys().reduce((memo, paramKey) => memo && elm[paramKey].toString() === req.params.get(paramKey).toString(), true);
    });

    if (element) {
      Object.assign(element, _.cloneDeep(req.body));
      return Observable.of(SUCCESS_RESPONSE);
    } else {
      return Observable.of(ELEMENT_NOT_FOUND_ERROR_RESPONSE);
    }

  }

}

export class DeleteElementByParamsRoute<T> extends UrlParamsParserRoute<T> {

  constructor(protected urlSpec: string, protected elements: T[]) {
    super(urlSpec);
  }

  match(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Additional filer by DELETE method
    return req.method === 'DELETE' ? super.match(req, next) : next.handle(req);
  }

  handle(req: HttpRequest<any>): Observable<HttpResponse<any>> {
    const elementIndex = this.elements.findIndex((elm: { [key: string]: any }) => {
      return req.params.keys().reduce((memo, paramKey) => memo && elm[paramKey].toString() === req.params.get(paramKey).toString(), true);
    });
    if (elementIndex > -1) {
      this.elements.splice(elementIndex, 1);
      return Observable.of(SUCCESS_RESPONSE);
    } else {
      return Observable.of(ELEMENT_NOT_FOUND_ERROR_RESPONSE);
    }
  }

}

export class FakeBackendRoutesFactory {

  static makeSimpleUrlMatchRouter<T>(url: string, event: HttpResponse<T>): FakeBackendRoute<T> {
    return new SimpleUrlMatchRoute<T>(url, event);
  }

  static makeSimpleUrlMatchEntityRouter<T>(url: string, entity: T): FakeBackendRoute<T> {
    return new SimpleUrlMatchRoute<T>(url, new HttpResponse<T>({body: entity, status: 200, statusText: 'OK'}));
  }

  static makeCreateElementRoute<T>(urlSpec: string, elements: T[], createFactory: (elements: T[], newData: any) => T): FakeBackendRoute<T> {
    return new CreateElementRoute<T>(urlSpec, elements, createFactory);
  }

  static makeReadByParamsRoute<T>(urlSpec: string, elements: T[]): FakeBackendRoute<T> {
    return new ReadElementByParamsRoute<T>(urlSpec, elements);
  }

  static makeUpdateByParamsRoute(urlSpec: string, elements: any[]): FakeBackendRoute<any> {
    return new UpdateElementByParamsRoute(urlSpec, elements);
  }

  static makeDeleteByParamsRoute(urlSpec: string, elements: any[]): FakeBackendRoute<any> {
    return new DeleteElementByParamsRoute(urlSpec, elements);
  }

}

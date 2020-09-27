# rx-ajax

A basic utility wrapper for rxjs allowing you to make configuration presets.

[![CI](https://github.com/Alorel/rx-ajax/workflows/Core/badge.svg?branch=master)](https://github.com/Alorel/rx-ajax/actions?query=workflow%3ACore+branch%3Amaster+)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/rx-ajax/badge.svg?branch=master)](https://coveralls.io/github/Alorel/rx-ajax)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Alorel/rx-ajax.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Alorel/rx-ajax/context:javascript)

-----

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
  - [Extending an existing config](#extending-an-existing-config)
  - [Middleware](#middleware)
- [API](#api)
  - [RxAjaxErrorResponse](#rxajaxerrorresponse)
  - [RxAjaxOptions](#rxajaxoptions)
  - [RxAjaxResponse](#rxajaxresponse)
  - [RxAjax](#rxajax)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

Add the registry to `.npmrc`:

```bash
@alorel:registry=https://npm.pkg.github.com
```

Then install the library:

```bash
npm install rxjs@^6.0.0 @alorel/rx-ajax
```

# Usage

```javascript
import {rxAjax} from '@alorel/rx-ajax';
import {ajax} from 'rxjs/ajax';

const api = rxAjax({
  // Same options as regular rxjs ajax() plus some extras
  headers: {
    'content-type': 'text/json'
  },
  responseType: 'json'
});

api.post('/foo', {qux: 'baz'}, {timeout: 1, headers: {'x-foo': 'bar'}}).subscribe();
// Equivalent to:
ajax({
  body: {qux: 'baz'},
  headers: {
    'content-type': 'text/json',
    'x-foo': 'bar'
  },
  responseType: 'json',
  timeout: 1
}).subscribe();
```

## Extending an existing config

Each `RxAjax` instance has an `.extend()` method that allows you to make a copy with a merged config:

```javascript
api.extend({
  headers: {/*...*/}
})
```

## Middleware

`pre` middleware transforms the request, `post` middleware transforms a response. `preAsync` and `postAsync` do the
same, but return an `ObservableInput` instead.

```javascript
api.getJSON('/foo', {
  pre: [],
  preAsync: [],
  post: [],
  postAsync: []
})
```

Refer to the API for middleware function signatures.

# API

## RxAjaxErrorResponse

```typescript
export interface RxAjaxErrorResponse<T = any> extends Omit<AjaxError, 'request' | 'response'> {
    request: RxAjaxRequestOptions;
    response: T;
}
```

## RxAjaxOptions

```typescript
export declare type RxAjaxPostAsyncHook = <I = any, O extends I = any>(request: UnprocessedResponse<I>) => ObservableInput<UnprocessedResponse<O>>;

export declare type RxAjaxRequestOptions = Omit<RxAjaxOptions, 'url'>;

export declare type RxAjaxBodiedRequestOptions = Omit<RxAjaxRequestOptions, 'body'>;

export interface RxAjaxOptions extends Omit<AjaxRequest, 'headers'> {
    headers?: Obj<string>;
    /** Middleware for the response */
    post?: Arrayish<(<I = any, O extends I = any>(request: UnprocessedResponse<I>) => UnprocessedResponse<O>)>;
    /** Async middleware for the response */
    postAsync?: Arrayish<RxAjaxPostAsyncHook>;
    /** Middleware for the request */
    pre?: Arrayish<((req: RxAjaxOptions) => RxAjaxOptions)>;
    /** Async middleware for the request */
    preAsync?: Arrayish<((req: RxAjaxOptions) => ObservableInput<RxAjaxOptions>)>;
}
```

## RxAjaxResponse

```typescript
export interface RxAjaxResponse<T = any> extends Omit<AjaxResponse, 'response' | 'request'> {
    request: RxAjaxOptions;
    response: T;
}

/** Successful response */
export interface UnprocessedSuccessResponse<T> {
    ok: true;
    response: RxAjaxResponse<T>;
}
/** Unsuccessful response */
export interface UnprocessedErrorResponse<T = any> {
    ok: false;
    response: RxAjaxErrorResponse<T>;
}
export declare type UnprocessedResponse<T, E = any> = UnprocessedSuccessResponse<T> | UnprocessedErrorResponse<E>;
```

## RxAjax

```typescript
export interface RxAjax<BaseT = any> {
    /** Make a DELETE request */
    delete<T = BaseT>(url: string, opts?: RxAjaxRequestOptions): Observable<RxAjaxResponse<T>>;
    /**
     * Extend the current default configuration with the given options
     * @return a new {@link RxAjax} instance with the merged options
     */
    extend<T = any>(opts: RxAjaxOptions): RxAjax<T>;
    /** Make a GET request */
    get<T = BaseT>(url: string, opts?: RxAjaxRequestOptions): Observable<RxAjaxResponse<T>>;
    /** Make a GET request & set the responseType to "json" */
    getJSON<T = BaseT>(url: string, opts?: RxAjaxRequestOptions): Observable<RxAjaxResponse<T>>;
    /** Make a PATCH request */
    patch<T = BaseT>(url: string, body: any, opts?: RxAjaxBodiedRequestOptions): Observable<RxAjaxResponse<T>>;
    /** Make a POST request */
    post<T = BaseT>(url: string, body: any, opts?: RxAjaxBodiedRequestOptions): Observable<RxAjaxResponse<T>>;
    /** Make a PUT request */
    put<T = BaseT>(url: string, body: any, opts?: RxAjaxBodiedRequestOptions): Observable<RxAjaxResponse<T>>;
    /** Generic request function */ <T = BaseT>(urlOrRequest: string | RxAjaxOptions): Observable<RxAjaxResponse<T>>;
}

/** Create an rxjs.ajax wrapper with the given default options */
export declare function rxAjax<BaseT = any>(defaults?: RxAjaxOptions): RxAjax<BaseT>;
```

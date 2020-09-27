import type {Observable} from 'rxjs';
import {of, throwError} from 'rxjs';
import {AjaxError} from 'rxjs/ajax';
import {switchMap} from 'rxjs/operators';
import type {RxAjaxOptions} from '../types/Options';
import type {RxAjaxResponse, UnprocessedResponse} from '../types/Response';
import type {RxAjax} from '../types/RxAjax';
import {makeRequest} from './makeRequest';
import {merge} from './merge';
import {applyAsyncPreMiddleware} from './middleware/applyAsyncPreMiddleware';
import {applyPostAsyncMiddleware} from './middleware/applyPostAsyncMiddleware';
import {applyPostMiddleware} from './middleware/applyPostMiddleware';
import {applyPreMiddleware} from './middleware/applyPreMiddleware';

function unwrapResponse<T>({ok, response}: UnprocessedResponse<T>): Observable<RxAjaxResponse<T>> {
  if (ok) {
    return of(response as RxAjaxResponse<T>);
  }

  if (!(response instanceof AjaxError)) {
    Object.setPrototypeOf(response, AjaxError.prototype);
  }

  return throwError(response);
}

function innerExecutor<T>(mergedOpts: RxAjaxOptions): Observable<RxAjaxResponse<T>> {
  let opts = mergedOpts;
  opts = applyPreMiddleware(opts);
  const asyncPre = applyAsyncPreMiddleware(opts);
  let req$: Observable<UnprocessedResponse<any>> = asyncPre ?
    asyncPre.pipe(switchMap(makeRequest)) :
    makeRequest(opts);

  if (opts.post?.length) {
    req$ = req$.pipe(applyPostMiddleware(opts.post));
  }

  if (opts.postAsync?.length) {
    req$ = req$.pipe(applyPostAsyncMiddleware(opts.postAsync));
  }

  return req$.pipe(switchMap(unwrapResponse));
}

function makeBodyMethod(
  method: string,
  executor: (req: RxAjaxOptions) => Observable<RxAjaxResponse>
): RxAjax['post'] {
  return function rxAjaxBodyMethodExecutor(url, body, opts) {
    return executor({...opts, body, method, url});
  };
}

type Props = 'delete' | 'get' | 'getJSON' | 'patch' | 'post' | 'put' | 'extend';

/** Create an rxjs.ajax wrapper with the given default options */
export function rxAjax<BaseT = any>(defaults: RxAjaxOptions = {}): RxAjax<BaseT> {
  function rxAjaxExecutor<T = BaseT>(urlOrRequest: string | RxAjaxOptions): Observable<RxAjaxResponse<T>> {
    const mergeableOptions: RxAjaxOptions = typeof urlOrRequest === 'string' ? {url: urlOrRequest} : urlOrRequest;

    return innerExecutor(merge(defaults, mergeableOptions));
  }

  const ext: Pick<RxAjax<BaseT>, Props> = {
    delete(url, opts) {
      return rxAjaxExecutor({...opts, method: 'DELETE', url});
    },
    extend(opts) {
      return rxAjax(merge(defaults, opts));
    },
    get(url, opts) {
      return rxAjaxExecutor({...opts, method: 'GET', url});
    },
    getJSON(url, opts) {
      return rxAjaxExecutor({
        ...opts,
        method: 'GET',
        responseType: 'json',
        url
      });
    },
    patch: makeBodyMethod('PATCH', rxAjaxExecutor),
    post: makeBodyMethod('POST', rxAjaxExecutor),
    put: makeBodyMethod('PUT', rxAjaxExecutor)
  };

  return Object.assign(rxAjaxExecutor, ext);
}

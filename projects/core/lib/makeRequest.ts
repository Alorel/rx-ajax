import type {Observable} from 'rxjs';
import {of} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {catchError, map} from 'rxjs/operators';
import type {RxAjaxErrorResponse} from '../types/Error';
import type {RxAjaxOptions} from '../types/Options';
import type {
  RxAjaxResponse,
  UnprocessedErrorResponse,
  UnprocessedResponse,
  UnprocessedSuccessResponse
} from '../types/Response';

/** @internal */
export function makeRequest<T>(mergedOpts: RxAjaxOptions): Observable<UnprocessedResponse<T>> {
  return ajax(mergedOpts).pipe(
    map((response): UnprocessedSuccessResponse<T> => ({ok: true, response: response as RxAjaxResponse<T>})),
    catchError((response: RxAjaxErrorResponse): Observable<UnprocessedErrorResponse> => of({ok: false, response}))
  );
}

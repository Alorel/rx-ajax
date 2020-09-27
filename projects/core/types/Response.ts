import type {AjaxResponse} from 'rxjs/ajax';
import type {RxAjaxErrorResponse} from './Error';
import type {RxAjaxOptions} from './Options';

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

export type UnprocessedResponse<T, E = any> = UnprocessedSuccessResponse<T> | UnprocessedErrorResponse<E>;

export interface RxAjaxResponse<T = any> extends Omit<AjaxResponse, 'response' | 'request'> {
  request: RxAjaxOptions;

  response: T;
}

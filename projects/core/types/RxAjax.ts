import type {Observable} from 'rxjs';
import type {RxAjaxBodiedRequestOptions, RxAjaxOptions, RxAjaxRequestOptions} from './Options';
import type {RxAjaxResponse} from './Response';

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

  /** Generic request function */
  <T = BaseT>(urlOrRequest?: string | RxAjaxOptions): Observable<RxAjaxResponse<T>>;
}

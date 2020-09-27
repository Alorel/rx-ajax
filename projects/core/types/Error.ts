import type {AjaxError} from 'rxjs/ajax';
import type {RxAjaxRequestOptions} from './Options';

export interface RxAjaxErrorResponse<T = any> extends Omit<AjaxError, 'request' | 'response'> {
  request: RxAjaxRequestOptions;

  response: T;
}

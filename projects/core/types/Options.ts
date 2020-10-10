import type {Arrayish} from '@alorel/commons-array-types';
import type {Obj} from '@alorel/commons-obj';
import type {ObservableInput} from 'rxjs';
import type {AjaxRequest} from 'rxjs/ajax';
import type {UnprocessedResponse} from './Response';

export type RxAjaxPostAsyncHook = <I = any, O extends I = any>(request: UnprocessedResponse<I>)
  => ObservableInput<UnprocessedResponse<O>>;

export interface RxAjaxOptions extends Omit<AjaxRequest, 'headers'> {
  headers?: Obj<string>;

  /** Middleware for the response */
  post?: Arrayish<(<I = any, O extends I = any>(response: UnprocessedResponse<I>) => UnprocessedResponse<O>)>;

  /** Async middleware for the response */
  postAsync?: Arrayish<RxAjaxPostAsyncHook>;

  /** Middleware for the request */
  pre?: Arrayish<((req: RxAjaxOptions) => RxAjaxOptions)>;

  /** Async middleware for the request */
  preAsync?: Arrayish<((req: RxAjaxOptions) => ObservableInput<RxAjaxOptions>)>;
}

export type RxAjaxRequestOptions = Omit<RxAjaxOptions, 'url'>;
export type RxAjaxBodiedRequestOptions = Omit<RxAjaxRequestOptions, 'body'>

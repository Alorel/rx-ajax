import type {MonoTypeOperatorFunction} from 'rxjs';
import {map} from 'rxjs/operators';
import type {RxAjaxOptions} from '../../types/Options';
import type {UnprocessedResponse} from '../../types/Response';

/** @internal */
export function applyPostMiddleware<T>(
  middleware: Required<RxAjaxOptions>['post']
): MonoTypeOperatorFunction<UnprocessedResponse<T>> {
  return map(
    function applyPostMiddlewareExecutor(rsp: UnprocessedResponse<T>): UnprocessedResponse<T> {
      let out = rsp;
      for (let i = 0; i < middleware.length; i++) {
        out = middleware[i](out);
      }

      return out;
    }
  );
}

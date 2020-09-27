import type {MonoTypeOperatorFunction as MonoOp} from 'rxjs';
import {pipe} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import type {RxAjaxOptions} from '../../types/Options';
import type {RxAjaxPostAsyncHook} from '../../types/Options';
import type {UnprocessedResponse} from '../../types/Response';

/** @internal */
export function applyPostAsyncMiddleware(
  middleware: Required<RxAjaxOptions>['postAsync']
): MonoOp<UnprocessedResponse<any>> {
  const pipes = (middleware as RxAjaxPostAsyncHook[])
    .map((mid): MonoOp<UnprocessedResponse<any>> => switchMap(mid));

  return pipe.apply(null, pipes as any[]) as MonoOp<UnprocessedResponse<any>>; // eslint-disable-line prefer-spread
}

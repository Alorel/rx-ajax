import type {MonoTypeOperatorFunction as MonoOp, Observable} from 'rxjs';
import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import type {RxAjaxOptions, RxAjaxPostAsyncHook} from '../../types/Options';

/** @internal */
export function applyAsyncPreMiddleware(opts: RxAjaxOptions): null | Observable<RxAjaxOptions> {
  const preAsync = opts.preAsync;
  if (!preAsync?.length) {
    return null;
  }

  const src$ = of(opts);
  const args: Array<MonoOp<any>> = (preAsync as RxAjaxPostAsyncHook[])
    .map(switchMap);

  return src$.pipe.apply(src$, args); // eslint-disable-line prefer-spread
}

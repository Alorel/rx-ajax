import type {RxAjaxOptions} from '../../types/Options';

/** @internal */
export function applyPreMiddleware(opts: RxAjaxOptions): RxAjaxOptions {
  const pre = opts.pre;
  if (!pre?.length) {
    return opts;
  }

  let out = opts;
  for (let i = 0; i < pre.length; i++) {
    out = pre[i](out);
  }

  return out;
}

import type {Arrayish} from '@alorel/commons-array-types';
import type {RxAjaxOptions} from '../types/Options';

function mergeArrays<T>(defaults: Arrayish<T> | undefined, custom: Arrayish<T> | undefined): Arrayish<T> | null {
  if (!defaults && !custom) {
    return null;
  } else if (defaults && !custom) {
    return defaults;
  } else if (custom && !defaults) {
    return custom;
  }

  return Array.from(new Set(defaults!.concat(custom!)));
}

function mergeProp<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  defaults: T[K] & Arrayish<any> | undefined,
  custom: T[K] & Arrayish<any> | undefined
): void {
  const merged = mergeArrays(defaults, custom);
  if (merged) {
    obj[key] = merged as unknown as T[K];
  }
}

/** @internal */
export function merge(defaults: RxAjaxOptions, custom: RxAjaxOptions): RxAjaxOptions {
  const {
    pre: preCustom,
    preAsync: preCustomAsync,
    post: postCustom,
    postAsync: postCustomAsync,
    headers: headersCustom,
    ...restCustom
  } = custom;

  const out: RxAjaxOptions = {...defaults, ...restCustom};
  if (headersCustom) {
    out.headers = {
      ...out.headers,
      ...headersCustom
    };
  }
  mergeProp(out, 'pre', defaults.pre, preCustom);
  mergeProp(out, 'preAsync', defaults.preAsync, preCustomAsync);
  mergeProp(out, 'post', defaults.post, postCustom);
  mergeProp(out, 'postAsync', defaults.postAsync, postCustomAsync);

  return out;
}

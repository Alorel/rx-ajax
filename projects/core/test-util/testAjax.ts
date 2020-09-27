import {JSDOM} from 'jsdom';
import {rxAjax} from '../lib/rxAjax';
import type {RxAjaxOptions} from '../types/Options';

const {window: {XMLHttpRequest}} = new JSDOM('');

export const testAjaxOpts: RxAjaxOptions = {
  createXHR: () => new XMLHttpRequest(),
  headers: {'content-type': 'application/json'}
};
export const testAjax = rxAjax(testAjaxOpts);

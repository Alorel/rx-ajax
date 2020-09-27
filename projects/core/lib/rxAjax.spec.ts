import type {Obj} from '@alorel/commons-obj';
import * as chai from 'chai';
import * as promiseChai from 'chai-as-promised';
import type {Mockttp} from 'mockttp';
import type {Observable} from 'rxjs';
import {of} from 'rxjs';
import {RSP_HEADERS, setUpMockServer, setUpRequestDebugger} from '../test-util/MockServer';
import {testAjax} from '../test-util/testAjax';
import type {RxAjaxOptions} from '../types/Options';
import type {RxAjaxResponse, UnprocessedResponse} from '../types/Response';
import type {RxAjax} from '../types/RxAjax';

/* eslint-disable @typescript-eslint/no-magic-numbers */

describe('rxAjax', function () {
  const expect = chai.use(promiseChai).expect;

  describe('middleware', () => {
    let server: Mockttp;
    setUpMockServer(true, v => (server = v));
    before(setUpRequestDebugger(() => server));

    it('Should apply middleware', async () => {
      const url = server.urlFor('/test-middleware');
      const ob$ = testAjax.getJSON(url, {
        post: [
          (rsp): UnprocessedResponse<any> => ({
            ...rsp,
            response: {
              ...rsp.response,
              customProp: 'is-set'
            } as unknown as any
          })
        ],
        postAsync: [
          (rsp: UnprocessedResponse<any>) => of<UnprocessedResponse<any>>({
            ...rsp,
            ok: true,
            response: {
              ...rsp.response,
              status: 420
            } as unknown as RxAjaxResponse
          })
        ],
        pre: [
          (req): RxAjaxOptions => ({
            ...req,
            headers: {
              ...req.body,
              'content-type': 'potatoes'
            }
          })
        ],
        preAsync: [
          (req): Observable<RxAjaxOptions> => of({
            ...req,
            method: 'DELETE'
          })
        ]
      });

      const rsp$ = (await ob$.toPromise()) as RxAjaxResponse & Obj;
      const {response: {method, headers}, status, customProp} = rsp$;


      expect(status).to.eq(420, 'Status');
      expect(method).to.eq('DELETE', 'method');
      expect(headers['content-type']).to.eq('potatoes', 'sent headers');
      expect(customProp).to.eq('is-set', 'customProp');

      return {headers, method, status};
    });
  });

  describe('request methods', () => {
    let server: Mockttp;
    setUpMockServer(true, v => (server = v));
    before(setUpRequestDebugger(() => server));

    const bodyMethods: Array<keyof RxAjax> = ['patch', 'post', 'put'];
    const nonBodymethods: Array<keyof RxAjax> = ['get', 'delete'];

    for (const meth of bodyMethods) {
      it(`Should make ${meth.toUpperCase()} requests`, async () => {
        const url = server.urlFor(`/meth-${meth}`);
        const body = {[Math.random().toString()]: Math.random()};
        const p$: Promise<RxAjaxResponse> = testAjax[meth as 'post'].call(null, url, body).toPromise();
        const {response: rsp} = await p$;

        expect(rsp.method).to.eq(meth.toUpperCase(), 'Method');
        expect(rsp.path).to.eq(`/meth-${meth}`, 'Path');
        expect(rsp.body.json).to.deep.eq(body);
      });
    }

    for (const meth of nonBodymethods) {
      it(`Should make ${meth.toUpperCase()} requests`, async () => {
        const url = server.urlFor(`/meth-${meth}`);
        const p$: Promise<RxAjaxResponse> = testAjax[meth as 'get'].call(null, url).toPromise();
        const {response: rsp} = await p$;

        expect(rsp.method).to.eq(meth.toUpperCase(), 'Method');
        expect(rsp.path).to.eq(`/meth-${meth}`, 'Path');
      });
    }
  });

  describe('extend', () => {
    let server: Mockttp;
    setUpMockServer(true, v => (server = v));

    it('Should extend settings', async () => {
      const b = testAjax.extend({method: 'delete', url: '/delete'});

      await server.anyRequest()
        .thenCallback(req => {
          if (req.path === '/delete' && ['OPTIONS', 'DELETE'].includes(req.method)) {
            return {
              headers: RSP_HEADERS,
              status: 200
            };
          }

          return {status: 404};
        });

      await b(server.urlFor('/delete')).toPromise();

      expect(1).to.eq(1);
    });
  });

});

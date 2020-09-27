import {expect} from 'chai';
import type {Mockttp} from 'mockttp';
import {RSP_HEADERS, setUpMockServer} from '../test-util/MockServer';
import {testAjaxOpts} from '../test-util/testAjax';
import type {UnprocessedResponse} from '../types/Response';
import {makeRequest} from './makeRequest';

/* eslint-disable @typescript-eslint/no-magic-numbers */

describe('makeRequest', function () {

  describe('Successful response', () => {
    let server: Mockttp;
    let url: string;
    let rsp: UnprocessedResponse<any>;

    setUpMockServer(true, v => (server = v));
    before(async () => {
      await server.get('/success').thenJson(200, {su: 'ccess'}, RSP_HEADERS);
      url = server.urlFor('/success');
      rsp = await makeRequest<any>({...testAjaxOpts, preAsync: [], url}).toPromise();
    });

    it('Ok should be true', () => {
      expect(rsp.ok).to.eq(true);
    });

    it('Original request should contain custom props', () => {
      expect(rsp.response.request).to.haveOwnProperty('preAsync');
    });

    it('Should have json response', () => {
      expect(rsp.response.response).to.deep.eq({su: 'ccess'});
    });
  });

  describe('Error response', () => {
    let server: Mockttp;
    let url: string;
    let rsp: UnprocessedResponse<any>;

    setUpMockServer(true, v => (server = v));
    before(async () => {
      await server.get('/fail').thenJson(420, {fai: 'lure'}, RSP_HEADERS);
      url = server.urlFor('/fail');
      rsp = await makeRequest<any>({...testAjaxOpts, postAsync: [], url}).toPromise();
    });

    it('Ok should be true', () => {
      expect(rsp.ok).to.eq(false);
    });

    it('Original request should contain custom props', () => {
      expect(rsp.response.request).to.haveOwnProperty('postAsync');
    });

    it('Should have json response', () => {
      expect(rsp.response.response).to.deep.eq({fai: 'lure'});
    });
  });
});

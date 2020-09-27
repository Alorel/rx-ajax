import {expect} from 'chai';
import {identity, noop, of} from 'rxjs';
import type {RxAjaxOptions as Opt} from '../types/Options';
import {merge} from './merge';

/* eslint-disable @typescript-eslint/no-magic-numbers */

describe('merge', function () {
  describe('headers', () => {
    it('Should omit if absent in both defaults and custom', () => {
      const d: Opt = {url: '/foo'};
      const c: Opt = {withCredentials: true};
      expect(merge(d, c)).to.deep.eq({url: '/foo', withCredentials: true});
    });

    it('Should merge if it has custom headers', () => {
      const d: Opt = {headers: {foo: 'bar'}};
      const c: Opt = {headers: {qux: 'baz'}};
      expect(merge(d, c)).to.deep.eq({headers: {foo: 'bar', qux: 'baz'}});
    });

    it('Shouldn\'t change reference of using defaults', () => {
      const d: Opt = {headers: {}};
      const c: Opt = {url: '/'};
      expect(merge(d, c).headers).to.eq(d.headers);
    });
  });

  describe('arrays', () => {
    it('Should omit if absent on both', () => {
      expect(merge({}, {})).to.deep.eq({});
    });

    it('Should reuse default instance', () => {
      const d: Opt = {pre: [identity]};
      expect(merge(d, {}).pre).to.eq(d.pre);
    });

    it('Should reuse custom instance', () => {
      const d: Opt = {post: [identity as any]};
      expect(merge({}, d).post).to.eq(d.post);
    });

    it('Should concat and dedupe', () => {
      const d: Opt = {postAsync: [identity, noop] as any[]};
      const c: Opt = {postAsync: [noop, of] as any[]};
      const {postAsync} = merge(d, c);

      expect(postAsync).to.have.lengthOf(3, 'length');
      expect(postAsync![0]).to.eq(identity, '[identity]');
      expect(postAsync![1]).to.eq(noop, '[noop]');
      expect(postAsync![2]).to.eq(of, '[of]');
    });
  });
});

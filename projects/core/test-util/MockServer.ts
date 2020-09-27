import type {MockedEndpoint, Mockttp} from 'mockttp';
import {getLocal} from 'mockttp';

export const RSP_HEADERS = {'access-control-allow-origin': '*'};

export function setUpMockServer(once: boolean, setter: (v: Mockttp) => void): void {
  let server: Mockttp = null as any;
  const bf = async () => {
    server = getLocal();
    await server.start();
    setter(server);
  };
  const af = () => {
    const stop$ = server?.stop();
    setter(server = null as any);

    return stop$;
  };

  if (once) {
    before(bf);
    after(af);
  } else {
    beforeEach(bf);
    afterEach(af);
  }
}

export function setUpRequestDebugger(getServer: () => Mockttp): () => Promise<MockedEndpoint> {
  return () => getServer().anyRequest()
    .thenCallback(({method, path, headers, body}) => ({
      body: JSON.stringify({body, headers, method, path}),
      headers: {
        ...RSP_HEADERS,
        'content-type': 'application/json'
      },
      status: 200
    }));
}

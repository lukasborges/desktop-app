import {
  SDK,
  session,
} from '@getstation/sdk';
import memoizee = require('memoizee');

const requiredCookiesForAuthenticatedUser = ['token_v2', 'userId'];

const optsForMemoizedCookies: memoizee.Options<(...args: any[]) => any> = {
  maxAge: 10000,
  promise: true,
  preFetch: true,
};

export const isLogged = memoizee(
  async (sdk: SDK) =>
    (await cookies(sdk)).map((c: session.Cookie) => c.name)
      .includes(requiredCookiesForAuthenticatedUser[0]),
  optsForMemoizedCookies
);

export const authCookies = memoizee(
  async (sdk: SDK) =>
    (await cookies(sdk))
      .filter((c: session.Cookie) => requiredCookiesForAuthenticatedUser.includes(c.name))
      .map((c: session.Cookie) => `${c.name}=${c.value};`)
      .join(' '),
  optsForMemoizedCookies
);

const cookies = memoizee(
  async (sdk: SDK): Promise<session.Cookie[]> =>
    await sdk.session.getCookies(),
  optsForMemoizedCookies
);

import UrlRouter from '../../../src/urlrouter/URLRouter';
import {
  isMicrosoftTeamsMeetingUrl,
  unwrapGoogleRedirectUrl,
} from '../../../src/utils/applicationLinks';

const fakeState = {};
const fakeManifestProvider = {};

describe('Url Router', () => {
  describe('Compare URL & scope(s)', () => {
    it('should match an identical URL and a scope', async () => {
      const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
      const url = 'https://correct.test';
      const scopes = ['https://correct.test'];

      const actual = urlRouter.searchScopes(url, scopes);
      expect(actual).toBeTruthy();
    });

    it('should not match a different URL and scopes', async () => {
      const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
      const url = 'https://correct.test';
      const scopes = ['https://wrong.test'];

      const actual = urlRouter.searchScopes(url, scopes);
      expect(actual).toBeFalsy();
    });

    it('should match an URL and a scope among many available scopes', () => {
      const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
      const url = 'https://correct.test';
      const scopes = ['http://bad.test', 'https://correct.test', 'https://not-the-same.test'];

      const actual = urlRouter.searchScopes(url, scopes);
      expect(actual).toBeTruthy();
    });

    describe('Subdomains and wildcards', () => {
      it('should match an URL with subdomain when a scope has a wildcard', async () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://hello.correct.test';
        const scopes = ['https://*.correct.test'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeTruthy();
      });

      it('should not match an URL without subdomain when scope has a wildcard', async () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://correct.test';
        const scopes = ['https://*.correct.test'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeFalsy();
      });
    });

    describe('Pathnames', () => {
      it('should match an URL with any pathname when the scope has none', () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://something.test/a/n/y';
        const scopes = ['https://something.test'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeTruthy();
      });

      it('should match an URL with a pathname covered by the scope pathname', () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://correct.test/a/b/c';
        const scopes = ['https://correct.test/a'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeTruthy();
      });

      it('should not match an URL with a pathname outside of the scope pathname', () => {
        const urlRouter = new UrlRouter(fakeState, fakeManifestProvider);
        const url = 'https://something.test/a/c/d/e';
        const scopes = ['https://something.test/a/b'];

        const actual = urlRouter.searchScopes(url, scopes);
        expect(actual).toBeFalsy();
      });
    });
  });
});

describe('Application deep links', () => {
  it('recognizes Microsoft Teams meeting URLs without matching lookalike hosts', () => {
    expect(isMicrosoftTeamsMeetingUrl(
      'https://teams.live.com/meet/9383241103607?p=l8i9Mb63rHfWWzfwn0'
    )).toBe(true);
    expect(isMicrosoftTeamsMeetingUrl(
      'https://teams.microsoft.com/l/meetup-join/example'
    )).toBe(true);
    expect(isMicrosoftTeamsMeetingUrl('https://teams.live.com/')).toBe(false);
    expect(isMicrosoftTeamsMeetingUrl(
      'https://teams.live.com.evil.example/meet/9383241103607'
    )).toBe(false);
    expect(isMicrosoftTeamsMeetingUrl('not a URL')).toBe(false);
  });

  it('unwraps Google redirect URLs before routing', () => {
    const teamsUrl = 'https://teams.live.com/meet/9383241103607?p=l8i9Mb63rHfWWzfwn0';
    const googleUrl = `https://www.google.com/url?q=${encodeURIComponent(teamsUrl)}`;

    expect(unwrapGoogleRedirectUrl(googleUrl)).toBe(teamsUrl);
    expect(isMicrosoftTeamsMeetingUrl(unwrapGoogleRedirectUrl(googleUrl))).toBe(true);
  });

  it('unwraps Google redirects for any catalog application', () => {
    const zoomUrl = 'https://zoom.us/j/123456789';
    const googleUrl = `https://www.google.com/url?url=${encodeURIComponent(zoomUrl)}`;

    expect(unwrapGoogleRedirectUrl(googleUrl)).toBe(zoomUrl);
  });

  it('does not unwrap lookalike hosts or unsafe protocols', () => {
    const lookalike = 'https://www.google.com.evil.example/url?q=https://teams.live.com/meet/123';
    const unsafe = 'https://www.google.com/url?q=javascript%3Aalert(1)';

    expect(unwrapGoogleRedirectUrl(lookalike)).toBe(lookalike);
    expect(unwrapGoogleRedirectUrl(unsafe)).toBe(unsafe);
  });
});

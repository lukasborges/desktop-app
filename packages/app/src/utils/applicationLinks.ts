export const isMicrosoftTeamsMeetingUrl = (rawUrl: string): boolean => {
  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname.toLowerCase();

    return url.protocol === 'https:'
      && (
        (hostname === 'teams.live.com' && url.pathname.startsWith('/meet/'))
        || (hostname === 'teams.microsoft.com'
          && (url.pathname.startsWith('/meet/') || url.pathname.startsWith('/l/meetup-join/')))
      );
  } catch (_error) {
    return false;
  }
};

export const unwrapGoogleRedirectUrl = (rawUrl: string): string => {
  try {
    const url = new URL(rawUrl);
    const isGoogleRedirect = url.protocol === 'https:'
      && (url.hostname === 'www.google.com' || url.hostname === 'google.com')
      && url.pathname === '/url';

    if (!isGoogleRedirect) return rawUrl;

    const target = url.searchParams.get('q') || url.searchParams.get('url');
    if (!target) return rawUrl;

    const targetUrl = new URL(target);
    return targetUrl.protocol === 'https:' || targetUrl.protocol === 'http:'
      ? targetUrl.toString()
      : rawUrl;
  } catch (_error) {
    return rawUrl;
  }
};

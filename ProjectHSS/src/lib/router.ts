import { useEffect, useState, useCallback } from 'react';

export interface RouteState {
  path: string;
  query: URLSearchParams;
}

function parseLocation(): RouteState {
  const path = window.location.pathname || '/';
  const queryString = window.location.search.replace(/^\?/, '');
  return {
    path: path || '/',
    query: new URLSearchParams(queryString || ''),
  };
}

function cleanTrackingParams(query: URLSearchParams): URLSearchParams {
  const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const cleaned = new URLSearchParams(query);
  for (const key of trackingKeys) cleaned.delete(key);
  return cleaned;
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(() => {
    const initial = parseLocation();
    const cleanedQuery = cleanTrackingParams(initial.query);
    if (cleanedQuery.toString() !== initial.query.toString()) {
      const cleanUrl = initial.path + (cleanedQuery.toString() ? '?' + cleanedQuery.toString() : '');
      window.history.replaceState(null, '', cleanUrl);
      return { path: initial.path, query: cleanedQuery };
    }
    return initial;
  });

  useEffect(() => {
    const onChange = () => {
      const loc = parseLocation();
      const cleaned = cleanTrackingParams(loc.query);
      if (cleaned.toString() !== loc.query.toString()) {
        const cleanUrl = loc.path + (cleaned.toString() ? '?' + cleaned.toString() : '');
        window.history.replaceState(null, '', cleanUrl);
      }
      setRoute({ path: loc.path, query: cleaned });
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('#')) to = to.slice(1);
    if (to === route.path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState(null, '', to);
    setRoute({ path: to, query: new URLSearchParams() });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route.path]);

  return { route, navigate };
}

export function matchRoute(path: string, pattern: string): Record<string, string> | null {
  const pathParts = path.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

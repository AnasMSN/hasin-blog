import { getRelativeLocaleUrl } from 'astro:i18n';
import { ui, defaultLang, type Lang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang && maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export const routes = {
  home: '/',
  portfolio: '/portfolio',
  blog: '/blog',
} as const;

export type RouteKey = keyof typeof routes;

export function getLocalizedRoute(lang: Lang, route: RouteKey): string {
  return getRelativeLocaleUrl(lang, routes[route]);
}

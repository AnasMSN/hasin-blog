import type { Lang } from '../../i18n/ui';
import type { CVData } from './types';
import { cv as en } from './en';
import { cv as ko } from './ko';
import { cv as id } from './id';

const cvByLang: Record<Lang, CVData> = { en, ko, id };

export function getCV(lang: Lang): CVData {
  return cvByLang[lang];
}

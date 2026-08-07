import type { Lang } from '../../i18n/ui';
import type { PortfolioData } from './types';
import { portfolio as en } from './en';
import { portfolio as ko } from './ko';
import { portfolio as id } from './id';

const portfolioByLang: Record<Lang, PortfolioData> = { en, ko, id };

export function getPortfolio(lang: Lang): PortfolioData {
  return portfolioByLang[lang];
}

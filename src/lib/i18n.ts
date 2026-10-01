import { en } from '../content/en';
import { pt } from '../content/pt';
import type { CV, Locale } from '../content/types';

export const LOCALES = ['pt', 'en'] as const satisfies readonly Locale[];

export const content: Record<Locale, CV> = { pt, en };

export const paths: Record<Locale, string> = { pt: '/', en: '/en/' };

export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

export const ogLocale: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US' };

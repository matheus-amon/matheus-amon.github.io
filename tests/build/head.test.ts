import { describe, expect, test } from 'bun:test';
import { PAGE_KEYS, readPage } from './helpers';

const SITE = 'https://matheus-amon.github.io';
const expected = {
  pt: {
    lang: 'pt-BR',
    canonical: `${SITE}/`,
    title: 'Matheus Amon · Engenheiro de Software, Dados e IA',
    ogLocale: 'pt_BR',
    current: 'PT',
    other: { href: '/en/', label: 'EN' },
  },
  en: {
    lang: 'en',
    canonical: `${SITE}/en/`,
    title: 'Matheus Amon · Software Engineer, Data &amp; AI',
    ogLocale: 'en_US',
    current: 'EN',
    other: { href: '/', label: 'PT' },
  },
} as const;

describe.each(PAGE_KEYS)('head (%s)', (key) => {
  const html = readPage(key);
  const exp = expected[key];

  test('lang, title e description', () => {
    expect(html).toContain(`<html lang="${exp.lang}"`);
    expect(html).toContain(`<title>${exp.title}</title>`);
    expect(html).toMatch(/<meta name="description" content="[^"]{40,}"/);
  });

  test('canonical e hreflang', () => {
    expect(html).toContain(`<link rel="canonical" href="${exp.canonical}"`);
    expect(html).toContain(`<link rel="alternate" hreflang="pt-BR" href="${SITE}/"`);
    expect(html).toContain(`<link rel="alternate" hreflang="en" href="${SITE}/en/"`);
    expect(html).toContain(`<link rel="alternate" hreflang="x-default" href="${SITE}/"`);
  });

  test('Open Graph com URL absoluta', () => {
    expect(html).toContain(`<meta property="og:image" content="${SITE}/og-${key}.png"`);
    expect(html).toContain(`<meta property="og:url" content="${exp.canonical}"`);
    expect(html).toContain(`<meta property="og:locale" content="${exp.ogLocale}"`);
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
  });

  test('JSON-LD válido com Person e sem telefone', () => {
    const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    expect(raw).toBeDefined();
    const ld = JSON.parse(raw!);
    const person = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'Person');
    expect(person.name).toBe('Matheus Amon Marçal');
    expect(raw).not.toContain('telephone');
  });

  test('botão de idioma: atual marcado, outro é link', () => {
    expect(html).toMatch(new RegExp(`<a [^>]*aria-current="page"[^>]*>${exp.current}</a>`));
    expect(html).toMatch(new RegExp(`<a [^>]*href="${exp.other.href}"[^>]*>${exp.other.label}</a>`));
  });

  test('skip link e favicon', () => {
    expect(html).toContain('href="#main"');
    expect(html).toContain('href="/favicon.svg"');
  });
});

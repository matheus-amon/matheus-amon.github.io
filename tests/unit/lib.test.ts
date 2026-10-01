import { describe, expect, test } from 'bun:test';
import { en } from '../../src/content/en';
import { pt } from '../../src/content/pt';
import { htmlLang, paths } from '../../src/lib/i18n';
import { personJsonLd, serializeJsonLd } from '../../src/lib/seo';
import { timelineProgress } from '../../src/lib/timeline';
import { withBase } from '../../src/lib/url';
import { escapeXml, wrapText } from '../../src/lib/xml';

describe('withBase', () => {
  test('base raiz', () => {
    expect(withBase('/', '/')).toBe('/');
    expect(withBase('/en/', '/')).toBe('/en/');
    expect(withBase('/cv-pt.pdf', '/')).toBe('/cv-pt.pdf');
  });

  test('repositório com outro nome', () => {
    expect(withBase('/en/', '/cv')).toBe('/cv/en/');
    expect(withBase('/cv-pt.pdf', '/cv/')).toBe('/cv/cv-pt.pdf');
    expect(withBase('favicon.svg', '/cv/')).toBe('/cv/favicon.svg');
  });
});

describe('i18n', () => {
  test('rotas e idiomas', () => {
    expect(paths).toEqual({ pt: '/', en: '/en/' });
    expect(htmlLang).toEqual({ pt: 'pt-BR', en: 'en' });
  });
});

describe('personJsonLd', () => {
  const url = 'https://matheus-amon.github.io/';
  const img = 'https://matheus-amon.github.io/og-pt.png';
  const ld = personJsonLd(pt, url, img);
  const person = ld['@graph'].find((n) => n['@type'] === 'Person')!;
  const page = ld['@graph'].find((n) => n['@type'] === 'ProfilePage')!;

  test('Person com dados públicos', () => {
    expect(person.name).toBe('Matheus Amon Marçal');
    expect(person.jobTitle).toBe('Engenheiro de Software, Dados e IA');
    expect(person.email).toBe('mailto:matheus.amon@outlook.com');
    expect(person.sameAs).toEqual(['https://www.linkedin.com/in/matheus-amon/', 'https://github.com/matheus-amon']);
    expect(person.image).toBe(img);
    expect(person).not.toHaveProperty('telephone');
  });

  test('knowsAbout usa as skills técnicas, sem idiomas', () => {
    expect(person.knowsAbout).toContain('dbt');
    expect(person.knowsAbout).toContain('LangGraph');
    expect(person.knowsAbout).not.toContain('Português (nativo)');
  });

  test('ProfilePage aponta para a Person', () => {
    expect(page.url).toBe(url);
    expect(page.inLanguage).toBe('pt-BR');
    expect(page.mainEntity).toEqual({ '@id': person['@id'] });
  });

  test('versão EN', () => {
    const enLd = personJsonLd(en, 'https://matheus-amon.github.io/en/', img);
    const enPerson = enLd['@graph'].find((n) => n['@type'] === 'Person')!;
    expect(enPerson.jobTitle).toBe('Software Engineer, Data & AI');
    expect(enLd['@graph'].find((n) => n['@type'] === 'ProfilePage')!.inLanguage).toBe('en');
  });

  test('serialização escapa "<"', () => {
    const out = serializeJsonLd({ '@context': 'https://schema.org', '@graph': [{ '@type': 'X', '@id': '</script>' }] });
    expect(out).not.toContain('<');
    expect(JSON.parse(out)['@graph'][0]['@id']).toBe('</script>');
  });
});

describe('timelineProgress', () => {
  test('antes, meio e depois', () => {
    expect(timelineProgress(100, 200, 400)).toBe(0);
    expect(timelineProgress(400, 200, 400)).toBe(0.5);
    expect(timelineProgress(900, 200, 400)).toBe(1);
  });

  test('altura zero não divide por zero', () => {
    expect(timelineProgress(100, 200, 0)).toBe(0);
    expect(timelineProgress(300, 200, 0)).toBe(1);
  });
});

describe('xml', () => {
  test('escapeXml', () => {
    expect(escapeXml('Software Engineer, Data & AI')).toBe('Software Engineer, Data &amp; AI');
    expect(escapeXml(`<"'>`)).toBe('&lt;&quot;&apos;&gt;');
  });

  test('wrapText quebra por palavra respeitando o limite', () => {
    expect(wrapText('Construo pipelines de dados e sistemas de IA', 20)).toEqual([
      'Construo pipelines',
      'de dados e sistemas',
      'de IA',
    ]);
    expect(wrapText('palavragigantesemespaco curta', 10)).toEqual(['palavragigantesemespaco', 'curta']);
  });
});

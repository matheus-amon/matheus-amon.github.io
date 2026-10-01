import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { en } from '../../src/content/en';
import { pt } from '../../src/content/pt';
import { PAGE_KEYS, distFile, localRefs, readPage, textOf } from './helpers';

const cvs = { pt, en };

describe.each(PAGE_KEYS)('seções (%s)', (key) => {
  const html = readPage(key);
  const text = textOf(html);
  const cv = cvs[key];

  test('um único h1, com a manchete', () => {
    expect(html.match(/<h1\b/g)?.length).toBe(1);
    expect(text).toContain(cv.person.headline);
  });

  test('todo o conteúdo do CV aparece', () => {
    const expectedTexts = [
      cv.person.title,
      cv.person.intro,
      cv.person.location,
      cv.earlier.summary,
      cv.education.school,
      ...cv.experience.flatMap((c) => c.roles.flatMap((r) => [r.title, r.period, ...r.bullets])),
      ...cv.projects.flatMap((p) => [p.name, p.description]),
      ...cv.skills.flatMap((g) => g.items),
      ...cv.certifications.flatMap((c) => c.items),
    ];
    expect(expectedTexts.filter((t) => !text.includes(t))).toEqual([]);
  });

  test('nenhum telefone e nenhum termo de jogo de azar no HTML', () => {
    expect(html).not.toMatch(/99968|\d{4,5}-\d{4}/);
    expect(text).not.toMatch(/cassino|casino|aposta|betting/i);
  });

  test('CV para download do idioma certo, e o arquivo existe', () => {
    expect(html).toMatch(new RegExp(`<a [^>]*href="/cv-${key}\\.pdf"[^>]*\\bdownload\\b`));
    expect(existsSync(distFile(`/cv-${key}.pdf`))).toBe(true);
  });

  test('mailto correto', () => {
    expect(html).toContain('href="mailto:matheus.amon@outlook.com"');
  });

  test('toda âncora #id tem destino', () => {
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    expect(targets.filter((t) => !ids.has(t))).toEqual([]);
  });

  test('links target=_blank têm rel noopener', () => {
    const blanks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
    expect(blanks.length).toBeGreaterThan(0);
    expect(blanks.filter((tag) => !/rel="[^"]*noopener/.test(tag))).toEqual([]);
  });

  test('foto otimizada, com alt, dimensões e carregamento imediato', () => {
    const img = html.match(/<img\b[^>]*>/)?.[0] ?? '';
    expect(img).toContain(`alt="${cv.ui.photoAlt}"`);
    expect(img).toMatch(/width="\d+"/);
    expect(img).toMatch(/height="\d+"/);
    expect(img).toContain('loading="eager"');
    expect(img).toMatch(/srcset="[^"]*\.webp/);
  });

  test('todo asset local referenciado existe em dist/', () => {
    expect(localRefs(html).filter((ref) => ref !== '/' && ref !== '/en/' && !existsSync(distFile(ref)))).toEqual([]);
  });

  test('timeline marcada para o JS', () => {
    expect(html).toContain('data-timeline');
    expect(html.match(/class="role reveal"/g)?.length).toBe(3);
  });
});

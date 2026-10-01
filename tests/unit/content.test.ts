import { describe, expect, test } from 'bun:test';
import { en } from '../../src/content/en';
import { pt } from '../../src/content/pt';
import type { CV } from '../../src/content/types';

function shape(value: unknown): unknown {
  if (typeof value === 'string') return 'string';
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, shape(v)]),
    );
  }
  return value;
}

function strings(value: unknown, path = '$'): [string, string][] {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  }
  return [];
}

const techTags = (cv: CV) => ({
  roles: cv.experience.flatMap((c) => c.roles.map((r) => r.tags)),
  projects: cv.projects.map((p) => p.tags),
  skills: cv.skills.filter((g) => g.id !== 'languages').map((g) => g.items),
});

describe('paridade PT/EN', () => {
  test('mesma estrutura (chaves e tamanhos de listas)', () => {
    expect(shape(en)).toEqual(shape(pt));
  });

  test('nomes de tecnologia não são traduzidos', () => {
    expect(techTags(en)).toEqual(techTags(pt));
  });

  test('locale correto', () => {
    expect(pt.locale).toBe('pt');
    expect(en.locale).toBe('en');
  });
});

describe.each([
  ['pt', pt],
  ['en', en],
] as const)('conteúdo %s', (locale, cv) => {
  test('nenhuma string vazia', () => {
    expect(strings(cv).filter(([, s]) => s.trim() === '')).toEqual([]);
  });

  test('nenhum telefone', () => {
    expect(strings(cv).filter(([, s]) => /\d{4,5}-\d{4}|99968/.test(s))).toEqual([]);
  });

  test('nenhum termo de jogo de azar (usar iGaming)', () => {
    expect(strings(cv).filter(([, s]) => /cassino|casino|aposta|betting|\bbet\b/i.test(s))).toEqual([]);
  });

  test('links externos são https', () => {
    const hrefs = [
      cv.person.linkedin,
      cv.person.github,
      cv.githubAll,
      ...cv.projects.flatMap((p) => p.links.map((l) => l.href)),
    ];
    expect(hrefs.filter((h) => !h.startsWith('https://'))).toEqual([]);
  });

  test('dados pessoais fixos', () => {
    expect(cv.person.name).toBe('Matheus Amon Marçal');
    expect(cv.person.email).toBe('matheus.amon@outlook.com');
    expect(cv.person.linkedin).toBe('https://www.linkedin.com/in/matheus-amon/');
    expect(cv.person.github).toBe('https://github.com/matheus-amon');
    expect(cv.person.cvPdf).toBe(`/cv-${locale}.pdf`);
    expect(cv.meta.ogImage).toBe(`/og-${locale}.jpg`);
  });

  test('só a primeira posição é atual e cada uma tem 3 bullets', () => {
    const roles = cv.experience.flatMap((c) => c.roles);
    expect(roles.map((r) => r.current ?? false)).toEqual([true, false, false]);
    expect(roles.map((r) => r.bullets.length)).toEqual([3, 3, 3]);
  });

  test('projetos aprovados', () => {
    expect(cv.projects.map((p) => p.name)).toEqual([
      'Iceberg Lakehouse',
      'Data Warehouse stack',
      'amon-claw',
      'One Billion Row Challenge',
    ]);
  });
});

describe('fidelidade (textos aprovados)', () => {
  test('título e manchete', () => {
    expect(pt.person.title).toBe('Engenheiro de Software, Dados e IA');
    expect(en.person.title).toBe('Software Engineer, Data & AI');
    expect(pt.person.headline).toBe('Construo pipelines de dados e sistemas de IA que rodam em produção.');
    expect(en.person.headline).toBe('I build data pipelines and AI systems that run in production.');
  });

  test('cargos reais do CV', () => {
    expect(pt.experience[0].roles.map((r) => r.title)).toEqual([
      'Analista de Dados',
      'Analista Financeiro',
      'Analista de Qualidade de Software Júnior',
    ]);
    expect(en.experience[0].roles.map((r) => r.title)).toEqual([
      'Data Analyst',
      'Financial Analyst',
      'Junior Software QA Analyst',
    ]);
  });

  test('localização', () => {
    expect(pt.person.location).toBe('Paraíba, Brasil · Remoto');
    expect(en.person.location).toBe('Paraíba, Brazil · Remote');
  });
});

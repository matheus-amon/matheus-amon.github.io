import { describe, expect, test } from 'bun:test';
import { en } from '../../src/content/en';
import { pt } from '../../src/content/pt';
import { skillIcon } from '../../src/lib/skill-icons';

const technical = (cv: typeof pt) => cv.skills.filter((g) => g.id !== 'languages').flatMap((g) => g.items);

describe('ícones da stack', () => {
  test.each([
    ['pt', pt],
    ['en', en],
  ] as const)('toda skill técnica (%s) tem ícone', (_, cv) => {
    expect(technical(cv).filter((item) => !skillIcon(item))).toEqual([]);
  });

  test('idiomas não têm ícone', () => {
    expect(skillIcon('Português (nativo)')).toBeUndefined();
  });

  test('AWS usa os ícones oficiais (tile cheio); marcas usam fundo claro', () => {
    expect(skillIcon('AWS Lambda')?.kind).toBe('tile');
    expect(skillIcon('Bedrock')?.kind).toBe('tile');
    expect(skillIcon('Python')?.kind).toBe('logo');
  });

  test('SVGs são seguros para embutir: sem script, sem title, com viewBox', () => {
    for (const item of technical(pt)) {
      const svg = skillIcon(item)!.svg;
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).toContain('viewBox=');
      expect(svg).not.toMatch(/<script|<title|<\?xml|on\w+=/i);
    }
  });

  test('toda referência interna (url(#x), href="#x") aponta para um id do próprio SVG', () => {
    for (const item of technical(pt)) {
      const svg = skillIcon(item)!.svg;
      const ids = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      const refs = [...svg.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] ?? m[2]);
      expect(refs.filter((ref) => !ids.has(ref))).toEqual([]);
    }
  });

  test('ids internos (gradientes) não se repetem entre ícones da mesma página', () => {
    const ids = technical(pt).flatMap((item) => [...skillIcon(item)!.svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    expect(ids.length).toBe(new Set(ids).size);
  });
});

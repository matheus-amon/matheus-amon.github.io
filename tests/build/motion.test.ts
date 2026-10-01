import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { PAGE_KEYS, cssFor, distFile, readPage } from './helpers';

const NO_PREF = /@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{/g;

/** Separa o CSS de dentro dos blocos `no-preference` do resto. */
function splitNoPreference(css: string): { inside: string; outside: string } {
  let inside = '';
  let outside = '';
  let cursor = 0;
  for (const match of css.matchAll(NO_PREF)) {
    const start = match.index!;
    outside += css.slice(cursor, start);
    let depth = 1;
    let i = start + match[0].length;
    const bodyStart = i;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }
    inside += css.slice(bodyStart, i - 1);
    cursor = i;
  }
  outside += css.slice(cursor);
  return { inside, outside };
}

function rulesHiding(css: string): string[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, , body]) => /opacity:\s*0(?![.\d])/.test(body))
    .map(([, selector]) => selector.trim());
}

describe.each(PAGE_KEYS)('movimento (%s)', (key) => {
  const html = readPage(key);
  const css = cssFor(html);
  const { inside, outside } = splitNoPreference(css);

  test('classe js aplicada por script inline no <head>', () => {
    const head = html.slice(0, html.indexOf('</head>'));
    expect(head).toContain("document.documentElement.classList.add('js')");
  });

  test('sem JS ou com reduced-motion: nada fica escondido', () => {
    expect(rulesHiding(outside).filter((s) => /\.reveal|\.enter/.test(s))).toEqual([]);
    expect(outside).not.toMatch(/--progress:\s*0(?![.\d])/);
  });

  test('estados escondidos: .enter sob .js, .reveal sob .motion, e só com no-preference', () => {
    const hidden = rulesHiding(inside);
    expect(hidden.length).toBeGreaterThan(0);
    expect(hidden.filter((s) => s.includes('.reveal') && !s.includes('.motion'))).toEqual([]);
    expect(hidden.filter((s) => s.includes('.enter') && !s.includes('.js'))).toEqual([]);
    expect(hidden.filter((s) => !s.includes('.js') && !s.includes('.motion'))).toEqual([]);
  });

  test('impressão mostra tudo', () => {
    expect(css).toMatch(/@media\s+print/);
  });

  test('script de interação carregado e pequeno (< 3 KB)', () => {
    const scripts = [...html.matchAll(/<script type="module"([^>]*)>([\s\S]*?)<\/script>/g)];
    const bodies = scripts.map(([, attrs, inline]) => {
      const src = attrs.match(/src="([^"]+)"/)?.[1];
      return src ? readFileSync(distFile(src), 'utf8') : inline;
    });
    const all = bodies.join('\n');
    expect(all).toContain('IntersectionObserver');
    expect(all).toMatch(/classList\.add\(["'`]motion["'`]\)/);
    expect(Buffer.byteLength(all)).toBeLessThan(3 * 1024);
  });
});

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const DIST = join(import.meta.dir, '..', '..', 'dist');

if (!existsSync(join(DIST, 'index.html'))) {
  throw new Error('dist/ não encontrado — rode `bun run build` antes de `bun run test:build`.');
}

export const PAGES = { pt: 'index.html', en: join('en', 'index.html') } as const;
export type PageKey = keyof typeof PAGES;
export const PAGE_KEYS = Object.keys(PAGES) as PageKey[];

export function readPage(key: PageKey): string {
  return readFileSync(join(DIST, PAGES[key]), 'utf8');
}

export function distFile(urlPath: string): string {
  return join(DIST, decodeURIComponent(urlPath.split('#')[0].split('?')[0].replace(/^\//, '')));
}

export function sizeOf(urlPath: string): number {
  return statSync(distFile(urlPath)).size;
}

/** Todos os caminhos locais (começando com "/") referenciados em src, href e srcset. */
export function localRefs(html: string): string[] {
  const refs = new Set<string>();
  for (const m of html.matchAll(/\s(?:src|href)="(\/[^"]*)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/')) refs.add(url);
    }
  }
  return [...refs].map((r) => r.split('#')[0].split('?')[0]).filter((r) => r !== '');
}

/** CSS da página: `<style>` inline + `<link rel="stylesheet">`. */
export function cssFor(html: string): string {
  const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const linked = [...html.matchAll(/<link\b[^>]*>/g)]
    .map((m) => m[0])
    .filter((tag) => /rel="stylesheet"/.test(tag))
    .map((tag) => readFileSync(distFile(tag.match(/href="([^"]+)"/)![1]), 'utf8'));
  return [...inline, ...linked].join('\n');
}

/** Texto visível aproximado (sem tags, entidades decodificadas). */
export function textOf(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
}

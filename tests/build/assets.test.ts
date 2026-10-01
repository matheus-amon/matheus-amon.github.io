import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { PAGE_KEYS, cssFor, distFile, readPage, sizeOf } from './helpers';

function pngSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe('arquivos estáticos', () => {
  test('robots.txt e favicon', () => {
    expect(existsSync(distFile('/robots.txt'))).toBe(true);
    expect(existsSync(distFile('/favicon.svg'))).toBe(true);
  });
});

describe.each(PAGE_KEYS)('assets e peso (%s)', (key) => {
  const html = readPage(key);

  test('imagem OG existe e tem 1200×630', () => {
    expect(pngSize(distFile(`/og-${key}.png`))).toEqual({ width: 1200, height: 630 });
  });

  test('primeira carga < 150 KB (HTML/CSS/JS gzip + fontes + maior foto)', () => {
    const css = cssFor(html);
    const cssFiles = [...html.matchAll(/<link\b[^>]*>/g)]
      .map((m) => m[0])
      .filter((tag) => /rel="stylesheet"/.test(tag))
      .map((tag) => tag.match(/href="([^"]+)"/)![1]);
    const jsFiles = [...html.matchAll(/<script type="module"[^>]*src="([^"]+)"/g)].map((m) => m[1]);
    const fonts = [...new Set([...css.matchAll(/url\(["']?([^)"']*-latin-(?:wght|400)-normal[^)"']*\.woff2)["']?\)/g)].map((m) => m[1]))];

    expect(fonts.length).toBe(2);
    const gz = (data: string | Buffer) => Bun.gzipSync(typeof data === 'string' ? Buffer.from(data) : data).byteLength;
    const srcset = html.match(/<img\b[^>]*srcset="([^"]+)"/)?.[1] ?? '';
    const photo = Math.max(...srcset.split(',').map((part) => sizeOf(part.trim().split(/\s+/)[0])));
    const parts = {
      html: gz(html),
      cssJs: [...cssFiles, ...jsFiles].reduce((sum, file) => sum + gz(readFileSync(distFile(file))), 0),
      fonts: fonts.reduce((sum, file) => sum + sizeOf(file), 0),
      photo,
    };
    console.log(`peso (${key}):`, parts);
    expect(Object.values(parts).reduce((a, b) => a + b, 0)).toBeLessThan(150 * 1024);
  });

  test('maior variante da foto < 80 KB', () => {
    const srcset = html.match(/<img\b[^>]*srcset="([^"]+)"/)?.[1] ?? '';
    const files = srcset.split(',').map((part) => part.trim().split(/\s+/)[0]);
    expect(files.length).toBeGreaterThan(0);
    expect(Math.max(...files.map(sizeOf))).toBeLessThan(80 * 1024);
  });
});

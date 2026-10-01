/** Prefixa caminhos internos com o `base` do Astro (ex.: repositório com outro nome). */
export function withBase(path: string, base: string = import.meta.env.BASE_URL ?? '/'): string {
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
}

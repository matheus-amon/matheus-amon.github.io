// Gera src/lib/skill-icons.generated.ts com os SVGs da seção Stack.
// Fontes: Simple Icons (CC0), AWS Architecture Icons via `aws-icons` (MIT), gilbarbara/logos via Iconify (CC0).
// Rode com `bun run icons` ao adicionar uma skill nova, e faça commit do arquivo gerado.
import { readFileSync, writeFileSync } from 'node:fs';
import logos from '@iconify-json/logos/icons.json' with { type: 'json' };
import {
  siApacheairflow,
  siDatabricks,
  siDocker,
  siFastapi,
  siGit,
  siLanggraph,
  siMetabase,
  siPython,
  type SimpleIcon,
} from 'simple-icons';

type Kind = 'logo' | 'tile';

const simple = (icon: SimpleIcon) =>
  `<svg viewBox="0 0 24 24"><path fill="#${icon.hex}" d="${icon.path}"/></svg>`;

const aws = (file: string) => {
  const raw = readFileSync(`node_modules/aws-icons/icons/architecture-service/${file}.svg`, 'utf8');
  return raw
    .replace(/<\?xml[^>]*>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<svg\b[^>]*?(viewBox="[^"]+")[^>]*>/, '<svg $1>')
    .trim();
};

const iconify = (name: keyof typeof logos.icons, prefix: string) => {
  const icon = logos.icons[name] as { body: string; width?: number; height?: number };
  const width = icon.width ?? logos.width ?? 256;
  const height = icon.height ?? logos.height ?? 256;
  // Prefixa ids de gradientes para não colidirem com outros SVGs da página.
  const body = icon.body.replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}-$1"`);
  return `<svg viewBox="0 0 ${width} ${height}">${body}</svg>`;
};

const glyph = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="#0E1A24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const icons: Record<string, { kind: Kind; svg: string }> = {
  Python: { kind: 'logo', svg: simple(siPython) },
  SQL: {
    kind: 'logo',
    svg: glyph('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>'),
  },
  Git: { kind: 'logo', svg: simple(siGit) },
  Docker: { kind: 'logo', svg: simple(siDocker) },
  dbt: { kind: 'logo', svg: iconify('dbt-icon', 'dbt') },
  Airflow: { kind: 'logo', svg: simple(siApacheairflow) },
  'Microsoft Fabric': { kind: 'logo', svg: glyph('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>') },
  Databricks: { kind: 'logo', svg: simple(siDatabricks) },
  'Power BI': { kind: 'logo', svg: iconify('microsoft-power-bi', 'pbi') },
  Metabase: { kind: 'logo', svg: simple(siMetabase) },
  'AWS S3': { kind: 'tile', svg: aws('AmazonSimpleStorageService') },
  'AWS Lambda': { kind: 'tile', svg: aws('AWSLambda') },
  'Step Functions': { kind: 'tile', svg: aws('AWSStepFunctions') },
  SageMaker: { kind: 'tile', svg: aws('AmazonSageMaker') },
  Bedrock: { kind: 'tile', svg: aws('AmazonBedrock') },
  FastAPI: { kind: 'logo', svg: simple(siFastapi) },
  LangGraph: { kind: 'logo', svg: simple(siLanggraph) },
  RAG: {
    kind: 'logo',
    svg: glyph('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/><path d="M14 3v5h5"/><path d="M19 8v3"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.8-1.8"/>'),
  },
};

const out = 'src/lib/skill-icons.generated.ts';
writeFileSync(
  out,
  `// Gerado por scripts/icons.ts — não edite à mão. Rode \`bun run icons\`.\n` +
    `export const generatedIcons: Record<string, { kind: 'logo' | 'tile'; svg: string }> = ${JSON.stringify(icons, null, 2)};\n`,
);
console.log(`✓ ${out} (${Object.keys(icons).length} ícones)`);

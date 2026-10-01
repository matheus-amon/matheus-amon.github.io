# CV Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Landing page estática e bilíngue (PT em `/`, EN em `/en/`) para o Matheus Amon Marçal, publicada em `https://matheus-amon.github.io`.

**Architecture:** Astro gera duas páginas HTML a partir de um único objeto de conteúdo tipado por idioma (`src/content/pt.ts` e `en.ts`). Os componentes `.astro` não têm texto fixo. O CSS é próprio, em três arquivos (base, seções, movimento), e o JS fica restrito a um script de ~2 KB (reveal, timeline, menu). Os testes usam `bun test`, em duas camadas: unitários (conteúdo e libs) e de build (inspecionam o HTML em `dist/`).

**Tech Stack:** Bun 1.4.2 · Astro ^7.3.5 · TypeScript ^5.9 (o `@astrojs/check` 0.9.10 não aceita TS 7) · `@fontsource-variable/inter-tight` ^5.3.0 · `@fontsource/jetbrains-mono` ^5.3.0 · sharp ^0.35.5 · GitHub Actions + Pages.

**Spec:** `docs/superpowers/specs/2026-09-30-cv-landing-page-design.md`

## Global Constraints

- Gerenciador e runtime: **Bun**. Nunca usar `npm`, `npx` ou `yarn`. O CLI do Astro roda como `bun --bun astro …`.
- **Só tema claro.** Nada de `prefers-color-scheme` nem botão de tema.
- Paleta exata: `paper #FAFAF8`, `ink #0E1A24`, `slate #5A6672`, `teal #2A9D96`, `teal-ink #1F7A75`, turquesa claro em faixa escura `#5CC4BD`.
- Fontes: Inter Tight Variable (corpo e títulos) e JetBrains Mono 400 (detalhes), self-hosted.
- Título: PT "Engenheiro de Software, Dados e IA" / EN "Software Engineer, Data & AI".
- Manchete: PT "Construo pipelines de dados e sistemas de IA que rodam em produção." / EN "I build data pipelines and AI systems that run in production."
- A timeline usa os **cargos reais** do CV. Nunca exibir telefone. Nunca usar "cassino", "casino", "apostas" ou "betting"; o termo é **iGaming**.
- Localização: "Paraíba, Brasil · Remoto" / "Paraíba, Brazil · Remote".
- Nenhum número ou conquista além do que está na spec §3.
- Orçamento de peso: primeira carga < 150 KB por página (HTML, CSS e JS medidos com gzip; fontes woff2 latin e maior variante da foto pelo tamanho bruto); maior variante da foto < 80 KB; JS < 3 KB.
- Todo link interno passa por `withBase()`.
- `site: 'https://matheus-amon.github.io'`.
- Ambiente: neste Mac, o sandbox bloqueia `git add` de arquivos com o atributo `com.apple.provenance` (foto, PDFs). Se o `git add` falhar com "Operation not permitted", rodar o comando git fora do sandbox.

## Review Focus

1. **Visitante sem JS, ou com o script quebrado:** todo o conteúdo precisa aparecer. A entrada do hero (só CSS) usa `html.js`. Os blocos `.reveal` e a timeline só se escondem sob `html.motion`, classe que o próprio `reveal.ts` adiciona **depois** de montar o observer. Se o script falhar, nada some. Teste em `tests/build/motion.test.ts` (Task 6).
2. **`prefers-reduced-motion: reduce`:** nada anima, a timeline aparece cheia e os pontos ficam acesos. As regras de esconder ficam só dentro de `@media (prefers-reduced-motion: no-preference)`. Teste na Task 6.
3. **Repositório com outro nome** (`base` diferente de `/`): os links internos não podem quebrar. Teste de `withBase` na Task 3, e uso obrigatório nos componentes (Tasks 4 e 5).
4. **Prévia de link no LinkedIn/WhatsApp:** `og:image` com URL absoluta, arquivo existente de 1200×630, e `&` escapado no SVG ("Data & AI"). Teste do `escapeXml` na Task 3 e de assets na Task 7.
5. **Vazamento de dado sensível:** nem telefone nem termos de jogo de azar podem aparecer no HTML final. Testes de conteúdo (Task 2) e de HTML (Task 5).

---

### Task 1: Scaffold do projeto (Astro + Bun)

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (placeholder, substituído na Task 4)
- Generated: `bun.lock`

**Interfaces:**
- Produces: scripts `dev`, `build`, `preview`, `check`, `test`, `test:build`, `og`, `verify`; config com `site`.

- [ ] **Step 1: Criar `package.json`**

```json
{
  "name": "cv-landingpage",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "bun --bun astro dev",
    "build": "bun --bun astro build",
    "preview": "bun --bun astro preview",
    "check": "bun --bun astro check",
    "test": "bun test tests/unit",
    "test:build": "bun test tests/build",
    "og": "bun scripts/og.ts",
    "verify": "bun run check && bun run test && bun run build && bun run test:build"
  }
}
```

- [ ] **Step 2: Instalar dependências**

```bash
bun add astro@^7.3.5 @fontsource-variable/inter-tight@^5.3.0 @fontsource/jetbrains-mono@^5.3.0
bun add -d @astrojs/check@^0.9.10 typescript@^5.9.0 @types/bun sharp@^0.35.5
```

Expected: `bun.lock` criado, sem erros.

- [ ] **Step 3: Criar `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';

// Repositório `matheus-amon.github.io` → servido na raiz.
// Com outro nome de repositório, adicione `base: '/<nome-do-repo>'`.
export default defineConfig({
  site: 'https://matheus-amon.github.io',
});
```

- [ ] **Step 4: Criar `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Criar o placeholder `src/pages/index.astro`**

```astro
---
---

<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Matheus Amon</title>
  </head>
  <body>
    <h1>Matheus Amon</h1>
  </body>
</html>
```

- [ ] **Step 6: Verificar build e type check**

Run: `bun run build && bun run check`
Expected: `1 page(s) built` e `0 errors`.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock astro.config.mjs tsconfig.json src/pages/index.astro
git commit -m "chore: scaffold Astro project with Bun"
```

---

### Task 2: Modelo de conteúdo + conteúdo PT/EN

**Files:**
- Create: `src/content/types.ts`, `src/content/pt.ts`, `src/content/en.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `type Locale = 'pt' | 'en'`; `interface CV` (abaixo); `export const pt: CV`; `export const en: CV`.

- [ ] **Step 1: Escrever o teste que falha, `tests/unit/content.test.ts`**

```ts
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
    expect(cv.meta.ogImage).toBe(`/og-${locale}.png`);
  });

  test('só a primeira posição é atual e cada uma tem 3 bullets', () => {
    const roles = cv.experience.flatMap((c) => c.roles);
    expect(roles.map((r) => r.current ?? false)).toEqual([true, false, false]);
    expect(roles.map((r) => r.bullets.length)).toEqual([3, 3, 3]);
  });

  test('projetos aprovados', () => {
    expect(cv.projects.map((p) => p.name)).toEqual([
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test`
Expected: FAIL com `Cannot find module '../../src/content/en'`.

- [ ] **Step 3: Criar `src/content/types.ts`**

```ts
export type Locale = 'pt' | 'en';

export interface Link {
  label: string;
  href: string;
}

export interface Role {
  title: string;
  period: string;
  current?: true;
  bullets: string[];
  tags: string[];
}

export interface Company {
  name: string;
  location: string;
  roles: Role[];
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  links: Link[];
}

export interface SkillGroup {
  id: 'tools' | 'data' | 'cloud' | 'languages';
  label: string;
  items: string[];
}

export interface CertificationGroup {
  issuer: string;
  items: string[];
}

/** Slot futuro: a seção "Escritos" só aparece quando houver itens. */
export interface Post {
  title: string;
  href: string;
  date: string;
}

export interface UiStrings {
  nav: { experience: string; projects: string; stack: string; contact: string };
  languageLabel: string;
  menu: string;
  skipToContent: string;
  downloadCv: string;
  cvShort: string;
  contactMe: string;
  photoAlt: string;
  current: string;
  experienceEyebrow: string;
  experienceHeading: string;
  earlierHeading: string;
  projectsEyebrow: string;
  projectsHeading: string;
  seeAllGithub: string;
  stackEyebrow: string;
  stackHeading: string;
  educationEyebrow: string;
  educationHeading: string;
  educationLabel: string;
  certificationsLabel: string;
  writingHeading: string;
  contactEyebrow: string;
  contactHeading: string;
  contactText: string;
  builtWith: string;
}

export interface CV {
  locale: Locale;
  meta: { title: string; description: string; ogImage: string; ogAlt: string };
  ui: UiStrings;
  person: {
    name: string;
    shortName: string;
    title: string;
    headline: string;
    intro: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    cvPdf: string;
  };
  experience: Company[];
  earlier: { name: string; period: string; location: string; summary: string };
  projects: Project[];
  githubAll: string;
  skills: SkillGroup[];
  education: { school: string; course: string; location: string };
  certifications: CertificationGroup[];
  writing?: Post[];
}
```

- [ ] **Step 4: Criar `src/content/pt.ts`**

```ts
import type { CV } from './types';

export const pt: CV = {
  locale: 'pt',
  meta: {
    title: 'Matheus Amon · Engenheiro de Software, Dados e IA',
    description:
      'Engenheiro de Software, Dados e IA. Pipelines ETL/ELT, modelagem com dbt, AWS serverless, RAG e agentes de IA em produção.',
    ogImage: '/og-pt.png',
    ogAlt: 'Matheus Amon Marçal — Engenheiro de Software, Dados e IA',
  },
  ui: {
    nav: { experience: 'Experiência', projects: 'Projetos', stack: 'Stack', contact: 'Contato' },
    languageLabel: 'Idioma',
    menu: 'Menu',
    skipToContent: 'Pular para o conteúdo',
    downloadCv: 'Baixar CV',
    cvShort: 'CV',
    contactMe: 'Fale comigo',
    photoAlt: 'Foto de Matheus Amon Marçal',
    current: 'atual',
    experienceEyebrow: 'Experiência',
    experienceHeading: 'Trajetória',
    earlierHeading: 'Antes da tecnologia',
    projectsEyebrow: 'Projetos',
    projectsHeading: 'Projetos pessoais',
    seeAllGithub: 'Ver todos no GitHub',
    stackEyebrow: 'Stack',
    stackHeading: 'Habilidades técnicas',
    educationEyebrow: 'Formação',
    educationHeading: 'Formação e certificações',
    educationLabel: 'Educação',
    certificationsLabel: 'Certificações e cursos',
    writingHeading: 'Escritos',
    contactEyebrow: 'Contato',
    contactHeading: 'Vamos conversar?',
    contactText:
      'Quer conversar sobre Engenharia de Dados e IA? O jeito mais rápido de falar comigo é por e-mail.',
    builtWith: 'Feito com Astro',
  },
  person: {
    name: 'Matheus Amon Marçal',
    shortName: 'Matheus Amon',
    title: 'Engenheiro de Software, Dados e IA',
    headline: 'Construo pipelines de dados e sistemas de IA que rodam em produção.',
    intro:
      'Profissional autodidata de engenharia de dados e IA, em tecnologia desde 2024, com Python, SQL e AWS no dia a dia. Atuo de pipelines ETL/ELT e modelagem analítica com dbt até RAG e agentes de IA, sempre buscando eficiência operacional, custo baixo e decisões orientadas por dados.',
    location: 'Paraíba, Brasil · Remoto',
    email: 'matheus.amon@outlook.com',
    linkedin: 'https://www.linkedin.com/in/matheus-amon/',
    github: 'https://github.com/matheus-amon',
    cvPdf: '/cv-pt.pdf',
  },
  experience: [
    {
      name: 'Singlesoftware',
      location: 'Brasil',
      roles: [
        {
          title: 'Analista de Dados',
          period: 'jan 2026 — presente',
          current: true,
          bullets: [
            'Automatizo a operação com microsserviços serverless de IA generativa na AWS (FastAPI, Lambda, S3, SageMaker, Bedrock), com infraestrutura praticamente a custo zero: só o Bedrock é cobrado, o resto foi otimizado para o free tier.',
            'Mantenho e evoluo pipelines de RAG orquestrados com Lambda e Step Functions, com ingestões personalizadas de múltiplas fontes que melhoraram a governança dos dados.',
            'Modelo dados brutos em camadas analíticas com dbt e mantenho dashboards no Metabase usados pelo time de marketing e pelos decisores da operação.',
          ],
          tags: ['AWS Lambda', 'Step Functions', 'S3', 'SageMaker', 'Bedrock', 'FastAPI', 'dbt', 'Metabase'],
        },
        {
          title: 'Analista Financeiro',
          period: 'out 2024 — jan 2026',
          bullets: [
            'Criei dashboards estratégicos em Power BI para o posicionamento de jogos em plataformas de iGaming, que embasam decisões de campanha.',
            'Desenvolvi agentes de IA para consulta a documentos internos do time comercial, agilizando o acesso à informação e a tomada de decisão.',
            'Automatizei com pipelines em Python a validação, o confronto e a conciliação de dados entre fornecedores e sistemas internos, garantindo a integridade das informações financeiras.',
          ],
          tags: ['Power BI', 'Python', 'LLM'],
        },
        {
          title: 'Analista de Qualidade de Software Júnior',
          period: 'abr 2024 — out 2024',
          bullets: [
            'Validei e testei as entregas do time de desenvolvimento.',
            'Construí relatórios em Power BI sobre comportamento de usuários e fluxos financeiros (saques e depósitos) em plataformas de iGaming.',
            'Substituí cálculos e transformações manuais em Excel por processos ETL no Microsoft Fabric.',
          ],
          tags: ['QA', 'Power BI', 'Microsoft Fabric', 'ETL'],
        },
      ],
    },
  ],
  earlier: {
    name: 'Redepharma',
    period: 'fev 2021 — abr 2024',
    location: 'Paraíba',
    summary:
      'De Jovem Aprendiz a Assistente de Prevenção de Perdas, com gestão interina da equipe. Foi onde comecei com dados: relatórios em Excel e Power BI para o centro de distribuição.',
  },
  projects: [
    {
      name: 'Data Warehouse stack',
      description:
        'Data warehouse local de ponta a ponta: ambiente com Terraform e docker-compose, orquestração com Airflow e transformação com dbt.',
      tags: ['Terraform', 'Docker', 'Airflow', 'dbt', 'Python'],
      links: [
        { label: 'dwh-config-local', href: 'https://github.com/matheus-amon/dwh-config-local' },
        { label: 'dwh-airflow', href: 'https://github.com/matheus-amon/dwh-airflow' },
        { label: 'dwh-dbt', href: 'https://github.com/matheus-amon/dwh-dbt' },
      ],
    },
    {
      name: 'amon-claw',
      description: 'Runtime de agente de IA pessoal em Python, com Docker Compose e documentação em MkDocs.',
      tags: ['Python', 'Docker', 'LLM', 'MkDocs'],
      links: [{ label: 'amon-claw', href: 'https://github.com/matheus-amon/amon-claw' }],
    },
    {
      name: 'One Billion Row Challenge',
      description:
        'Leitura e processamento de 1 bilhão de linhas com Polars e DuckDB, comparando desempenho. Desafio da Jornada de Dados.',
      tags: ['Python', 'Polars', 'DuckDB'],
      links: [
        { label: 'one-billion-row-challenge', href: 'https://github.com/matheus-amon/one-billion-row-challenge' },
      ],
    },
  ],
  githubAll: 'https://github.com/matheus-amon?tab=repositories',
  skills: [
    { id: 'tools', label: 'Linguagens e ferramentas', items: ['Python', 'SQL', 'Git', 'Docker'] },
    {
      id: 'data',
      label: 'Dados e BI',
      items: ['dbt', 'Airflow', 'Microsoft Fabric', 'Databricks', 'Power BI', 'Metabase'],
    },
    {
      id: 'cloud',
      label: 'Cloud e IA',
      items: ['AWS S3', 'AWS Lambda', 'Step Functions', 'SageMaker', 'Bedrock', 'FastAPI', 'LangGraph', 'RAG'],
    },
    { id: 'languages', label: 'Idiomas', items: ['Português (nativo)', 'Inglês (intermediário)'] },
  ],
  education: {
    school: 'Universidade Federal de Campina Grande (UFCG)',
    course: 'Geografia (incompleto)',
    location: 'Paraíba',
  },
  certifications: [
    {
      issuer: 'Udemy (Ed Donner)',
      items: [
        'The Complete Agentic AI Engineering Course (2025)',
        'AI in Production: Gen AI and Agentic AI at Scale',
      ],
    },
    { issuer: 'LangChain Academy', items: ['LangGraph Essentials (Python)', 'Deep Agents with LangGraph'] },
    {
      issuer: 'Outros',
      items: ['Databricks Fundamentals Accreditation', 'Jornada de Dados (Engenharia de Dados)'],
    },
  ],
};
```

- [ ] **Step 5: Criar `src/content/en.ts`**

```ts
import type { CV } from './types';

export const en: CV = {
  locale: 'en',
  meta: {
    title: 'Matheus Amon · Software Engineer, Data & AI',
    description:
      'Software Engineer, Data & AI. ETL/ELT pipelines, dbt modeling, serverless AWS, RAG and AI agents in production.',
    ogImage: '/og-en.png',
    ogAlt: 'Matheus Amon Marçal — Software Engineer, Data & AI',
  },
  ui: {
    nav: { experience: 'Experience', projects: 'Projects', stack: 'Stack', contact: 'Contact' },
    languageLabel: 'Language',
    menu: 'Menu',
    skipToContent: 'Skip to content',
    downloadCv: 'Download CV',
    cvShort: 'CV',
    contactMe: 'Get in touch',
    photoAlt: 'Photo of Matheus Amon Marçal',
    current: 'current',
    experienceEyebrow: 'Experience',
    experienceHeading: 'Career path',
    earlierHeading: 'Before tech',
    projectsEyebrow: 'Projects',
    projectsHeading: 'Personal projects',
    seeAllGithub: 'See all on GitHub',
    stackEyebrow: 'Stack',
    stackHeading: 'Technical skills',
    educationEyebrow: 'Education',
    educationHeading: 'Education & certifications',
    educationLabel: 'Education',
    certificationsLabel: 'Certifications & courses',
    writingHeading: 'Writing',
    contactEyebrow: 'Contact',
    contactHeading: "Let's talk",
    contactText: 'Want to talk about Data Engineering and AI? The fastest way to reach me is by email.',
    builtWith: 'Built with Astro',
  },
  person: {
    name: 'Matheus Amon Marçal',
    shortName: 'Matheus Amon',
    title: 'Software Engineer, Data & AI',
    headline: 'I build data pipelines and AI systems that run in production.',
    intro:
      'Self-taught data and AI engineer, in tech since 2024, working daily with Python, SQL and AWS. My work goes from ETL/ELT pipelines and analytics modeling with dbt to RAG and AI agents, always aiming for operational efficiency, low cost and data-driven decisions.',
    location: 'Paraíba, Brazil · Remote',
    email: 'matheus.amon@outlook.com',
    linkedin: 'https://www.linkedin.com/in/matheus-amon/',
    github: 'https://github.com/matheus-amon',
    cvPdf: '/cv-en.pdf',
  },
  experience: [
    {
      name: 'Singlesoftware',
      location: 'Brazil',
      roles: [
        {
          title: 'Data Analyst',
          period: 'Jan 2026 — Present',
          current: true,
          bullets: [
            'I automate operations with serverless Generative AI microservices on AWS (FastAPI, Lambda, S3, SageMaker, Bedrock), at near-zero infrastructure cost: only Bedrock is billed, everything else is tuned to stay within the free tier.',
            'I maintain and evolve RAG pipelines orchestrated with Lambda and Step Functions, with custom ingestion from multiple sources that improved data governance.',
            'I model raw data into analytics layers with dbt and maintain Metabase dashboards used by the marketing team and operations decision-makers.',
          ],
          tags: ['AWS Lambda', 'Step Functions', 'S3', 'SageMaker', 'Bedrock', 'FastAPI', 'dbt', 'Metabase'],
        },
        {
          title: 'Financial Analyst',
          period: 'Oct 2024 — Jan 2026',
          bullets: [
            'Built strategic Power BI dashboards for game positioning on iGaming platforms, supporting campaign decisions.',
            "Developed AI agents for querying the sales team's internal documents, speeding up access to information and decision-making.",
            'Automated validation, cross-checking and reconciliation of data between vendors and internal systems with Python pipelines, ensuring the integrity of financial information.',
          ],
          tags: ['Power BI', 'Python', 'LLM'],
        },
        {
          title: 'Junior Software QA Analyst',
          period: 'Apr 2024 — Oct 2024',
          bullets: [
            'Validated and tested deliverables from the development team.',
            'Built Power BI reports on user behavior and financial flows (withdrawals and deposits) for iGaming platforms.',
            'Replaced manual Excel calculations and transformations with ETL processes in Microsoft Fabric.',
          ],
          tags: ['QA', 'Power BI', 'Microsoft Fabric', 'ETL'],
        },
      ],
    },
  ],
  earlier: {
    name: 'Redepharma',
    period: 'Feb 2021 — Apr 2024',
    location: 'Paraíba',
    summary:
      "From Young Apprentice to Loss Prevention Assistant, serving as interim team lead. That's where I started with data: Excel and Power BI reports for the distribution center.",
  },
  projects: [
    {
      name: 'Data Warehouse stack',
      description:
        'End-to-end local data warehouse: environment with Terraform and docker-compose, orchestration with Airflow and transformation with dbt.',
      tags: ['Terraform', 'Docker', 'Airflow', 'dbt', 'Python'],
      links: [
        { label: 'dwh-config-local', href: 'https://github.com/matheus-amon/dwh-config-local' },
        { label: 'dwh-airflow', href: 'https://github.com/matheus-amon/dwh-airflow' },
        { label: 'dwh-dbt', href: 'https://github.com/matheus-amon/dwh-dbt' },
      ],
    },
    {
      name: 'amon-claw',
      description: 'Personal AI agent runtime in Python, with Docker Compose and MkDocs documentation.',
      tags: ['Python', 'Docker', 'LLM', 'MkDocs'],
      links: [{ label: 'amon-claw', href: 'https://github.com/matheus-amon/amon-claw' }],
    },
    {
      name: 'One Billion Row Challenge',
      description:
        'Reading and processing 1 billion rows with Polars and DuckDB, comparing performance. A Jornada de Dados challenge.',
      tags: ['Python', 'Polars', 'DuckDB'],
      links: [
        { label: 'one-billion-row-challenge', href: 'https://github.com/matheus-amon/one-billion-row-challenge' },
      ],
    },
  ],
  githubAll: 'https://github.com/matheus-amon?tab=repositories',
  skills: [
    { id: 'tools', label: 'Languages & tools', items: ['Python', 'SQL', 'Git', 'Docker'] },
    {
      id: 'data',
      label: 'Data & BI',
      items: ['dbt', 'Airflow', 'Microsoft Fabric', 'Databricks', 'Power BI', 'Metabase'],
    },
    {
      id: 'cloud',
      label: 'Cloud & AI',
      items: ['AWS S3', 'AWS Lambda', 'Step Functions', 'SageMaker', 'Bedrock', 'FastAPI', 'LangGraph', 'RAG'],
    },
    { id: 'languages', label: 'Spoken languages', items: ['Portuguese (native)', 'English (intermediate)'] },
  ],
  education: {
    school: 'Federal University of Campina Grande (UFCG)',
    course: 'Geography (incomplete)',
    location: 'Paraíba',
  },
  certifications: [
    {
      issuer: 'Udemy (Ed Donner)',
      items: [
        'The Complete Agentic AI Engineering Course (2025)',
        'AI in Production: Gen AI and Agentic AI at Scale',
      ],
    },
    { issuer: 'LangChain Academy', items: ['LangGraph Essentials (Python)', 'Deep Agents with LangGraph'] },
    {
      issuer: 'Other',
      items: ['Databricks Fundamentals Accreditation', 'Jornada de Dados (Data Engineering)'],
    },
  ],
};
```

- [ ] **Step 6: Rodar e ver passar**

Run: `bun run test`
Expected: PASS em todos os testes de `content.test.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/content tests/unit/content.test.ts
git commit -m "feat: add typed bilingual CV content"
```

---

### Task 3: Libs puras (i18n, url, seo, timeline, xml)

**Files:**
- Create: `src/lib/i18n.ts`, `src/lib/url.ts`, `src/lib/seo.ts`, `src/lib/timeline.ts`, `src/lib/xml.ts`
- Test: `tests/unit/lib.test.ts`

**Interfaces:**
- Consumes: `CV`, `Locale`, `pt`, `en` (Task 2).
- Produces:
  - `LOCALES: readonly ['pt', 'en']`, `content: Record<Locale, CV>`, `paths: Record<Locale, string>` (`'/'`, `'/en/'`), `htmlLang: Record<Locale, string>` (`'pt-BR'`, `'en'`), `ogLocale: Record<Locale, string>`
  - `withBase(path: string, base?: string): string`
  - `personJsonLd(cv: CV, pageUrl: string, imageUrl: string): JsonLd`, `serializeJsonLd(data: JsonLd): string`
  - `timelineProgress(anchor: number, top: number, height: number): number`
  - `escapeXml(text: string): string`, `wrapText(text: string, maxChars: number): string[]`

- [ ] **Step 1: Escrever o teste que falha, `tests/unit/lib.test.ts`**

```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run test`
Expected: FAIL com `Cannot find module '../../src/lib/i18n'`.

- [ ] **Step 3: Criar `src/lib/i18n.ts`**

```ts
import { en } from '../content/en';
import { pt } from '../content/pt';
import type { CV, Locale } from '../content/types';

export const LOCALES = ['pt', 'en'] as const satisfies readonly Locale[];

export const content: Record<Locale, CV> = { pt, en };

export const paths: Record<Locale, string> = { pt: '/', en: '/en/' };

export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

export const ogLocale: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US' };
```

- [ ] **Step 4: Criar `src/lib/url.ts`**

```ts
/** Prefixa caminhos internos com o `base` do Astro (ex.: repositório com outro nome). */
export function withBase(path: string, base: string = import.meta.env.BASE_URL ?? '/'): string {
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
}
```

- [ ] **Step 5: Criar `src/lib/seo.ts`**

```ts
import type { CV } from '../content/types';
import { htmlLang } from './i18n';

export type JsonLdNode = { '@type': string; '@id': string } & Record<string, unknown>;

export interface JsonLd {
  '@context': 'https://schema.org';
  '@graph': JsonLdNode[];
}

export function personJsonLd(cv: CV, pageUrl: string, imageUrl: string): JsonLd {
  const personId = `${pageUrl}#person`;
  const knowsAbout = cv.skills.filter((g) => g.id !== 'languages').flatMap((g) => g.items);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: cv.meta.title,
        inLanguage: htmlLang[cv.locale],
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: cv.person.name,
        url: pageUrl,
        image: imageUrl,
        email: `mailto:${cv.person.email}`,
        jobTitle: cv.person.title,
        description: cv.meta.description,
        homeLocation: {
          '@type': 'Place',
          address: { '@type': 'PostalAddress', addressRegion: 'PB', addressCountry: 'BR' },
        },
        knowsAbout,
        knowsLanguage: ['pt-BR', 'en'],
        sameAs: [cv.person.linkedin, cv.person.github],
      },
    ],
  };
}

/** JSON seguro para `<script type="application/ld+json">`. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
```

- [ ] **Step 6: Criar `src/lib/timeline.ts`**

```ts
/** Fração (0–1) da timeline já "desenhada", dado o ponto de ancoragem na viewport. */
export function timelineProgress(anchor: number, top: number, height: number): number {
  if (height <= 0) return anchor >= top ? 1 : 0;
  return Math.min(1, Math.max(0, (anchor - top) / height));
}
```

- [ ] **Step 7: Criar `src/lib/xml.ts`**

```ts
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Quebra gulosa por palavras; uma palavra maior que o limite fica sozinha na linha. */
export function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}
```

- [ ] **Step 8: Rodar e ver passar**

Run: `bun run test && bun run check`
Expected: todos PASS; `0 errors`.

- [ ] **Step 9: Commit**

```bash
git add src/lib tests/unit/lib.test.ts
git commit -m "feat: add i18n, base-path, SEO, timeline and XML helpers"
```

---

### Task 4: Layout, `<head>` com SEO, páginas PT/EN e Header

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Page.astro`, `src/pages/en/index.astro`, `src/styles/base.css`, `public/favicon.svg`, `tests/build/helpers.ts`
- Modify: `src/pages/index.astro` (substitui o placeholder)
- Test: `tests/build/head.test.ts`

**Interfaces:**
- Consumes: `content`, `LOCALES`, `paths`, `htmlLang`, `ogLocale`, `withBase`, `personJsonLd`, `serializeJsonLd`.
- Produces: `<Base cv>` (layout com `<slot />`); `<Page cv>` (compõe as seções; Task 5 adiciona as seções); classes CSS base `.shell`, `.section`, `.section-head`, `.section-title`, `.eyebrow`, `.mono`, `.muted`, `.link`, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-small`, `.icon`; helpers de teste `readPage`, `distFile`, `localRefs`, `cssFor`, `sizeOf`, `textOf`.

- [ ] **Step 1: Criar `tests/build/helpers.ts`**

```ts
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
```

- [ ] **Step 2: Escrever o teste que falha, `tests/build/head.test.ts`**

```ts
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
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `bun run build && bun run test:build`
Expected: FAIL. O placeholder não tem canonical, og etc., e `dist/en/index.html` não existe (`ENOENT`).

- [ ] **Step 4: Criar `src/styles/base.css`**

```css
:root {
  --paper: #fafaf8;
  --chalk: #f0f1ee;
  --white: #ffffff;
  --line: #e2e5e3;
  --line-strong: #cdd3d1;
  --ink: #0e1a24;
  --ink-soft: #2b3742;
  --slate: #5a6672;
  --mist: #a9b4bf;
  --teal: #2a9d96;
  --teal-ink: #1f7a75;
  --teal-light: #5cc4bd;

  --font-sans: 'Inter Tight Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  --shell: 960px;
  --measure: 680px;
  --radius: 14px;
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);

  color-scheme: light;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3,
h4,
p,
ul,
ol,
figure {
  margin: 0;
}

ul,
ol {
  padding: 0;
  list-style: none;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Layout */
.shell {
  width: 100%;
  max-width: var(--shell);
  margin-inline: auto;
  padding-inline: 16px;
}

@media (min-width: 640px) {
  .shell {
    padding-inline: 32px;
  }
}

.section {
  padding-block: 72px;
}

@media (min-width: 880px) {
  .section {
    padding-block: 104px;
  }
}

.section-head {
  margin-bottom: 40px;
}

.section-title {
  margin-top: 12px;
  font-size: clamp(1.75rem, 3.6vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
  font-weight: 700;
}

/* Tipografia utilitária */
.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--teal-ink);
}

.mono {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.01em;
}

.muted {
  color: var(--slate);
}

.link {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size 0.3s var(--ease), color 0.2s;
}

.link:hover {
  background-size: 100% 1px;
}

.skip {
  position: absolute;
  left: 16px;
  top: -48px;
  z-index: 100;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--ink);
  color: var(--paper);
}

.skip:focus {
  top: 12px;
}

/* Botões */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 44px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 0.2s var(--ease), background-color 0.2s, border-color 0.2s, color 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--ink);
  color: var(--paper);
}

.btn-primary:hover {
  background: var(--teal-ink);
}

.btn-ghost {
  border-color: var(--line-strong);
  color: var(--ink);
}

.btn-ghost:hover {
  border-color: var(--teal);
  color: var(--teal-ink);
}

.btn-small {
  height: 34px;
  padding: 0 14px;
  font-size: 0.8125rem;
}

.icon {
  width: 18px;
  height: 18px;
  flex: none;
}

/* Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(250 250 248 / 0.85);
  -webkit-backdrop-filter: saturate(1.4) blur(10px);
  backdrop-filter: saturate(1.4) blur(10px);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  min-height: 64px;
}

.brand {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.nav {
  margin-left: auto;
}

.nav-list {
  display: flex;
  gap: 24px;
  font-size: 0.9375rem;
  color: var(--slate);
}

.nav-list a:hover {
  color: var(--ink);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lang {
  display: inline-flex;
  padding: 2px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.lang a {
  padding: 4px 9px;
  border-radius: 999px;
  color: var(--slate);
  transition: background-color 0.2s, color 0.2s;
}

.lang a[aria-current='page'] {
  background: var(--ink);
  color: var(--paper);
}

.lang a:not([aria-current]):hover {
  color: var(--ink);
}

.menu-toggle {
  display: none;
}

@media (max-width: 759px) {
  .header-inner {
    gap: 10px;
  }

  .nav {
    order: 3;
    flex-basis: 100%;
    margin-left: 0;
  }

  .nav-list {
    gap: 18px;
    overflow-x: auto;
    padding-bottom: 12px;
  }

  .header-actions {
    margin-left: auto;
  }

  .js .menu-toggle {
    display: inline-flex;
    align-items: center;
    height: 34px;
    padding: 0 12px;
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 0.8125rem;
    cursor: pointer;
  }

  .js .nav-list {
    display: none;
  }

  .js .nav-list.is-open {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 0 16px;
  }

  .js .nav-list.is-open a {
    display: block;
    padding: 8px 0;
    font-size: 1rem;
  }
}
```

- [ ] **Step 5: Criar `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0E1A24"/><text x="32" y="42" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="28" font-weight="700" letter-spacing="-1" fill="#5CC4BD">MA</text></svg>
```

- [ ] **Step 6: Criar `src/layouts/Base.astro`**

```astro
---
import '@fontsource-variable/inter-tight/wght.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '../styles/base.css';
import type { CV } from '../content/types';
import { LOCALES, htmlLang, ogLocale, paths } from '../lib/i18n';
import { personJsonLd, serializeJsonLd } from '../lib/seo';
import { withBase } from '../lib/url';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
if (!Astro.site) throw new Error('Defina `site` em astro.config.mjs');
const site = Astro.site;
const abs = (path: string) => new URL(withBase(path), site).href;
const canonical = abs(paths[cv.locale]);
const ogImage = abs(cv.meta.ogImage);
const jsonLd = serializeJsonLd(personJsonLd(cv, canonical, ogImage));
---

<!doctype html>
<html lang={htmlLang[cv.locale]}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{cv.meta.title}</title>
    <meta name="description" content={cv.meta.description} />
    <meta name="author" content={cv.person.name} />
    <meta name="theme-color" content="#FAFAF8" />
    <link rel="canonical" href={canonical} />
    {LOCALES.map((locale) => <link rel="alternate" hreflang={htmlLang[locale]} href={abs(paths[locale])} />)}
    <link rel="alternate" hreflang="x-default" href={abs(paths.pt)} />
    <link rel="icon" href={withBase('/favicon.svg')} type="image/svg+xml" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={cv.meta.title} />
    <meta property="og:description" content={cv.meta.description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={cv.meta.ogAlt} />
    <meta property="og:locale" content={ogLocale[cv.locale]} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={cv.meta.title} />
    <meta name="twitter:description" content={cv.meta.description} />
    <meta name="twitter:image" content={ogImage} />
    <script is:inline type="application/ld+json" set:html={jsonLd} />
  </head>
  <body>
    <a class="skip" href="#main">{cv.ui.skipToContent}</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 7: Criar `src/components/Header.astro`**

```astro
---
import type { CV, Locale } from '../content/types';
import { LOCALES, htmlLang, paths } from '../lib/i18n';
import { withBase } from '../lib/url';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const { ui, person } = cv;
const navItems = [
  { id: 'experience', label: ui.nav.experience },
  { id: 'projects', label: ui.nav.projects },
  { id: 'stack', label: ui.nav.stack },
  { id: 'contact', label: ui.nav.contact },
];
const langLabel: Record<Locale, string> = { pt: 'PT', en: 'EN' };
---

<header class="site-header">
  <div class="shell header-inner">
    <a class="brand" href={withBase(paths[cv.locale])}>{person.shortName}</a>
    <nav class="nav" aria-label={ui.menu}>
      <ul id="nav-list" class="nav-list">
        {navItems.map((item) => <li><a class="link" href={`#${item.id}`}>{item.label}</a></li>)}
      </ul>
    </nav>
    <div class="header-actions">
      <div class="lang" role="group" aria-label={ui.languageLabel}>
        {
          LOCALES.map((locale) => (
            <a
              href={withBase(paths[locale])}
              hreflang={htmlLang[locale]}
              lang={htmlLang[locale]}
              aria-current={locale === cv.locale ? 'page' : undefined}
            >
              {langLabel[locale]}
            </a>
          ))
        }
      </div>
      <a class="btn btn-small btn-primary" href={withBase(person.cvPdf)} download>{ui.cvShort}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-list">{ui.menu}</button>
    </div>
  </div>
</header>
```

- [ ] **Step 8: Criar `src/components/Page.astro`** (a Task 5 adiciona as seções)

```astro
---
import type { CV } from '../content/types';
import Header from './Header.astro';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
---

<Header cv={cv} />
<main id="main"></main>
```

- [ ] **Step 9: Substituir `src/pages/index.astro` e criar `src/pages/en/index.astro`**

`src/pages/index.astro`:

```astro
---
import Page from '../components/Page.astro';
import Base from '../layouts/Base.astro';
import { content } from '../lib/i18n';

const cv = content.pt;
---

<Base cv={cv}><Page cv={cv} /></Base>
```

`src/pages/en/index.astro`:

```astro
---
import Page from '../../components/Page.astro';
import Base from '../../layouts/Base.astro';
import { content } from '../../lib/i18n';

const cv = content.en;
---

<Base cv={cv}><Page cv={cv} /></Base>
```

- [ ] **Step 10: Rodar e ver passar**

Run: `bun run check && bun run build && bun run test:build`
Expected: `0 errors`, `2 page(s) built`, todos os testes de `head.test.ts` PASS. Se o teste do botão de idioma falhar por causa de quebra de linha dentro do `<a>`, conferir o HTML gerado. O Astro compacta o espaço em branco, então `>PT</a>` deve sair inline.

- [ ] **Step 11: Commit**

```bash
git add src/layouts src/components src/pages src/styles/base.css public/favicon.svg tests/build
git commit -m "feat: add base layout with SEO head, header and bilingual pages"
```

---

### Task 5: Seções da página (Hero, Experiência, Projetos, Stack, Formação, Contato, Footer)

**Files:**
- Create: `src/components/Icon.astro`, `src/components/Hero.astro`, `src/components/Experience.astro`, `src/components/Projects.astro`, `src/components/Stack.astro`, `src/components/Education.astro`, `src/components/Writing.astro`, `src/components/Contact.astro`, `src/components/Footer.astro`, `src/styles/sections.css`
- Modify: `src/components/Page.astro`, `src/layouts/Base.astro` (import do `sections.css`)
- Test: `tests/build/sections.test.ts`

**Interfaces:**
- Consumes: `CV`, `withBase`, classes da Task 4.
- Produces: ids de seção `experience`, `projects`, `stack`, `education`, `contact` (e `writing`, se houver posts); classes `.enter` (hero, com `--i`), `.reveal`, `[data-timeline]`, `.timeline`, `.role`, `.role-dot`, `.card` (usadas pela Task 6).

- [ ] **Step 1: Escrever o teste que falha, `tests/build/sections.test.ts`**

```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run build && bun run test:build`
Expected: FAIL em "um único h1", "todo o conteúdo…", "âncora #id" etc. (`<main>` está vazio).

- [ ] **Step 3: Criar `src/components/Icon.astro`**

```astro
---
interface Props {
  name: 'github' | 'linkedin' | 'mail' | 'download' | 'arrow';
}

const { name } = Astro.props;
---

{
  name === 'github' && (
    <svg class="icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  )
}
{
  name === 'linkedin' && (
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
{
  name === 'mail' && (
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}
{
  name === 'download' && (
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 4v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  )
}
{
  name === 'arrow' && (
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}
```

- [ ] **Step 4: Criar `src/components/Hero.astro`**

```astro
---
import { Image } from 'astro:assets';
import photo from '../assets/photo.jpg';
import type { CV } from '../content/types';
import { withBase } from '../lib/url';
import Icon from './Icon.astro';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const { person, ui } = cv;
---

<section class="hero shell" aria-labelledby="hero-title">
  <div class="hero-text">
    <p class="eyebrow enter" style="--i: 0">{person.title}</p>
    <h1 id="hero-title" class="hero-title enter" style="--i: 1">{person.headline}</h1>
    <p class="hero-intro enter" style="--i: 2">{person.intro}</p>
    <div class="hero-actions enter" style="--i: 3">
      <a class="btn btn-primary" href={withBase(person.cvPdf)} download><Icon name="download" />{ui.downloadCv}</a>
      <a class="btn btn-ghost" href={`mailto:${person.email}`}><Icon name="mail" />{ui.contactMe}</a>
    </div>
    <div class="hero-meta enter" style="--i: 4">
      <a class="icon-link" href={person.github} target="_blank" rel="me noopener noreferrer" aria-label="GitHub"><Icon name="github" /></a>
      <a class="icon-link" href={person.linkedin} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a>
      <span class="location">{person.location}</span>
    </div>
  </div>
  <figure class="hero-photo enter" style="--i: 5">
    <Image
      src={photo}
      alt={ui.photoAlt}
      widths={[360, 720]}
      sizes="(min-width: 880px) 340px, 180px"
      format="webp"
      quality={72}
      loading="eager"
      fetchpriority="high"
    />
  </figure>
</section>
```

- [ ] **Step 5: Criar `src/components/Experience.astro`**

```astro
---
import type { CV } from '../content/types';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const { ui } = cv;
---

<section id="experience" class="section" aria-labelledby="experience-title">
  <div class="shell">
    <header class="section-head">
      <p class="eyebrow">{ui.experienceEyebrow}</p>
      <h2 id="experience-title" class="section-title">{ui.experienceHeading}</h2>
    </header>
    {
      cv.experience.map((company) => (
        <article class="company">
          <header class="company-head reveal">
            <h3 class="company-name">{company.name}</h3>
            <span class="mono muted">{company.location}</span>
          </header>
          <ol class="timeline" data-timeline>
            {company.roles.map((role) => (
              <li class="role reveal">
                <span class="role-dot" aria-hidden="true" />
                <div class="role-head">
                  <h4 class="role-title">
                    {role.title}
                    {role.current && <span class="badge">{ui.current}</span>}
                  </h4>
                  <p class="role-period mono">{role.period}</p>
                </div>
                <ul class="bullets">
                  {role.bullets.map((bullet) => <li>{bullet}</li>)}
                </ul>
                <ul class="tags" aria-label="Stack">
                  {role.tags.map((tag) => <li>{tag}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </article>
      ))
    }
    <aside class="earlier reveal" aria-labelledby="earlier-title">
      <h3 id="earlier-title" class="earlier-title">{ui.earlierHeading}</h3>
      <p class="earlier-name">
        {cv.earlier.name} <span class="mono muted">· {cv.earlier.period} · {cv.earlier.location}</span>
      </p>
      <p class="muted">{cv.earlier.summary}</p>
    </aside>
  </div>
</section>
```

- [ ] **Step 6: Criar `src/components/Projects.astro`**

```astro
---
import type { CV } from '../content/types';
import Icon from './Icon.astro';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const { ui } = cv;
---

<section id="projects" class="section section-flush-top" aria-labelledby="projects-title">
  <div class="shell">
    <header class="section-head">
      <p class="eyebrow">{ui.projectsEyebrow}</p>
      <h2 id="projects-title" class="section-title">{ui.projectsHeading}</h2>
    </header>
    <ul class="cards">
      {
        cv.projects.map((project) => (
          <li class="card reveal">
            <h3 class="card-title">{project.name}</h3>
            <p class="card-text">{project.description}</p>
            <ul class="tags" aria-label="Stack">
              {project.tags.map((tag) => <li>{tag}</li>)}
            </ul>
            <div class="card-links">
              {project.links.map((link) => (
                <a class="arrow-link" href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <Icon name="arrow" />
                </a>
              ))}
            </div>
          </li>
        ))
      }
    </ul>
    <p class="see-all">
      <a class="arrow-link" href={cv.githubAll} target="_blank" rel="noopener noreferrer">
        {ui.seeAllGithub}
        <Icon name="arrow" />
      </a>
    </p>
  </div>
</section>
```

- [ ] **Step 7: Criar `src/components/Stack.astro`**

```astro
---
import type { CV } from '../content/types';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const { ui } = cv;
---

<section id="stack" class="section band-dark" aria-labelledby="stack-title">
  <div class="shell">
    <header class="section-head">
      <p class="eyebrow">{ui.stackEyebrow}</p>
      <h2 id="stack-title" class="section-title">{ui.stackHeading}</h2>
    </header>
    <div class="skill-grid">
      {
        cv.skills.map((group) => (
          <div class="skill-group reveal">
            <h3 class="skill-label mono">{group.label}</h3>
            <ul class="chips">
              {group.items.map((item) => <li>{item}</li>)}
            </ul>
          </div>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 8: Criar `src/components/Education.astro`**

```astro
---
import type { CV } from '../content/types';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const { ui } = cv;
---

<section id="education" class="section" aria-labelledby="education-title">
  <div class="shell">
    <header class="section-head">
      <p class="eyebrow">{ui.educationEyebrow}</p>
      <h2 id="education-title" class="section-title">{ui.educationHeading}</h2>
    </header>
    <div class="edu-grid">
      <div class="reveal">
        <h3 class="edu-label mono">{ui.educationLabel}</h3>
        <p class="edu-school">{cv.education.school}</p>
        <p class="muted">{cv.education.course} · {cv.education.location}</p>
      </div>
      <div class="reveal">
        <h3 class="edu-label mono">{ui.certificationsLabel}</h3>
        {
          cv.certifications.map((group) => (
            <div class="cert-group">
              <p class="cert-issuer">{group.issuer}</p>
              <ul class="cert-items">
                {group.items.map((item) => <li>{item}</li>)}
              </ul>
            </div>
          ))
        }
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 9: Criar `src/components/Writing.astro`** (não renderiza nada enquanto `writing` estiver vazio)

```astro
---
import type { CV } from '../content/types';
import Icon from './Icon.astro';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const posts = cv.writing ?? [];
---

{
  posts.length > 0 && (
    <section id="writing" class="section section-flush-top" aria-labelledby="writing-title">
      <div class="shell">
        <header class="section-head">
          <h2 id="writing-title" class="section-title">{cv.ui.writingHeading}</h2>
        </header>
        <ul class="posts">
          {posts.map((post) => (
            <li class="reveal">
              <a class="arrow-link" href={post.href} target="_blank" rel="noopener noreferrer">
                {post.title}
                <Icon name="arrow" />
              </a>
              <span class="mono muted">{post.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 10: Criar `src/components/Contact.astro`**

```astro
---
import type { CV } from '../content/types';
import { withBase } from '../lib/url';
import Icon from './Icon.astro';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const { person, ui } = cv;
---

<section id="contact" class="band-dark contact" aria-labelledby="contact-title">
  <div class="shell">
    <p class="eyebrow">{ui.contactEyebrow}</p>
    <h2 id="contact-title" class="contact-title">{ui.contactHeading}</h2>
    <p class="contact-text">{ui.contactText}</p>
    <a class="contact-email link" href={`mailto:${person.email}`}>{person.email}</a>
    <div class="contact-actions">
      <a class="btn btn-light" href={withBase(person.cvPdf)} download><Icon name="download" />{ui.downloadCv}</a>
      <a class="btn btn-outline-light" href={person.linkedin} target="_blank" rel="me noopener noreferrer"><Icon name="linkedin" />LinkedIn</a>
      <a class="btn btn-outline-light" href={person.github} target="_blank" rel="me noopener noreferrer"><Icon name="github" />GitHub</a>
    </div>
  </div>
</section>
```

- [ ] **Step 11: Criar `src/components/Footer.astro`**

```astro
---
import type { CV } from '../content/types';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
const year = new Date().getFullYear();
---

<footer class="band-dark site-footer">
  <div class="shell footer-inner">
    <span>© {year} {cv.person.name}</span>
    <span>{cv.ui.builtWith}</span>
  </div>
</footer>
```

- [ ] **Step 12: Atualizar `src/components/Page.astro`**

```astro
---
import type { CV } from '../content/types';
import Contact from './Contact.astro';
import Education from './Education.astro';
import Experience from './Experience.astro';
import Footer from './Footer.astro';
import Header from './Header.astro';
import Hero from './Hero.astro';
import Projects from './Projects.astro';
import Stack from './Stack.astro';
import Writing from './Writing.astro';

interface Props {
  cv: CV;
}

const { cv } = Astro.props;
---

<Header cv={cv} />
<main id="main">
  <Hero cv={cv} />
  <Experience cv={cv} />
  <Projects cv={cv} />
  <Writing cv={cv} />
  <Stack cv={cv} />
  <Education cv={cv} />
  <Contact cv={cv} />
</main>
<Footer cv={cv} />
```

- [ ] **Step 13: Criar `src/styles/sections.css`**

```css
/* Hero */
.hero {
  display: grid;
  gap: 32px;
  align-items: center;
  padding-block: 48px 72px;
}

@media (min-width: 880px) {
  .hero {
    grid-template-columns: 1fr 340px;
    gap: 64px;
    padding-block: 96px 112px;
  }
}

.hero-title {
  margin-top: 16px;
  font-size: clamp(2.25rem, 5.2vw, 3.5rem);
  line-height: 1.06;
  letter-spacing: -0.03em;
  font-weight: 700;
  text-wrap: balance;
}

.hero-intro {
  margin-top: 20px;
  max-width: 60ch;
  font-size: 1.125rem;
  color: var(--slate);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 14px;
  margin-top: 24px;
  color: var(--slate);
}

.icon-link {
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  color: var(--ink);
  transition: transform 0.2s var(--ease), border-color 0.2s, color 0.2s;
}

.icon-link:hover {
  transform: translateY(-1px);
  border-color: var(--teal);
  color: var(--teal-ink);
}

.location {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.hero-photo {
  order: -1;
  width: 180px;
}

@media (min-width: 880px) {
  .hero-photo {
    order: 0;
    width: 100%;
  }
}

.hero-photo img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 50% 18%;
  border-radius: 20px;
  background: var(--teal);
}

/* Experiência */
.company-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.company-name {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.timeline {
  position: relative;
  display: grid;
  gap: 40px;
  padding-left: 32px;
}

.timeline::before,
.timeline::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
}

.timeline::before {
  background: var(--line);
}

.timeline::after {
  background: var(--teal);
  transform-origin: top;
  transform: scaleY(var(--progress, 1));
}

.role {
  position: relative;
}

.role-dot {
  position: absolute;
  z-index: 1;
  left: -32px;
  top: 6px;
  width: 14px;
  height: 14px;
  border: 2px solid var(--teal);
  border-radius: 50%;
  background: var(--teal);
  box-shadow: 0 0 0 4px var(--paper);
  transition: background-color 0.3s, border-color 0.3s;
}

.role-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 16px;
}

.role-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.125rem;
  font-weight: 600;
}

.badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgb(42 157 150 / 0.1);
  color: var(--teal-ink);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.role-period {
  color: var(--slate);
}

.bullets {
  display: grid;
  gap: 8px;
  max-width: var(--measure);
  margin-top: 12px;
}

.bullets li {
  position: relative;
  padding-left: 18px;
  color: var(--ink-soft);
}

.bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.8em;
  width: 8px;
  height: 1px;
  background: var(--teal);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}

.tags li {
  padding: 3px 9px;
  border-radius: 6px;
  background: var(--chalk);
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.earlier {
  max-width: var(--measure);
  margin-top: 56px;
  padding: 24px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius);
}

.earlier-title,
.edu-label {
  color: var(--slate);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.earlier-name {
  margin-top: 8px;
  font-weight: 600;
}

.earlier-name + p {
  margin-top: 6px;
}

/* Projetos */
.section-flush-top {
  padding-top: 0;
}

.cards {
  display: grid;
  gap: 16px;
}

@media (min-width: 880px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--white);
  transition: transform 0.25s var(--ease), border-color 0.25s, box-shadow 0.25s;
}

.card:hover {
  transform: translateY(-2px);
  border-color: rgb(42 157 150 / 0.45);
  box-shadow: 0 10px 30px -18px rgb(14 26 36 / 0.35);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.card-text {
  color: var(--slate);
  font-size: 0.96875rem;
}

.card .tags {
  margin-top: auto;
}

.card-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.arrow-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--teal-ink);
}

.arrow-link .icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s var(--ease);
}

.arrow-link:hover .icon {
  transform: translate(2px, -2px);
}

.see-all {
  margin-top: 28px;
  font-weight: 600;
}

.posts {
  display: grid;
  gap: 12px;
}

.posts li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

/* Faixas escuras */
.band-dark {
  background: var(--ink);
  color: var(--paper);
}

.band-dark .eyebrow {
  color: var(--teal-light);
}

.skill-grid {
  display: grid;
  gap: 28px;
}

@media (min-width: 720px) {
  .skill-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px 48px;
  }
}

.skill-label {
  color: var(--mist);
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.chips li {
  padding: 6px 12px;
  border: 1px solid rgb(250 250 248 / 0.16);
  border-radius: 999px;
  font-size: 0.9375rem;
  transition: border-color 0.2s, color 0.2s;
}

.chips li:hover {
  border-color: var(--teal-light);
  color: var(--teal-light);
}

/* Formação */
.edu-grid {
  display: grid;
  gap: 32px;
}

@media (min-width: 720px) {
  .edu-grid {
    grid-template-columns: 1fr 1.4fr;
    gap: 48px;
  }
}

.edu-school {
  margin-top: 10px;
  font-weight: 600;
}

.edu-label + .cert-group {
  margin-top: 10px;
}

.cert-group + .cert-group {
  margin-top: 18px;
}

.cert-issuer {
  font-weight: 600;
}

.cert-items {
  color: var(--slate);
}

/* Contato e footer */
.contact {
  padding-block: 88px 56px;
}

.contact-title {
  margin-top: 12px;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-weight: 700;
}

.contact-text {
  max-width: 52ch;
  margin-top: 16px;
  color: var(--mist);
  font-size: 1.125rem;
}

.contact-email {
  display: inline-block;
  margin-top: 28px;
  color: var(--teal-light);
  font-size: clamp(1.25rem, 3.4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.btn-light {
  background: var(--paper);
  color: var(--ink);
}

.btn-light:hover {
  background: var(--teal-light);
}

.btn-outline-light {
  border-color: rgb(250 250 248 / 0.25);
  color: var(--paper);
}

.btn-outline-light:hover {
  border-color: var(--teal-light);
  color: var(--teal-light);
}

.site-footer {
  padding-bottom: 40px;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding-top: 24px;
  border-top: 1px solid rgb(250 250 248 / 0.12);
  color: var(--mist);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
```

- [ ] **Step 14: Importar `sections.css` em `src/layouts/Base.astro`**, logo após a linha `import '../styles/base.css';`:

```ts
import '../styles/sections.css';
```

- [ ] **Step 15: Rodar e ver passar**

Run: `bun run check && bun run build && bun run test:build`
Expected: `0 errors`; todos os testes de `head.test.ts` e `sections.test.ts` PASS.

- [ ] **Step 16: Commit**

```bash
git add src/components src/styles/sections.css src/layouts/Base.astro tests/build/sections.test.ts
git commit -m "feat: add hero, experience timeline, projects, stack, education and contact sections"
```

---

### Task 6: Animações e menu mobile (progressive enhancement)

**Files:**
- Create: `src/scripts/reveal.ts`, `src/styles/motion.css`
- Modify: `src/layouts/Base.astro` (classe `js` inline no head, import de `motion.css`, script no fim do body)
- Test: `tests/build/motion.test.ts`

**Interfaces:**
- Consumes: `timelineProgress` (Task 3); classes `.enter`, `.reveal`, `[data-timeline]`, `.role`, `.role-dot`, `.card`, `.menu-toggle`, `#nav-list` (Tasks 4 e 5).
- Produces: classes de estado `html.js` (inline no head: menu e entrada do hero), `html.motion` (adicionada pelo `reveal.ts`: reveal e timeline), `.is-visible`, `.is-lit`, `.is-open`; variável CSS `--progress`.

- [ ] **Step 1: Escrever o teste que falha, `tests/build/motion.test.ts`**

```ts
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
    expect(all).toMatch(/classList\.add\(["']motion["']\)/);
    expect(Buffer.byteLength(all)).toBeLessThan(3 * 1024);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run build && bun run test:build`
Expected: FAIL em "classe js aplicada…", "estados escondidos…", "impressão…" e "script de interação…".

- [ ] **Step 3: Criar `src/styles/motion.css`**

```css
@keyframes enter {
  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* Estados escondidos só existem sem pedido de movimento reduzido.
   .js (inline no head) → entrada do hero, que é só CSS e termina visível sozinha.
   .motion (adicionada pelo reveal.ts depois de montar o observer) → reveal e timeline.
   Sem JS, com o script quebrado ou com reduced-motion, tudo aparece no estado final. */
@media (prefers-reduced-motion: no-preference) {
  .js .enter {
    opacity: 0;
    translate: 0 8px;
    animation: enter 0.7s var(--ease) forwards;
    animation-delay: calc(var(--i, 0) * 80ms + 60ms);
  }

  .motion .reveal {
    opacity: 0;
    translate: 0 12px;
    transition: opacity 0.6s var(--ease), translate 0.6s var(--ease);
  }

  .motion .card.reveal {
    transition: opacity 0.6s var(--ease), translate 0.6s var(--ease), transform 0.25s var(--ease),
      border-color 0.25s, box-shadow 0.25s;
  }

  .motion .reveal.is-visible {
    opacity: 1;
    translate: 0 0;
  }

  .motion [data-timeline] {
    --progress: 0;
  }

  .motion .timeline::after {
    transition: transform 0.2s linear;
  }

  .motion .role:not(.is-lit) .role-dot {
    background: var(--paper);
    border-color: var(--line-strong);
  }
}

@media print {
  .site-header,
  .skip,
  .menu-toggle {
    display: none;
  }

  .motion .reveal,
  .js .enter {
    opacity: 1 !important;
    translate: none !important;
    animation: none !important;
  }

  .band-dark {
    background: #fff;
    color: #000;
  }
}
```

- [ ] **Step 4: Criar `src/scripts/reveal.ts`**

```ts
import { timelineProgress } from '../lib/timeline';

function setupMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const list = document.getElementById('nav-list');
  if (!toggle || !list) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    list.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  list.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
}

function setupReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  items.forEach((el) => observer.observe(el));
}

function setupTimeline(): void {
  const timelines = document.querySelectorAll<HTMLElement>('[data-timeline]');
  if (timelines.length === 0) return;

  let scheduled = false;
  const update = () => {
    scheduled = false;
    const anchor = window.innerHeight * 0.6;
    timelines.forEach((timeline) => {
      const rect = timeline.getBoundingClientRect();
      timeline.style.setProperty('--progress', timelineProgress(anchor, rect.top, rect.height).toFixed(3));
      timeline.querySelectorAll<HTMLElement>('.role').forEach((role) => {
        role.classList.toggle('is-lit', role.getBoundingClientRect().top < anchor);
      });
    });
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

setupMenu();
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setupReveal();
  setupTimeline();
  // Só esconde os blocos depois que tudo acima rodou: se algo falhar, o conteúdo continua visível.
  document.documentElement.classList.add('motion');
}
```

- [ ] **Step 5: Atualizar `src/layouts/Base.astro`**

Adicionar o import do CSS de movimento logo após `import '../styles/sections.css';`:

```ts
import '../styles/motion.css';
```

Adicionar dentro do `<head>`, logo depois de `<meta name="viewport" …>`:

```astro
    <script is:inline>document.documentElement.classList.add('js');</script>
```

Adicionar logo antes de `</body>`:

```astro
    <script>
      import '../scripts/reveal.ts';
    </script>
```

- [ ] **Step 6: Rodar e ver passar**

Run: `bun run check && bun run build && bun run test:build`
Expected: `0 errors`; todos os testes de `head`, `sections` e `motion` PASS.

- [ ] **Step 7: Conferência visual rápida**

Run: `bun run dev` e abrir `http://localhost:4321/`. Conferir:
- O hero entra em sequência.
- Os blocos aparecem ao rolar.
- A linha da timeline se desenha e os pontos acendem.
- Em largura < 760 px, o botão "Menu" abre e fecha a navegação.

Encerrar o servidor (`Ctrl+C`).

- [ ] **Step 8: Commit**

```bash
git add src/scripts/reveal.ts src/styles/motion.css src/layouts/Base.astro tests/build/motion.test.ts
git commit -m "feat: add scroll reveal, timeline drawing and mobile menu with no-JS fallback"
```

---

### Task 7: Imagens de prévia (OG), robots.txt e orçamento de peso

**Files:**
- Create: `scripts/og.ts`, `public/robots.txt`
- Generated: `public/og-pt.png`, `public/og-en.png`
- Test: `tests/build/assets.test.ts`

**Interfaces:**
- Consumes: `content`, `LOCALES` (Task 3), `escapeXml`, `wrapText` (Task 3), `src/assets/photo.jpg`.
- Produces: `public/og-<locale>.png` 1200×630.

- [ ] **Step 1: Escrever o teste que falha, `tests/build/assets.test.ts`**

```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `bun run build && bun run test:build`
Expected: FAIL em "robots.txt e favicon" e "imagem OG…" (`ENOENT`). Os testes de peso devem passar já (estimativa: ~22 KB de HTML/CSS/JS gzip + ~65 KB de fontes + ~50 KB de foto). Se falharem, ver no `console.log` qual parcela estourou: se for `photo`, reduzir `quality` no `Hero.astro`; se for `fonts`, trocar o JetBrains Mono por `ui-monospace` (remover o import em `Base.astro`).

- [ ] **Step 3: Criar `public/robots.txt`**

```
User-agent: *
Allow: /
```

- [ ] **Step 4: Criar `scripts/og.ts`**

```ts
// Gera as imagens de prévia (Open Graph) a partir do conteúdo e da foto.
// Rode com `bun run og` sempre que mudar título, manchete ou foto, e faça commit dos PNGs.
import sharp from 'sharp';
import { LOCALES, content } from '../src/lib/i18n';
import { escapeXml, wrapText } from '../src/lib/xml';

const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO_WIDTH = 440;
const SITE_HOST = 'matheus-amon.github.io';
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

for (const locale of LOCALES) {
  const cv = content[locale];
  const headline = wrapText(cv.person.headline, 26)
    .map((line, i) => `<tspan x="72" dy="${i === 0 ? 0 : 60}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="100%" height="100%" fill="#FAFAF8"/>
  <rect width="12" height="${HEIGHT}" fill="#2A9D96"/>
  <text x="72" y="120" font-family="${FONT}" font-size="22" letter-spacing="3" fill="#1F7A75">${escapeXml(cv.person.title.toUpperCase())}</text>
  <text x="72" y="230" font-family="${FONT}" font-size="50" font-weight="700" fill="#0E1A24">${headline}</text>
  <text x="72" y="540" font-family="${FONT}" font-size="30" font-weight="700" fill="#0E1A24">${escapeXml(cv.person.name)}</text>
  <text x="72" y="580" font-family="${FONT}" font-size="20" fill="#5A6672">${SITE_HOST}</text>
</svg>`;

  const photo = await sharp('src/assets/photo.jpg')
    .resize(PHOTO_WIDTH, HEIGHT, { fit: 'cover', position: 'north' })
    .toBuffer();

  const out = `public/og-${locale}.png`;
  await sharp(Buffer.from(svg))
    .composite([{ input: photo, left: WIDTH - PHOTO_WIDTH, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${out}`);
}
```

- [ ] **Step 5: Gerar as imagens e conferir visualmente**

Run: `bun run og`
Expected: `✓ public/og-pt.png` e `✓ public/og-en.png`. Abrir os dois PNGs e conferir:
- o texto não invade a foto;
- "Data & AI" aparece com o "&";
- o rosto não está cortado.

Se a manchete passar de 3 linhas, reduzir `wrapText(…, 26)` para 24.

- [ ] **Step 6: Rodar e ver passar**

Run: `bun run build && bun run test:build`
Expected: todos os testes de `tests/build` PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/og.ts public/robots.txt public/og-pt.png public/og-en.png tests/build/assets.test.ts
git commit -m "feat: add Open Graph images, robots.txt and weight budget tests"
```

---

### Task 8: Deploy (GitHub Pages), README e verificação final

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`
- Verify: o projeto inteiro

**Interfaces:**
- Consumes: script `verify` (Task 1) e todo o restante.

- [ ] **Step 1: Criar `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.4.2
      - run: bun install --frozen-lockfile
      - run: bun run verify
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Criar `README.md`**

````markdown
# matheus-amon.github.io

Landing page / CV online de **Matheus Amon Marçal**: Engenheiro de Software, Dados e IA.
Estática, bilíngue (PT em `/`, EN em `/en/`), feita com [Astro](https://astro.build) e [Bun](https://bun.sh).

## Rodando localmente

```bash
bun install
bun run dev        # http://localhost:4321
bun run verify     # type check + testes + build + testes do build
```

## Onde editar

| O quê | Onde |
|---|---|
| Todo o texto (PT) | `src/content/pt.ts` |
| Todo o texto (EN) | `src/content/en.ts` (mesma estrutura; o `bun run check` acusa campo faltando) |
| Foto | substitua `src/assets/photo.jpg` (retrato; o recorte é feito por CSS) |
| CV em PDF | substitua `public/cv-pt.pdf` e `public/cv-en.pdf` |
| Imagem de prévia (LinkedIn/WhatsApp) | rode `bun run og` depois de mudar título, manchete ou foto |
| Cores e fontes | `src/styles/base.css` (tokens em `:root`) |
| Adicionar artigos | preencha `writing: [{ title, href, date }]` nos dois arquivos de conteúdo; a seção aparece sozinha |

## Publicando no GitHub Pages (recomendado)

1. Crie no GitHub um repositório público chamado **`matheus-amon.github.io`**.
2. Na pasta do projeto:
   ```bash
   git remote add origin git@github.com:matheus-amon/matheus-amon.github.io.git
   git push -u origin main
   ```
3. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. O workflow `.github/workflows/deploy.yml` roda a cada push na `main`. O site fica em **https://matheus-amon.github.io**.

> **Usou outro nome de repositório?** O site vai para `https://matheus-amon.github.io/<nome>/`.
> Adicione `base: '/<nome>'` em `astro.config.mjs`. Os links internos já respeitam o `base`.

## Alternativa: Vercel

1. Em vercel.com → **Add New → Project**, importe o repositório.
2. Framework: **Astro** (detectado sozinho). Install command: `bun install`. Build command: `bun run build`. Output: `dist`.
3. Troque `site` em `astro.config.mjs` para a URL `https://<projeto>.vercel.app` e rode `bun run og`.
````

- [ ] **Step 3: Rodar a verificação completa**

Run: `bun install --frozen-lockfile && bun run verify`
Expected: `0 errors` no check, todos os testes unitários e de build PASS, `2 page(s) built`.

- [ ] **Step 4: Screenshots no desktop, no celular e sem JS**

Run, em background: `bun run preview` (porta 4321). Depois:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p /tmp/cv-shots
"$CHROME" --headless=new --hide-scrollbars --virtual-time-budget=4000 --window-size=1440,4200 --screenshot=/tmp/cv-shots/pt-desktop.png http://localhost:4321/
"$CHROME" --headless=new --hide-scrollbars --virtual-time-budget=4000 --window-size=390,7000 --screenshot=/tmp/cv-shots/pt-mobile.png http://localhost:4321/
"$CHROME" --headless=new --hide-scrollbars --virtual-time-budget=4000 --window-size=1440,4200 --screenshot=/tmp/cv-shots/en-desktop.png http://localhost:4321/en/
"$CHROME" --headless=new --hide-scrollbars --blink-settings=scriptEnabled=false --window-size=390,7000 --screenshot=/tmp/cv-shots/pt-mobile-nojs.png http://localhost:4321/
```

(Ao executar, use o scratchpad da sessão no lugar de `/tmp/cv-shots`.)

Abrir cada PNG e conferir:
- **Desktop:** foto à direita, timeline com os 3 cargos e a linha turquesa, 3 cards lado a lado, faixas escuras em Stack e Contato.
- **Celular (390 px):** sem scroll horizontal (nada cortado à direita), foto acima do texto, header numa linha com PT|EN, CV e Menu.
- **Sem JS:** todo o conteúdo visível, nada em branco, timeline cheia e navegação visível abaixo do header.

Encerrar o preview.

- [ ] **Step 5: Releitura de fidelidade**

Ler `src/content/pt.ts` e `en.ts` lado a lado com a spec §3 e conferir que nenhuma frase afirma algo que não está no CV ou nas respostas do Matheus.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "ci: add GitHub Pages deploy workflow and README"
```

- [ ] **Step 7: Estado final**

Run: `git status --short && git log --oneline`
Expected: árvore limpa e um commit por task. Sem remote configurado (`git remote -v` vazio).

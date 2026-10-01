# CV Landing Page — Matheus Amon Marçal

**Data:** 2026-09-30
**Status:** aprovada (2026-09-30)

## 1. Objetivo

Landing page pessoal, de página única, que **complementa** o CV em PDF e causa a primeira impressão em recrutadores e tech leads. É estática, leve, bilíngue (PT/EN) e fica hospedada de graça em `https://matheus-amon.github.io`.

**Critérios de sucesso**

- Todo o conteúdo é fiel ao CV e às respostas do Matheus. Nenhum número ou conquista foi inventado.
- As palavras-chave (headline, resumo, experiência e skills) são as mesmas do CV e do LinkedIn, para dar match nos campos de peso. Isso vem da mentoria com Daniel Romero.
- Orçamento de peso: HTML + CSS + JS + fontes latin usadas < 100 KB; maior variante da foto < 80 KB; JS ~2 KB.
- Funciona sem JS, com animações desligadas e no celular.
- Ao colar o link no LinkedIn ou no WhatsApp, aparece uma prévia correta em cada idioma.

**Referência visual:** https://infoslack.pro. Dela vêm a coluna única, o minimalismo, o ritmo de faixas claras e escuras e a fonte mono para os detalhes.

## 2. Fora de escopo (por decisão explícita)

- Telefone/WhatsApp no site: fica só no PDF.
- Seções de artigos, conteúdo, open source e "estudando agora". O código deixa um slot fácil de adicionar depois.
- Modo escuro e botão de tema: **só tema claro**.
- Domínio próprio, analytics e formulário de contato.

## 3. Conteúdo

O texto final mora em `src/content/pt.ts` e `src/content/en.ts`. A versão EN parte do `CV___English.pdf`, com linguagem no mesmo nível do CV em inglês, sem floreios.

### 3.1 Identidade

| Campo | PT | EN |
|---|---|---|
| Nome | Matheus Amon Marçal | Matheus Amon Marçal |
| Título (linha acima da manchete) | Engenheiro de Software, Dados e IA | Software Engineer, Data & AI |
| Manchete | Construo pipelines de dados e sistemas de IA que rodam em produção. | I build data pipelines and AI systems that run in production. |
| Localização | Paraíba, Brasil · Remoto | Paraíba, Brazil · Remote |
| E-mail | matheus.amon@outlook.com | idem |
| LinkedIn | https://www.linkedin.com/in/matheus-amon/ | idem |
| GitHub | https://github.com/matheus-amon | idem |

**Parágrafo de apresentação (PT):** Profissional autodidata de engenharia de dados e IA, com Python, SQL e AWS no dia a dia. Atuo de pipelines ETL/ELT e modelagem analítica com dbt até RAG e agentes de IA, sempre buscando eficiência operacional, custo baixo e decisões orientadas por dados.

**(EN):** Self-taught data and AI engineer working daily with Python, SQL and AWS. I work from ETL/ELT pipelines and analytics modeling with dbt to RAG and AI agents, always aiming for operational efficiency, low cost and data-driven decisions.

**Regra do título:** o topo da página é **posicionamento**. A timeline mostra os **cargos reais**, exatamente como estão no CV (opção A, escolhida pelo Matheus).

**Tempo de experiência:** o texto diz "em tecnologia desde 2024" e não cita uma contagem de anos, porque de abr/2024 até hoje são cerca de 2,5 anos. Os 6 anos de mercado ficam implícitos na linha da Redepharma.

### 3.2 Experiência (formato: o que fiz → com o quê → resultado)

A Singlesoftware aparece como **um bloco com timeline de 3 cargos**, que mostra a progressão interna. "Casas de apostas" e "cassino" foram suavizados para **iGaming**.

**Analista de Dados / Data Analyst** (jan/2026 – presente)
1. Automatizo a operação com microsserviços serverless de IA generativa na AWS (FastAPI, Lambda, S3, SageMaker, Bedrock), com infraestrutura praticamente a custo zero: só o Bedrock é cobrado, e o resto foi otimizado para o free tier.
2. Mantenho e evoluo pipelines de RAG orquestrados com Lambda e Step Functions, com ingestões personalizadas de múltiplas fontes que melhoraram a governança dos dados.
3. Modelo dados brutos em camadas analíticas com dbt e mantenho dashboards no Metabase usados pelo time de marketing e pelos decisores da operação.

**Analista Financeiro / Financial Analyst** (out/2024 – jan/2026)
1. Criei dashboards estratégicos em Power BI para o posicionamento de jogos em plataformas de iGaming, que embasam decisões de campanha.
2. Desenvolvi agentes de IA para consulta a documentos internos do time comercial, agilizando o acesso à informação e a tomada de decisão.
3. Automatizei com pipelines em Python a validação, o confronto e a conciliação de dados entre fornecedores e sistemas internos, garantindo a integridade das informações financeiras.

**Analista de Qualidade de Software Júnior / Junior Software QA Analyst** (abr/2024 – out/2024)
1. Validei e testei as entregas do time de desenvolvimento.
2. Construí relatórios em Power BI sobre comportamento de usuários e fluxos financeiros (saques e depósitos) em plataformas de iGaming.
3. Substituí cálculos e transformações manuais em Excel por processos ETL no Microsoft Fabric.

Os itens sem número (agentes de IA e conciliação) ficam qualitativos de propósito: o Matheus não tem a métrica.

**Redepharma (fev/2021 – abr/2024), em uma linha:** "De Jovem Aprendiz a Assistente de Prevenção de Perdas, com gestão interina da equipe. Foi onde comecei com dados: relatórios em Excel e Power BI para o centro de distribuição."

### 3.3 Projetos (3 cards + link "ver tudo no GitHub")

| Projeto | Descrição (PT) | Tags | Links |
|---|---|---|---|
| Data Warehouse stack | Data warehouse local de ponta a ponta: ambiente com Terraform e docker-compose, orquestração com Airflow e transformação com dbt. | Terraform, Docker, Airflow, dbt, Python | `dwh-config-local`, `dwh-airflow`, `dwh-dbt` |
| amon-claw | Runtime de agente de IA pessoal em Python, com Docker Compose e documentação em MkDocs. | Python, Docker, LLM, MkDocs | `amon-claw` |
| One Billion Row Challenge | Leitura e processamento de 1 bilhão de linhas com Polars e DuckDB, comparando desempenho. Desafio da Jornada de Dados. | Python, Polars, DuckDB | `one-billion-row-challenge` |

As descrições vêm das descrições dos próprios repositórios e não afirmam nada além delas.

### 3.4 Stack (os mesmos grupos do CV)

- **Linguagens e ferramentas:** Python, SQL, Git, Docker
- **Dados e BI:** dbt, Airflow, Microsoft Fabric, Databricks, Power BI, Metabase
- **Cloud e IA:** AWS (S3, Lambda, Step Functions, SageMaker, Bedrock), FastAPI, LangGraph, RAG
- **Idiomas:** Português (nativo), Inglês (intermediário)

### 3.5 Formação e certificações

- UFCG: Geografia (incompleto)
- Udemy (Ed Donner): The Complete Agentic AI Engineering Course (2025); AI in Production: Gen AI and Agentic AI at Scale
- LangChain Academy: LangGraph Essentials (Python); Deep Agents with LangGraph
- Databricks Fundamentals Accreditation; Jornada de Dados (Engenharia de Dados)

## 4. Estrutura da página

1. **Header fixo:** nome; âncoras Experiência · Projetos · Stack · Contato (no celular, viram menu); botão `PT | EN`; botão "CV".
2. **Hero:** título em mono e turquesa, manchete, parágrafo, botões **Baixar CV** e **Fale comigo** (`mailto:`), ícones do GitHub e do LinkedIn, localização. Foto à direita no desktop e acima no celular.
3. **Experiência:** bloco Singlesoftware com timeline, depois a linha da Redepharma.
4. **Projetos:** 3 cards.
5. **Stack:** faixa escura (`ink`).
6. **Formação e certificações.**
7. **Contato:** faixa escura com "Vamos conversar?", e-mail, links e CV.
8. **Footer:** © 2026 Matheus Amon Marçal · feito com Astro.

## 5. Design visual

**Paleta, tirada da foto (só tema claro):**

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#FAFAF8` | fundo |
| `ink` | `#0E1A24` | texto principal e faixas escuras |
| `slate` | `#5A6672` | texto secundário |
| `teal` | `#2A9D96` | acento: título, links, pontos da timeline, tags |
| `teal-ink` | `#1F7A75` | hover e texto pequeno em turquesa sobre `paper` (contraste AA) |

Na faixa `ink`, o texto em turquesa usa um tom mais claro (cerca de `#5CC4BD`) para manter contraste AA.

**Tipografia:** Inter Tight Variable (um arquivo, ~44 KB latin) para títulos e corpo; JetBrains Mono 400 (~21 KB) para datas, tags e título. Self-hosted via `@fontsource`; o navegador baixa só o subset latin.

**Layout:** coluna de leitura com cerca de 720 px de largura máxima, hero mais largo (texto + foto), manchete de cerca de 56 px no desktop e 36 px no celular, bastante espaço em branco e gutter de 16 px no celular.

**Foto:** `src/assets/photo.jpg` (768×1376, retrato). Recorte em rosto e ombros com `object-position`, cantos arredondados e WebP em 2 tamanhos gerado pelo `astro:assets`.

### 5.1 Animações (CSS + ~1 KB de JS com `IntersectionObserver`)

1. **Entrada do hero:** fade + 8 px para cima, escalonado em cerca de 80 ms (título → manchete → texto → botões → foto).
2. **Scroll reveal:** blocos de experiência e cards de projeto aparecem uma vez, ao entrar na tela.
3. **Timeline:** a linha vertical da Singlesoftware se desenha conforme o scroll e os pontos dos cargos acendem em turquesa.
4. **Micro-interações:** links com sublinhado que cresce, cards que sobem 2 px no hover e transição curta no `PT | EN`.
5. **Acessibilidade:** `prefers-reduced-motion` desliga tudo. Os estados escondidos só existem sob `html.js`, então sem JS tudo aparece.

## 6. Arquitetura técnica

**Stack:** Astro (saída estática) + CSS próprio, sem framework de UI e sem Tailwind. Gerenciador e runtime: **Bun** (`bun install`, `bun run dev`, `bun run build`). Nada de npm ou yarn.

```
cv-landingpage/
├── public/
│   ├── cv-pt.pdf · cv-en.pdf     ← colocados pelo Matheus
│   ├── favicon.svg               ← monograma "MA"
│   ├── og-pt.png · og-en.png     ← 1200×630, gerados por script
│   └── robots.txt
├── scripts/og.ts                 ← gera os og-*.png (SVG → PNG via sharp), rodado com bun
├── src/
│   ├── assets/photo.jpg
│   ├── content/types.ts          ← tipo CV
│   ├── content/pt.ts · en.ts     ← todo o texto, tipado como CV
│   ├── components/               ← Header, Hero, Experience, Projects, Stack, Education, Contact, Footer, Icon
│   ├── layouts/Base.astro        ← <head>, SEO, OG, hreflang, JSON-LD, fontes
│   ├── pages/index.astro         ← PT em /
│   ├── pages/en/index.astro      ← EN em /en/
│   ├── scripts/reveal.ts         ← IntersectionObserver + timeline
│   ├── lib/                      ← i18n.ts, seo.ts, url.ts, timeline.ts, xml.ts
│   └── styles/                   ← base.css, sections.css, motion.css
├── .github/workflows/deploy.yml
├── astro.config.mjs              ← site: https://matheus-amon.github.io
└── README.md
```

**Decisões:**

- **Conteúdo separado do layout.** Os componentes recebem um objeto `CV` e não contêm texto fixo, salvo rótulos de UI, que também ficam no objeto. Se `en.ts` estiver incompleto, o type check (`astro check`) falha.
- **i18n:** duas páginas estáticas reais. O `PT | EN` é um `<a>` para a rota equivalente. Sem redirecionamento automático e sem `localStorage` (sem redirect, guardar a escolha não teria uso). Cada página tem `<html lang>`, `hreflang` alternado e `canonical` próprios.
- **CV para download:** PT baixa `/cv-pt.pdf` e EN baixa `/cv-en.pdf`, com o atributo `download`.
- **SEO:** `<title>` "Matheus Amon · Engenheiro de Software, Dados e IA" / "Matheus Amon · Software Engineer, Data & AI", meta description por idioma, Open Graph e Twitter card, e JSON-LD `ProfilePage` + `Person` (jobTitle, knowsAbout com as keywords do CV, sameAs com LinkedIn e GitHub).
- **Base path:** todo link interno passa por `withBase()` (usa `import.meta.env.BASE_URL`), então renomear o repositório só exige definir `base` no config.
- **Slot futuro:** o tipo `CV` tem `writing?: Post[]` opcional; quando houver conteúdo, a seção "Escritos" aparece.

## 7. Deploy

- **GitHub Pages (principal):** repositório `matheus-amon.github.io`. O workflow `deploy.yml`, a cada push na `main`, faz `oven-sh/setup-bun`, `bun install --frozen-lockfile`, `bun run build`, `actions/upload-pages-artifact` e `actions/deploy-pages`. Em Settings → Pages → Source, escolher *GitHub Actions*.
- **Se o repositório tiver outro nome**, o site vai para `/<nome>/` e é preciso definir `base` no `astro.config.mjs`. Isso fica documentado no README.
- **Vercel (alternativa):** importar o repositório. A Vercel detecta o Astro e o install command vira `bun install`. O `site` é ajustado para a URL `.vercel.app`.
- **Agora:** git local na `main`, **sem remote**. O Matheus zipa a pasta e continua em outra máquina.

## 8. Verificação antes da entrega

- `bun run build` e `astro check` sem erros.
- As duas páginas renderizam; screenshots no desktop (1440 px) e no celular (390 px).
- Links internos e externos válidos, `mailto` correto, botões do CV apontando para o arquivo certo.
- Sem JS e com `prefers-reduced-motion` todo o conteúdo fica visível.
- Peso da primeira carga medido em menos de 150 KB.
- Releitura de fidelidade: cada frase da página tem origem no CV ou numa resposta do Matheus.

## 9. Pendências do Matheus

- ~~Colocar os PDFs~~: feito, copiados de `~/Documents` para `public/cv-pt.pdf` e `public/cv-en.pdf`.
- Na outra máquina: criar o repositório, adicionar o remote, fazer o push e ativar o Pages.

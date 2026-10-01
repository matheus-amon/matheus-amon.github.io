import type { CV } from './types';

export const pt: CV = {
  locale: 'pt',
  meta: {
    title: 'Matheus Amon · Engenheiro de Software, Dados e IA',
    description:
      'Engenheiro de Software, Dados e IA. Pipelines ETL/ELT, modelagem com dbt, AWS serverless, RAG e agentes de IA em produção.',
    ogImage: '/og-pt.jpg',
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
      name: 'Iceberg Lakehouse',
      description:
        'Lakehouse de streaming sobre Apache Iceberg: Kafka/Redpanda → Flink → Iceberg → Trino, com observabilidade de qualidade de dados.',
      tags: ['Kafka', 'Redpanda', 'Flink', 'Iceberg', 'Trino'],
      links: [{ label: 'iceberg-lakehouse', href: 'https://github.com/matheus-amon/iceberg-lakehouse' }],
    },
    {
      name: 'Podcast ERP',
      description:
        'Monorepo TypeScript para operação de podcast: agenda, leads, orçamento e faturamento. Spec-driven, com API em ElysiaJS e Drizzle sobre Postgres, e testes que rodam de verdade no CI.',
      tags: ['TypeScript', 'Bun', 'ElysiaJS', 'Drizzle', 'Postgres'],
      links: [{ label: 'podcast', href: 'https://github.com/matheus-amon/podcast' }],
    },
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
      name: 'api-ingest-airflow',
      description:
        'Template de pipeline de ingestão sobre Airflow construído em torno de fronteiras de software: cliente de API, um contrato de DTO que valida na construção, orquestrador de serviço e repositório atrás de interface. Com testes e imagem de container.',
      tags: ['Airflow', 'Python', 'uv', 'pytest', 'Docker'],
      links: [{ label: 'api-ingest-airflow', href: 'https://github.com/matheus-amon/api-ingest-airflow' }],
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

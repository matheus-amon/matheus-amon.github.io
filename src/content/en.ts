import type { CV } from './types';

export const en: CV = {
  locale: 'en',
  meta: {
    title: 'Matheus Amon · Software Engineer, Data & AI',
    description:
      'Software Engineer, Data & AI. ETL/ELT pipelines, dbt modeling, serverless AWS, RAG and AI agents in production.',
    ogImage: '/og-en.jpg',
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
      name: 'Iceberg Lakehouse',
      description:
        'Streaming lakehouse on Apache Iceberg: Kafka/Redpanda → Flink → Iceberg → Trino, with data-quality observability.',
      tags: ['Kafka', 'Redpanda', 'Flink', 'Iceberg', 'Trino'],
      links: [{ label: 'iceberg-lakehouse', href: 'https://github.com/matheus-amon/iceberg-lakehouse' }],
    },
    {
      name: 'Podcast ERP',
      description:
        'TypeScript monorepo for podcast operations: agenda, leads, budget and billing. Spec-driven, with an ElysiaJS and Drizzle API over Postgres, and tests that actually run in CI.',
      tags: ['TypeScript', 'Bun', 'ElysiaJS', 'Drizzle', 'Postgres'],
      links: [{ label: 'podcast', href: 'https://github.com/matheus-amon/podcast' }],
    },
    {
      name: 'SaaS Metrics Warehouse',
      description:
        'B2B SaaS product-analytics warehouse in three repos: a generator for 1M synthetic product events, a dbt project with a star schema and revenue, retention, adoption and account-health marts behind 300 tests, and Airflow 3 with Cosmos running it and consuming the mart as an Asset.',
      tags: ['dbt', 'Airflow', 'Postgres', 'Python', 'Docker'],
      links: [
        { label: 'dwh-config-local', href: 'https://github.com/matheus-amon/dwh-config-local' },
        { label: 'dwh-airflow', href: 'https://github.com/matheus-amon/dwh-airflow' },
        { label: 'dwh-dbt', href: 'https://github.com/matheus-amon/dwh-dbt' },
      ],
    },
    {
      name: 'api-ingest-airflow',
      description:
        'An Airflow ingestion pipeline template built around software-engineering boundaries: an API client, a DTO contract that validates at construction, a service orchestrator, and a repository behind an interface. Ships with tests and a container image.',
      tags: ['Airflow', 'Python', 'uv', 'pytest', 'Docker'],
      links: [{ label: 'api-ingest-airflow', href: 'https://github.com/matheus-amon/api-ingest-airflow' }],
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

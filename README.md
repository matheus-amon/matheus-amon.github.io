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

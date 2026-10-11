# AllConverter.tools

Source for [allconverter.tools](https://allconverter.tools) — 250+ free, browser-based tools for PDF, images, audio, video, developer, SEO, business and unit-conversion tasks.

Built with Next.js (App Router, static export), React, TypeScript and Tailwind CSS. Tools run client-side; there is no backend.

## Commands

```bash
npm run dev       # local dev server at http://localhost:3000
npm run build     # static export to ./out
npm run fresh     # clean .next and out, then build
npm run lint      # ESLint
npm run indexnow  # submit all URLs to IndexNow (Bing, Yandex)
```

## Where things live

| Path | What it holds |
| --- | --- |
| `src/lib/tools-data.ts` | Every tool's slug, name, category, copy and SEO overrides |
| `src/lib/tool-content-gen.ts` | Generated intro, FAQ, how-to and benefits for tool pages |
| `src/lib/seo-utils.ts` | Site config, titles, descriptions, Open Graph and JSON-LD builders |
| `src/components/tools/implementations/` | The tool UIs |
| `src/components/tools/ToolInterface.tsx` | Maps a tool slug to its component |
| `src/data/blog-posts/` | Blog articles |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Sitemap and robots.txt |

## SEO conventions

- Page titles must **not** include "| AllConverter.tools" — the root layout's title template adds it.
- Meta descriptions go through `fitDescription` / `truncateAtWord` so they are never cut mid-word.
- Social previews use `public/og-default.png` via `defaultOgImages`.
- Bump `siteConfig.lastUpdated` when tool or category pages change; the sitemap uses it for `lastModified`.

## Deploying

`npm run build` writes a fully static site to `out/`. Upload that folder to the host.

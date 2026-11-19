# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio site ("cyber terminal" themed) for a Cloud/DevOps/SRE engineer. Single-page React app, no backend — deployed as a static SPA to GitHub Pages at the custom domain `profile.247.id.vn` (`.github/workflows`, served from the root path, `base: '/'` in `vite.config.ts`). `vercel.json` is kept for Vercel compatibility.

## Commands

```bash
npm run dev       # start Vite dev server (localhost:5173)
npm run build     # tsc typecheck + vite production build -> dist/
npm run lint      # ESLint
npm run preview   # serve the production build locally
```

There is no test suite and no `type-check` script (despite README claiming one) — type checking only happens as part of `npm run build` via `tsc`. There is no way to typecheck without also building.

The contact form requires `VITE_WEB3FORMS_KEY` in `.env` (copy from `.env.example`) — it posts directly to Web3Forms client-side, no backend involved.

## Architecture

- Routing is a flat `react-router-dom` v6 table in `src/App.tsx` — one route per page in `src/pages/`, wrapped in a persistent `Navbar` + `Footer`. There is no nesting, layouts, or lazy loading.
- Content is not colocated with the components that render it. Three separate places hold copy/data:
  - `src/data/portfolio.ts` — hero/about text, skills list, contact info.
  - `src/components/case-studies/EnhancedCaseStudies.tsx` — a `caseStudies` array (problem/solution/tech/metrics per project) plus the component that renders it.
  - `src/components/blog/EnhancedBlog.tsx` — a `blogPosts` array plus the modal-based reading UI.
  - When asked to update site content (name, projects, blog posts, case studies), check these three files rather than the page components in `src/pages/`.
- `src/components/visual/VisualComponents.tsx` holds shared animated UI primitives reused across pages; `Grid3D.tsx` is the animated terminal background — despite the name and README claims, it's pure CSS/DOM (gradients + `Math.random()`-positioned divs), not a Three.js scene. There is no Three.js dependency in `package.json`.
- Styling is Tailwind-only (`tailwind.config.js` defines the neon-green terminal theme via `primary`/`bg-page`/`bg-surface` colors); `clsx` + `tailwind-merge` are used for conditional class composition (see `src/lib/utils.ts`).
- `@/*` path alias maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`).
- Client-side routing needs a SPA fallback on every host: the GitHub Pages workflow copies `dist/index.html` to `404.html`, and `vercel.json` rewrites all paths to `/index.html` for Vercel.

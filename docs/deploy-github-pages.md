# Deploy to GitHub Pages with a custom domain

How this repo is deployed to GitHub Pages and served at
`https://profile.247.id.vn`. Follow the same steps to deploy a fork or to move
to another domain.

## Overview

```text
git push main
   ↓
GitHub Actions (.github/workflows/*.yml)
   ↓  npm install → npm run build → cp dist/index.html dist/404.html
GitHub Pages (artifact deploy)
   ↓
DNS CNAME  profile.247.id.vn → <github-user>.github.io
   ↓
https://profile.247.id.vn
```

| Item | Value |
|---|---|
| Hosting | GitHub Pages (build type: GitHub Actions) |
| Custom domain | `profile.247.id.vn` |
| Vite `base` | `/` (served from the domain root) |
| SPA fallback | `404.html` copied from `index.html` in the workflow |
| Secret | `VITE_WEB3FORMS_KEY` (repository Actions secret) |

## 1. Repo prerequisites

- `vite.config.ts` has `base: '/'`. With a custom domain the site is served
  from the root. Use `base: '/<repo>/'` only for the default
  `<user>.github.io/<repo>/` URL.
- The workflow copies `dist/index.html` to `dist/404.html`. GitHub Pages
  serves `404.html` for unknown paths, which lets `react-router-dom` handle
  deep links such as `/projects/:projectId`.
- No `CNAME` file is needed in `public/`: with the Actions deploy source, the
  domain is stored in the repository Pages settings, not in the artifact.

## 2. Workflow

`.github/workflows/` deploys on every push to `main` (and manually via
`workflow_dispatch`):

- Permissions: `contents: read`, `pages: write`, `id-token: write`.
- `build` job: checkout, Node 20, `npm install`, `npm run build`, SPA
  fallback, `actions/upload-pages-artifact`.
- `deploy` job: `actions/deploy-pages` in the `github-pages` environment.

## 3. Enable Pages (one time)

Web UI: repo → **Settings → Pages → Build and deployment → Source: GitHub
Actions**.

Or with the CLI:

```bash
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow
```

## 4. Add the build secret

The contact form needs the Web3Forms access key at build time:

repo → **Settings → Secrets and variables → Actions → New repository
secret** → name `VITE_WEB3FORMS_KEY`.

Never commit `.env`. Use `.env.example` as the template for local dev.

## 5. Alias the custom domain

### 5.1 DNS

Create a **CNAME** record at the DNS provider of `247.id.vn`:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `profile` | `<github-user>.github.io` | 300 (raise later) |

Notes:

- The value is the GitHub **user/org** host, without the repo name.
- If the DNS provider has a proxy (for example Cloudflare), set the record to
  **DNS only** until the certificate is issued.
- For an apex domain use `A` records (`185.199.108.153`, `.109.153`,
  `.110.153`, `.111.153`) instead of a CNAME. Check the current list in the
  GitHub docs before use.

Verify:

```bash
dig +short profile.247.id.vn CNAME
# expected: <github-user>.github.io.
```

### 5.2 Set the domain in GitHub

Web UI: **Settings → Pages → Custom domain** → `profile.247.id.vn` → Save.
GitHub runs a DNS check.

CLI:

```bash
gh api -X PUT repos/<owner>/<repo>/pages -f cname=profile.247.id.vn
```

### 5.3 Enforce HTTPS

After the DNS check passes, GitHub issues a Let's Encrypt certificate (can
take from a few minutes up to about an hour). Then tick **Enforce HTTPS** in
**Settings → Pages**, or:

```bash
gh api -X PUT repos/<owner>/<repo>/pages -F https_enforced=true
```

### 5.4 Verify

```bash
gh api repos/<owner>/<repo>/pages --jq '{cname,https_enforced,status,html_url}'
curl -I https://profile.247.id.vn      # expect HTTP/2 200, server: GitHub.com
curl -I https://profile.247.id.vn/projects/x   # deep link still serves the app
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Pages status `errored`, `https_enforced: false` | Certificate not issued yet, or DNS not matching | Check the CNAME with `dig`, remove then re-add the custom domain to retrigger the certificate, wait, then enforce HTTPS |
| "DNS check unsuccessful" | CNAME missing, wrong value, or proxied | Fix the record, wait for TTL |
| Blank page, assets 404 | Wrong `base` in `vite.config.ts` | Use `/` for a custom domain |
| 404 on refresh of a sub-route | `404.html` fallback missing | Keep the `cp dist/index.html dist/404.html` step |
| Contact form fails | `VITE_WEB3FORMS_KEY` secret missing at build time | Add the secret, re-run the workflow |
| Domain disappears after deploy | Domain set only via a `CNAME` file with Actions source | Set it in Settings → Pages (or the API call above) |

## Vercel (alternative)

`vercel.json` rewrites all paths to `/index.html`, so the same build also
works on Vercel. Add `VITE_WEB3FORMS_KEY` in the Vercel project env vars.

# 🖥️ DevOps Portfolio Template — Cyber Terminal Aesthetic

> A free, open-source DevOps portfolio website template for Cloud Engineers, SREs, and DevOps professionals.  
> Built with **React + TypeScript**, featuring a cyber terminal design, a blog with syntax-highlighted code, and CI/CD-ready deployment on Vercel.

<p align="center">
  <a href="https://github.com/dev198x/devops-portfolio/stargazers">
    <img src="https://img.shields.io/github/stars/dev198x/devops-portfolio?style=for-the-badge&color=00ff41&labelColor=0a0a0a" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/dev198x/devops-portfolio/network/members">
    <img src="https://img.shields.io/github/forks/dev198x/devops-portfolio?style=for-the-badge&color=00ff41&labelColor=0a0a0a" alt="GitHub Forks" />
  </a>
  <a href="https://github.com/dev198x/devops-portfolio/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-00ff41?style=for-the-badge&labelColor=0a0a0a" alt="MIT License" />
  </a>
</p>

<p align="center">
  <b><a href="#-quick-start">Quick Start</a></b> •
  <b><a href="#-customization-guide">Customization</a></b> •
  <b><a href="#-deployment">Deploy</a></b>
</p>

---

## 🤔 Who Is This For?

If you are a **DevOps engineer, Cloud Engineer, or SRE** who:

- Wants a portfolio that looks like it belongs in a terminal — not a marketing agency
- Is targeting product-based companies, startups, or FAANG-adjacent roles
- Wants to stand out from generic Notion or Google Sites portfolios
- Needs a ready-to-deploy solution in under 10 minutes

**This template is for you.**

Recruiters spend an average of 6 seconds on a resume. A portfolio like this helps them quickly understand your technical depth and project experience — before they even read a word.

---

## 🖥️ Preview

| Section | What You Get |
|---|---|
| 🏠 Home | Animated terminal hero, typewriter effect, neon aesthetic |
| 🛠️ Skills | Visual proficiency indicators for full DevOps toolchain |
| 📁 Projects | Filterable project cards with tech stack tags |
| 📝 Blog | One page per article (`/blog/{slug}`), syntax-highlighted code, category filters |
| 📬 Contact | Web3Forms-powered contact form, no backend required |

---

## 🚀 Quick Start

**Fork → Customize → Deploy in under 10 minutes.**

```bash
# Step 1 — Clone the repo
git clone https://github.com/dev198x/devops-portfolio.git
cd devops-portfolio

# Step 2 — Install dependencies
npm install

# Step 3 — Set up environment (required for contact form)
cp .env.example .env
# Open .env and add your Web3Forms key (free at web3forms.com)

# Step 4 — Run locally
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) — you should see the full site.

<a href="https://vercel.com/new/clone?repository-url=https://github.com/dev198x/devops-portfolio">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>

---

## ✨ Features

### 🎯 Portfolio Core
- **Cyber Terminal Design** — Electric neon green theme, monospace fonts, authentic command-line aesthetic
- **Animated Terminal Background** — Dynamic CSS grid, scanlines, and floating particles
- **Typewriter & Glitch Effects** — Smooth transitions powered by Framer Motion
- **Fully Responsive** — Optimized for desktop, tablet, and mobile
- **Interactive Skill Explorer** — Visual proficiency indicators for DevOps toolchain
- **Project Filtering** — Filter projects by technology stack
- **Builder page (`/builder`)** — Vietnamese page on building products end to end with AI agents, with live products as evidence and Grafana LGTM monitoring illustrations (content in `src/data/builder.ts`)
- **Certifications** — AWS badge on the Skills page (`CERTIFICATIONS` in `src/data/portfolio.ts`)
- **Live clock** — the navbar shows the visitor's local time (`src/components/Clock.tsx`)
- **Contact privacy** — email and phone are masked on the page; the full details are in a vCard QR code (`public/images/contact-qr.svg`)

### 📝 Interactive Tech Blog (`/blog`)
- Every article has its own page at `/blog/{slug}` (readable URL, shareable, works with browser back/forward; old `/blog/{id}` links redirect). Each page sets its own `<title>`, meta description and canonical URL
- Syntax-highlighted code blocks (SQL, JavaScript, Bash, Lua, JSON) with a language label
- Category filtering (DevOps, Cloud Infrastructure, Full-Stack)
- Search, newest first
- Featured article highlights (the section is hidden when no post is featured)

### 🛠️ DevOps-Ready Deployment
- GitHub Pages deployment on push to `main` (`.github/workflows`), served at the custom domain `profile.247.id.vn`
- SPA fallback: the workflow copies `dist/index.html` to `404.html` so deep links such as `/projects/<id>` work
- Step-by-step guide: [docs/deploy-github-pages.md](docs/deploy-github-pages.md)
- Vercel-compatible (`vercel.json` SPA rewrite)
- Environment variable support for secrets
- Netlify-compatible with one config file

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Routing | React Router |
| Terminal Background | CSS/DOM grid & particle effects (no 3D engine) |
| Icons | Lucide React |
| Contact Form | Web3Forms (free, no backend) |
| Deployment | GitHub Pages (custom domain) / Vercel-compatible |

---

## ⚠️ Environment Setup (Required for Contact Form)

The contact form uses **[Web3Forms](https://web3forms.com)** — a free service that delivers form submissions to your email. You must replace the API key with your own before deploying.

### Step 1 — Get your free Web3Forms key (30 seconds)
Go to [web3forms.com](https://web3forms.com) → enter your email → copy your access key.

### Step 2 — Set up your local `.env` file
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_WEB3FORMS_KEY=your_access_key_here
```

### Step 3 — Add the key for production
**GitHub Pages (current deployment):** repo → **Settings** → **Secrets and variables** → **Actions** → add a repository secret named `VITE_WEB3FORMS_KEY`, then re-run the *Deploy to GitHub Pages* workflow.

**Vercel (alternative):** in your Vercel project → **Settings** → **Environment Variables**:

| Key | Value | Environments |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | `your_access_key_here` | Production, Preview, Development |

After adding, **redeploy** the project (push a commit, re-run the workflow, or use Vercel dashboard → Redeploy).

> **Never commit your `.env` file.** It is already in `.gitignore`.

---

## 🎨 Customization Guide

### Your Personal Information

| What to change | File |
|---|---|
| Name, role, bio | `src/data/portfolio.ts` or `src/pages/Home.tsx` |
| Navigation links | `src/components/Navbar.tsx` |
| Footer links + socials | `src/components/Footer.tsx` |
| Skills & proficiency | `src/pages/Skills.tsx` |
| Contact details | `src/data/portfolio.ts` |


### Your Blog Posts

Posts live in the `blogPosts` array in `src/data/blog.ts`. Add an object like this:

````ts
{
  id: 12,                       // unique number
  slug: "row-locking-select-for-update", // URL: /blog/row-locking-select-for-update (lowercase ASCII + hyphens, unique, never change once published)
  title: "Row Locking in SQL",
  category: "Full-Stack",       // DevOps | Cloud Infrastructure | Full-Stack
  difficulty: "Intermediate",   // Beginner | Intermediate | Advanced
  readTime: "8 min read",
  date: "2026-12-01",           // YYYY-MM-DD, the list is sorted newest first
  featured: false,
  excerpt: "One or two sentences shown on the blog cards.",
  tags: ["PostgreSQL", "Concurrency"],
  content: `
# Row Locking in SQL

A normal paragraph. Use \`inline code\` for identifiers.

## Example

\`\`\`sql
BEGIN;
SELECT stock FROM products WHERE id = 42 FOR UPDATE;
UPDATE products SET stock = stock - 1 WHERE id = 42;
COMMIT;
\`\`\`
  `
}
````

`content` is a template literal, so **every backtick inside it must be escaped as `` \` ``** (as above), and `${` must be written `\${`.

**Supported syntax** (rendered by `src/pages/BlogPost.tsx`): `#` / `##` / `###` headings, paragraphs, `` `inline code` ``, and fenced code blocks. Lists, tables, bold and links are **not** parsed and show as plain text, so write numbered points as ordinary lines (`1. ...`) and put tables or diagrams in an untagged code fence.

**Code highlighting:** put the language right after the opening fence. Supported: `sql`, `javascript`, `bash`, `lua`, `json`. A fence with no language (or an unsupported one, e.g. `hcl`) is shown as plain text. To add a language, register it in `src/components/blog/CodeBlock.tsx`:

```ts
import yaml from 'highlight.js/lib/languages/yaml';
hljs.registerLanguage('yaml', yaml);
// then add it to LANGUAGE_LABELS in the same file
```

### SEO: static pages per route

`npm run build` runs `scripts/prerender.mjs` after Vite. It writes a real `index.html` for every page (`dist/blog/<slug>/index.html`, `dist/projects/<slug>/index.html`, ...) with its own title, description, canonical and Open Graph tags, and generates `sitemap.xml` and `robots.txt`. Without it, GitHub Pages would serve deep links through `404.html` with HTTP status 404, and Google does not index those. The pages are still the normal React app; the script only adds the real files and the `<head>`.

- Production domain: set `SITE_URL` when building for another domain (default `https://profile.247.id.vn`).
- Adding a blog post or project needs nothing extra: the script reads `src/data/blog.ts` and `src/data/portfolio.ts`. A brand-new static page must be added to the list in `scripts/prerender.mjs`.
- Submit `https://<your-domain>/sitemap.xml` in Google Search Console.

### Colors & Branding

```js
// tailwind.config.js — change the neon green to your preferred accent
colors: {
  primary: {
    500: '#00ff41',   // ← your primary accent color
  },
  'bg-page':    '#0a0a0a',   // ← main background
  'bg-surface': '#111111',   // ← card background
}
```

### Fonts & Animations
- Typography: `src/index.css`
- Animation config: `src/components/visual/VisualComponents.tsx`

---

## 📁 Project Structure

```
devops-portfolio/
├── src/
│   ├── components/
│   │   ├── blog/
│   │   │   ├── EnhancedBlog.tsx          # Blog list: search, filters, cards
│   │   │   └── CodeBlock.tsx             # Syntax-highlighted code block (highlight.js)
│   │   ├── visual/
│   │   │   └── VisualComponents.tsx      # Reusable animated UI components
│   │   ├── Navbar.tsx
│   │   ├── Clock.tsx                     # Live local-time clock in the navbar
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── portfolio.ts                  # ← your name, links, contact info
│   │   ├── blog.ts                       # ← your blog posts (blogPosts array)
│   │   └── builder.ts                    # ← content of the /builder (builder) page, in Vietnamese
│   ├── pages/                            # Route-level pages (BlogPost.tsx = /blog/:slug)
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example                          # ← copy this to .env
├── .gitignore
├── vercel.json                           # SPA redirect rules
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Deployment

### Vercel (Recommended — Free)

1. Fork this repo
2. Go to [vercel.com](https://vercel.com) → Import your fork
3. Add `VITE_WEB3FORMS_KEY` in **Settings → Environment Variables**
4. Deploy — live in under 2 minutes

### Netlify

```bash
npm run build
# Upload the `dist/` folder to Netlify Drop
```

Create a `netlify.toml` file in the project root:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔧 Development Scripts

```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # tsc typecheck + production build → dist/
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

There is no standalone `type-check` script — type checking only runs as part of `npm run build` (via `tsc`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📱 Browser Support

Chrome, Firefox, Safari, Edge (latest versions) · iOS Safari · Chrome Mobile

---

## 📄 License

MIT — free to use, fork, and deploy for personal and commercial use.

---

## 👨‍💻 About This Project

Originally built by **Neeraj Chandra Nakka** as an open-source DevOps portfolio template for cloud, SRE, and infrastructure engineers. This instance is maintained by **Dat Dao**, a Software Engineer working across backend development, DevOps, and AI engineering.

This portfolio is designed for DevOps engineers who want something that looks like it belongs in a terminal — not a Wix page. If you're targeting product-based companies, a portfolio like this helps recruiters quickly understand your technical depth and project experience.

## 🔗 Links

- **GitHub**: [github.com/dev198x](https://github.com/dev198x)
- **LinkedIn**: [linkedin.com/in/dat-dao-db-ssa](https://www.linkedin.com/in/dat-dao-db-ssa/)

---

<p align="center">
  <b>If this template helped you land a job or get noticed, drop a ⭐ — it helps other DevOps engineers find it.</b><br/>
  <i>One click. It means a lot.</i>
</p>

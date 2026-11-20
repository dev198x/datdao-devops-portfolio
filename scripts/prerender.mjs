// Post-build step: give every route its own static HTML file.
//
// Why: GitHub Pages only knows real files. A deep link such as /blog/<slug> has no file, so
// Pages answers with 404.html (HTTP 404) even though the SPA then renders it. Search engines
// treat a 404 as "page does not exist". Writing dist/<route>/index.html for each route makes
// Pages answer 200, and lets us put a per-page <title>, description and canonical URL in the
// HTML that crawlers read before running any JavaScript. Also writes sitemap.xml and robots.txt.
//
// Unknown paths still fall back to dist/404.html (copied by the workflow), which is correct.
//
// Usage: node scripts/prerender.mjs   (runs after `vite build`, see package.json)
// SITE_URL overrides the production origin (default: the custom domain).

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const siteUrl = (process.env.SITE_URL ?? 'https://profile.247.id.vn').replace(/\/+$/, '');
const siteName = 'Dat Dao';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const truncate = (text, max) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
};

// Read the site data through Vite so TypeScript and import.meta.env work as they do in the app.
const server = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true },
});
let blogPosts;
let projects;
try {
  ({ blogPosts } = await server.ssrLoadModule('/src/data/blog.ts'));
  ({ PROJECTS: projects } = await server.ssrLoadModule('/src/data/portfolio.ts'));
} finally {
  await server.close();
}

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const defaultDescription = /<meta name="description" content="([^"]*)"/.exec(template)?.[1];
if (!defaultDescription) throw new Error('index.html has no <meta name="description">; cannot build page heads.');

/** @type {{ route: string, title: string, description: string, lastmod?: string, ogType: string }[]} */
const pages = [
  ...['about', 'skills', 'projects', 'blog', 'commands', 'contact'].map((name) => ({
    route: `/${name}`,
    title: `${name[0].toUpperCase()}${name.slice(1)} | ${siteName}`,
    description: defaultDescription, // already HTML-escaped in index.html
    ogType: 'website',
  })),
  {
    route: '/others',
    title: `Builder: từ ý tưởng đến sản phẩm chạy thật | ${siteName}`,
    description: escapeHtml(
      'Builder làm việc cùng AI agents: từ ý tưởng đến sản phẩm production, cyber security, monitoring production bằng Grafana LGTM stack, giải pháp web, app và hệ thống nội bộ cho doanh nghiệp vừa và nhỏ, kèm các sản phẩm chạy thật.'
    ),
    ogType: 'website',
  },
  ...projects.map((project) => ({
    route: `/projects/${project.slug}`,
    title: `${project.title} | ${siteName}`,
    description: escapeHtml(truncate(project.detail?.summary ?? project.description, 160)),
    ogType: 'website',
  })),
  ...blogPosts.map((post) => ({
    route: `/blog/${post.slug}`,
    title: `${post.title} | ${siteName}`,
    description: escapeHtml(truncate(post.excerpt, 160)),
    lastmod: post.date,
    ogType: 'article',
  })),
];

const seenRoutes = new Set();
for (const page of pages) {
  if (seenRoutes.has(page.route)) throw new Error(`Duplicate route: ${page.route}`);
  seenRoutes.add(page.route);
}

const renderPage = (page) => {
  const canonical = `${siteUrl}${page.route}/`;
  const title = escapeHtml(page.title);
  const head = [
    `<title>${title}</title>`,
    `<meta name="description" content="${page.description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="${page.ogType}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${page.description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${siteUrl}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${page.description}" />`,
    `<meta name="twitter:image" content="${siteUrl}/og-image.png" />`,
  ].join('\n  ');

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*\/?>/, '')
    .replace('</head>', `  ${head}\n</head>`);

  // Readable without JavaScript (crawlers that do not run scripts, text browsers).
  const fallback = `<noscript><h1>${title}</h1><p>${page.description}</p></noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n  ${fallback}`);
  if (!html.includes(canonical) || !html.includes(fallback)) {
    throw new Error(`Failed to build the head for ${page.route}`);
  }
  return html;
};

for (const page of pages) {
  const dir = path.join(dist, page.route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), renderPage(page), 'utf8');
}

const urls = [
  { loc: `${siteUrl}/` },
  ...pages.map((page) => ({ loc: `${siteUrl}${page.route}/`, lastmod: page.lastmod })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${escapeHtml(url.loc)}</loc>${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');

console.log(`prerender: ${pages.length} pages, sitemap.xml and robots.txt written to dist/ (${siteUrl})`);

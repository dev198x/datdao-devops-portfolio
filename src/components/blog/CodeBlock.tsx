import React, { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import ini from 'highlight.js/lib/languages/ini';
import lua from 'highlight.js/lib/languages/lua';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import yaml from 'highlight.js/lib/languages/yaml';
import type { HLJSApi, Language } from 'highlight.js';

// highlight.js ships no HCL (Terraform) grammar, so define a small one: comments, strings,
// block keywords, literals and numbers are enough for the blog's examples.
const hcl = (api: HLJSApi): Language => ({
  name: 'HCL',
  keywords: {
    keyword: 'resource variable output provider terraform module data locals backend required_providers',
    literal: 'true false null',
  },
  contains: [
    api.HASH_COMMENT_MODE,
    api.C_LINE_COMMENT_MODE,
    api.C_BLOCK_COMMENT_MODE,
    api.QUOTE_STRING_MODE,
    api.C_NUMBER_MODE,
    { className: 'attr', begin: /^\s*[A-Za-z_][\w-]*(?=\s*=)/, relevance: 0 },
  ],
});

// Only the languages used in blog posts are bundled (keeps the JS size small).
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('hcl', hcl);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('lua', lua);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('yaml', yaml);

// Label shown in the block header, keyed by the fence language.
const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  dockerfile: 'dockerfile',
  docker: 'dockerfile',
  javascript: 'javascript',
  js: 'javascript',
  json: 'json',
  lua: 'lua',
  markdown: 'markdown',
  md: 'markdown',
  python: 'python',
  py: 'python',
  toml: 'ini',
  ini: 'ini',
  hcl: 'hcl',
  terraform: 'hcl',
  tf: 'hcl',
  sql: 'sql',
  typescript: 'typescript',
  ts: 'typescript',
  yaml: 'yaml',
  yml: 'yaml',
};

const ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
};
const decode = (text: string) => text.replace(/&(?:lt|gt|amp|quot|#x27|#39);/g, (m) => ENTITIES[m] ?? m);

/**
 * highlight.js returns an HTML string made only of <span class="hljs-*"> wrappers and
 * entity-escaped text. Convert it to React nodes so we never need dangerouslySetInnerHTML.
 */
const toReactNodes = (html: string): React.ReactNode[] => {
  const root: React.ReactNode[] = [];
  const stack: { className: string; children: React.ReactNode[] }[] = [];
  const current = () => (stack.length ? stack[stack.length - 1].children : root);

  const tokenRegex = /<span class="([^"]*)">|<\/span>|[^<]+/g;
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(html)) !== null) {
    const token = match[0];
    if (match[1] !== undefined) {
      stack.push({ className: match[1], children: [] });
    } else if (token === '</span>') {
      const done = stack.pop();
      if (done) {
        current().push(
          <span key={current().length} className={done.className}>
            {done.children}
          </span>
        );
      }
    } else {
      current().push(decode(token));
    }
  }
  return root;
};

interface CodeBlockProps {
  code: string;
  language?: string;
  /** Optional caption shown next to the language label. */
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, title }) => {
  const lang = language ? LANGUAGE_LABELS[language.toLowerCase()] : undefined;

  const content = useMemo<React.ReactNode>(() => {
    if (!lang) return code; // untagged block (diagram, plain text): no highlighting
    return toReactNodes(hljs.highlight(code, { language: lang, ignoreIllegals: true }).value);
  }, [code, lang]);

  return (
    <div className="mb-4 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-50">
      {(lang || title) && (
        <div className="flex items-center gap-3 px-4 py-1.5 border-b border-neutral-700 bg-neutral-100 font-mono text-xs text-neutral-400">
          {lang && <span className="uppercase tracking-wide">{lang}</span>}
          {title && <span className="normal-case text-neutral-500 truncate">{title}</span>}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="hljs font-mono text-sm leading-relaxed whitespace-pre text-neutral-200 [font-variant-ligatures:none]">{content}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

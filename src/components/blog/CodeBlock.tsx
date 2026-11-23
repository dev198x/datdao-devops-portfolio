import React, { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import ini from 'highlight.js/lib/languages/ini';
import lua from 'highlight.js/lib/languages/lua';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';

// Only the languages used in blog posts are bundled (keeps the JS size small).
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('lua', lua);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);

// Label shown in the block header, keyed by the fence language.
const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  javascript: 'javascript',
  js: 'javascript',
  json: 'json',
  lua: 'lua',
  python: 'python',
  py: 'python',
  toml: 'ini',
  sql: 'sql',
  typescript: 'typescript',
  ts: 'typescript',
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

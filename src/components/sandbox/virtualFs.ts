export interface FSFile {
  type: 'file';
  content: string;
  mode: string;
}

export interface FSDir {
  type: 'dir';
  mode: string;
  children: Record<string, FSNode>;
}

export type FSNode = FSFile | FSDir;

export const HOME_SEGMENTS = ['home', 'user'];

export function createInitialFs(): FSDir {
  const file = (content: string): FSFile => ({ type: 'file', content, mode: '-rw-r--r--' });
  const dir = (children: Record<string, FSNode>): FSDir => ({ type: 'dir', mode: 'drwxr-xr-x', children });

  return dir({
    home: dir({
      user: dir({
        'readme.md': file('Welcome to the Linux sandbox!\nTry: ls, cd projects, cat README.md, man grep'),
        documents: dir({
          'notes.txt': file('Remember to renew the TLS cert before it expires.\nAsk Dat about the nginx rate limit config.'),
          'todo.txt': file('- write blog post on distroless images\n- review PR #42\n- rotate AWS keys'),
        }),
        projects: dir({
          app: dir({
            'README.md': file('# app\n\nA sample project used for practicing find/grep in this sandbox.'),
            src: dir({
              'index.js': file("console.log('hello from the sandbox');\n"),
            }),
          }),
        }),
        photos: dir({}),
        'config.json': file(JSON.stringify({ name: 'sandbox-app', version: '1.0.0', tags: ['devops', 'linux', 'learning'], author: { name: 'user', active: true } }, null, 2)),
        '.bashrc': file('# sample dotfile, hidden from plain ls\nexport PATH=$PATH:/usr/local/bin\n'),
      }),
    }),
  });
}

export function formatPath(segments: string[]): string {
  return segments.length === 0 ? '/' : '/' + segments.join('/');
}

/** Resolve a user-supplied path (absolute, relative, ~, .., .) against cwd into absolute segments. */
export function resolvePath(cwd: string[], input: string): string[] {
  if (!input || input === '.') return [...cwd];

  let base: string[];
  let rest: string;

  if (input === '~' || input.startsWith('~/')) {
    base = [...HOME_SEGMENTS];
    rest = input === '~' ? '' : input.slice(2);
  } else if (input.startsWith('/')) {
    base = [];
    rest = input.slice(1);
  } else {
    base = [...cwd];
    rest = input;
  }

  const parts = rest.split('/').filter(Boolean);
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      base.pop();
    } else {
      base.push(part);
    }
  }
  return base;
}

export function getNode(root: FSDir, segments: string[]): FSNode | null {
  let node: FSNode = root;
  for (const seg of segments) {
    if (node.type !== 'dir') return null;
    const next = node.children[seg];
    if (!next) return null;
    node = next;
  }
  return node;
}

export function getParent(root: FSDir, segments: string[]): FSDir | null {
  if (segments.length === 0) return null;
  const parent = getNode(root, segments.slice(0, -1));
  return parent && parent.type === 'dir' ? parent : null;
}

export function basename(segments: string[]): string {
  return segments[segments.length - 1] ?? '';
}

/** Deep clone so state updates stay immutable for React. */
export function cloneFs(node: FSDir): FSDir {
  return JSON.parse(JSON.stringify(node));
}

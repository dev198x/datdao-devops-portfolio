import { linuxCommands } from '../../data/linuxCommands';
import {
  FSDir,
  basename,
  cloneFs,
  formatPath,
  getNode,
  getParent,
  resolvePath,
} from './virtualFs';
import { FAKE_PODS } from './k8sFixtures';

export interface CommandResult {
  output: string[];
  fs: FSDir;
  cwd: string[];
  clear?: boolean;
  openEditor?: { fileSegs: string[]; filename: string; content: string };
  openK9s?: boolean;
}

function tokenize(line: string): string[] {
  const matches = line.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  return matches.map((t) => t.replace(/^["']|["']$/g, ''));
}

function splitFlags(tokens: string[]): { flags: Set<string>; positional: string[] } {
  const flags = new Set<string>();
  const positional: string[] = [];
  for (const t of tokens) {
    if (t.startsWith('-') && t !== '-') {
      for (const ch of t.slice(1)) flags.add(ch);
    } else {
      positional.push(t);
    }
  }
  return { flags, positional };
}

function fakeSize(node: { type: string; content?: string; children?: Record<string, unknown> }): number {
  if (node.type === 'file') return node.content?.length ?? 0;
  return Object.keys(node.children ?? {}).length * 64;
}

/** Render rows as a table with each column padded to its own widest cell + 2 spaces. */
function formatTable(rows: string[][]): string[] {
  const widths = rows[0].map((_, col) => Math.max(...rows.map((r) => r[col].length)) + 2);
  return rows.map((r) => r.map((c, col) => c.padEnd(widths[col])).join('').trimEnd());
}

/** Deterministic pseudo-hex digest for a string, purely for realistic-looking sandbox output. */
function fakeHex(input: string, length: number): string {
  let seed = 0;
  for (let i = 0; i < input.length; i++) seed = (seed * 31 + input.charCodeAt(i)) >>> 0;
  let out = '';
  while (out.length < length) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    out += seed.toString(16).padStart(8, '0');
  }
  return out.slice(0, length);
}

/** Find the value following any of the given long-flag names, e.g. getFlagValue(args, '--name', '-n'). */
function getFlagValue(args: string[], ...names: string[]): string | undefined {
  for (const name of names) {
    const idx = args.indexOf(name);
    if (idx !== -1) return args[idx + 1];
  }
  return undefined;
}

/** Deterministic 12-digit fake AWS account ID derived from an access key ID, for realistic-looking sandbox output. */
function fakeAccountId(input: string): string {
  const digits = fakeHex(input, 16).replace(/[a-f]/g, (c) => String((c.charCodeAt(0) - 97) % 10));
  return digits.slice(0, 12);
}

export function runCommand(
  line: string,
  fs: FSDir,
  cwd: string[],
  history: string[]
): CommandResult {
  const tokens = tokenize(line.trim());
  const cmd = tokens[0] ?? '';
  const args = tokens.slice(1);
  const noOp: CommandResult = { output: [], fs, cwd };

  if (!cmd) return noOp;

  switch (cmd) {
    case 'clear': {
      return { output: [], fs, cwd, clear: true };
    }

    case 'help': {
      const list = linuxCommands.map((c) => `  ${c.name.padEnd(10)} ${c.description}`);
      return {
        output: [
          'Available commands:',
          ...list,
          '',
          'Type "man <command>" for full details and examples.',
        ],
        fs,
        cwd,
      };
    }

    case 'history': {
      return { output: history.map((h, i) => `  ${i + 1}  ${h}`), fs, cwd };
    }

    case 'man': {
      const target = args[0];
      if (!target) return { output: ['man: what manual page do you want?'], fs, cwd };
      const entry = linuxCommands.find((c) => c.name === target);
      if (!entry) return { output: [`No manual entry for ${target}`], fs, cwd };
      return {
        output: [
          `${entry.name.toUpperCase()}`,
          `  ${entry.syntax}`,
          '',
          `  ${entry.description}`,
          '',
          'EXAMPLES',
          ...entry.examples.map((e) => `  $ ${e.cmd} — ${e.note}`),
        ],
        fs,
        cwd,
      };
    }

    case 'pwd': {
      return { output: [formatPath(cwd)], fs, cwd };
    }

    case 'whoami': {
      return { output: ['user'], fs, cwd };
    }

    case 'uname': {
      const { flags } = splitFlags(args);
      return {
        output: [flags.has('a') ? 'Linux sandbox 6.8.0-generic #1 SMP x86_64 GNU/Linux' : 'Linux'],
        fs,
        cwd,
      };
    }

    case 'date': {
      return { output: [new Date().toString()], fs, cwd };
    }

    case 'df': {
      return {
        output: [
          'Filesystem     Size  Used Avail Use% Mounted on',
          '/dev/sandbox0  20G   6.4G  13G   33%  /',
        ],
        fs,
        cwd,
      };
    }

    case 'du': {
      const { positional } = splitFlags(args);
      const segs = resolvePath(cwd, positional[0] ?? '.');
      const node = getNode(fs, segs);
      if (!node) return { output: [`du: cannot access '${positional[0]}': No such file or directory`], fs, cwd };
      const size = fakeSize(node as never);
      return { output: [`${(size / 1024).toFixed(1)}K\t${positional[0] ?? '.'}`], fs, cwd };
    }

    case 'ps': {
      return {
        output: [
          'USER   PID  %CPU %MEM COMMAND',
          'user     1   0.1  0.3 /sbin/init',
          'user   214   0.0  0.5 nginx: worker',
          'user   842   1.2  2.1 node server.js',
        ],
        fs,
        cwd,
      };
    }

    case 'kill': {
      const { flags, positional } = splitFlags(args);
      const pid = positional[0];
      if (!pid) return { output: ['kill: usage: kill [-9] <pid>'], fs, cwd };
      return { output: [`sent ${flags.has('9') ? 'SIGKILL' : 'SIGTERM'} to process ${pid}`], fs, cwd };
    }

    case 'lsof': {
      const iIdx = args.indexOf('-i');
      const portArg = iIdx !== -1 ? args[iIdx + 1] : undefined;
      const port = portArg?.replace(/^:/, '');
      const rows = [
        ['COMMAND', 'PID', 'USER', 'TYPE', 'NODE', 'NAME'],
        ['nginx', '214', 'user', 'IPv4', 'TCP', '*:443 (LISTEN)'],
        ['node', '842', 'user', 'IPv4', 'TCP', '*:3000 (LISTEN)'],
        ['sshd', '312', 'root', 'IPv4', 'TCP', '*:22 (LISTEN)'],
      ];
      const filtered = port ? rows.slice(1).filter((r) => r[5].includes(`:${port}`)) : rows.slice(1);
      if (port && filtered.length === 0) return { output: [`lsof: no process found listening on port ${port}`], fs, cwd };
      const table = [rows[0], ...filtered];
      return { output: formatTable(table), fs, cwd };
    }

    case 'nmap': {
      const pIdx = args.indexOf('-p');
      const ports = pIdx !== -1 ? args[pIdx + 1].split(',') : ['22', '80', '443'];
      const target = args[args.length - 1];
      if (!target) return { output: ['nmap: usage: nmap [-p <ports>] <host>'], fs, cwd };
      const services: Record<string, string> = { '22': 'ssh', '80': 'http', '443': 'https', '3000': 'node-app', '5432': 'postgresql' };
      return {
        output: [
          `Starting simulated scan of ${target}`,
          'PORT     STATE  SERVICE',
          ...ports.map((p) => `${p.padEnd(9)}open   ${services[p] ?? 'unknown'}`),
          'Nmap done: 1 host scanned (simulated — no real network traffic sent)',
        ],
        fs,
        cwd,
      };
    }

    case 'telnet': {
      const [host, port] = args;
      if (!host) return { output: ['telnet: usage: telnet <host> <port>'], fs, cwd };
      return {
        output: [
          `Trying ${host}${port ? `:${port}` : ''}...`,
          `Connected to ${host}.`,
          'Escape character is \'^]\'.',
          '(simulated connection — this sandbox has no real network access)',
        ],
        fs,
        cwd,
      };
    }

    case 'ssh': {
      const target = args[0];
      if (!target) return { output: ['ssh: usage: ssh <user>@<host>'], fs, cwd };
      return {
        output: [
          `Connecting to ${target}...`,
          'The authenticity of this host cannot be established (simulated).',
          `Permission denied — this sandbox has no real network access, so ${target} isn't reachable.`,
        ],
        fs,
        cwd,
      };
    }

    case 'curl': {
      let method: string | undefined;
      const headers: string[] = [];
      let data: string | undefined;
      let outFile: string | undefined;
      let headOnly = false;
      let silent = false;
      let url: string | undefined;

      for (let i = 0; i < args.length; i++) {
        const t = args[i];
        if (t === '-X' || t === '--request') method = args[++i];
        else if (t === '-H' || t === '--header') headers.push(args[++i]);
        else if (t === '-d' || t === '--data') data = args[++i];
        else if (t === '-o' || t === '--output') outFile = args[++i];
        else if (t === '-I' || t === '--head') headOnly = true;
        else if (t === '-s' || t === '--silent') silent = true;
        else if (t === '-L' || t === '--location') continue;
        else if (!t.startsWith('-')) url = t;
      }

      if (!url) return { output: ['curl: no URL specified'], fs, cwd };
      const effectiveMethod = method ?? (data ? 'POST' : 'GET');
      const status = effectiveMethod === 'POST' ? '201 Created' : '200 OK';
      const body = data ? data : JSON.stringify({ ok: true, url, message: 'simulated response — no real network request was made' });

      const headerLines = [
        `HTTP/1.1 ${status}`,
        'Content-Type: application/json',
        `Content-Length: ${body.length}`,
        ...headers.map((h) => h),
      ];

      if (headOnly) return { output: headerLines, fs, cwd };

      if (outFile) {
        const segs = resolvePath(cwd, outFile);
        const next = cloneFs(fs);
        const parent = getParent(next, segs);
        if (!parent) return { output: [`curl: cannot save to '${outFile}': No such file or directory`], fs, cwd };
        parent.children[basename(segs)] = { type: 'file', content: body, mode: '-rw-r--r--' };
        return { output: silent ? [] : [`saved to '${outFile}' (simulated, ${body.length} bytes)`], fs: next, cwd };
      }

      return { output: silent ? [] : [body], fs, cwd };
    }

    case 'wget': {
      const oIdx = args.indexOf('-O');
      const outArg = oIdx !== -1 ? args[oIdx + 1] : undefined;
      const resume = args.includes('-c');
      const url = args.find((a, i) => !a.startsWith('-') && args[i - 1] !== '-O');
      if (!url) return { output: ['wget: usage: wget [-O file] [-c] <url>'], fs, cwd };

      const filename = outArg ?? url.split('/').filter(Boolean).pop() ?? 'index.html';
      const body = `<!-- simulated download of ${url} — no real network request was made -->`;
      const segs = resolvePath(cwd, filename);
      const next = cloneFs(fs);
      const parent = getParent(next, segs);
      if (!parent) return { output: [`wget: cannot save to '${filename}': No such file or directory`], fs, cwd };
      parent.children[basename(segs)] = { type: 'file', content: body, mode: '-rw-r--r--' };

      return {
        output: [
          `--  Resolving ${url}...`,
          `Connecting... connected.`,
          `HTTP request sent, awaiting response... 200 OK`,
          resume ? `Resuming existing download (simulated)` : 'Length: unspecified (simulated)',
          `Saving to: '${filename}'`,
          '',
          `'${filename}' saved [${body.length}/${body.length}] (simulated — no real network request was made)`,
        ],
        fs: next,
        cwd,
      };
    }

    case 'openssl': {
      const sub = args[0];
      if (!sub) return { output: ['openssl: usage: openssl <genrsa|req|x509|enc|dgst> [args]'], fs, cwd };

      if (sub === 'genrsa') {
        const outIdx = args.indexOf('-out');
        const target = outIdx !== -1 ? args[outIdx + 1] : undefined;
        const bits = args.find((a) => /^\d+$/.test(a)) ?? '2048';
        const output = [`Generating RSA private key, ${bits} bit long modulus (simulated)`];
        if (!target) return { output, fs, cwd };
        const segs = resolvePath(cwd, target);
        const next = cloneFs(fs);
        const parent = getParent(next, segs);
        if (!parent) return { output: [`openssl: cannot write '${target}': No such file or directory`], fs, cwd };
        parent.children[basename(segs)] = {
          type: 'file',
          content: `-----BEGIN PRIVATE KEY-----\n(simulated ${bits}-bit RSA key, fingerprint ${fakeHex(target, 16)})\n-----END PRIVATE KEY-----`,
          mode: '-rw-------',
        };
        return { output, fs: next, cwd };
      }

      if (sub === 'req') {
        const outIdx = args.indexOf('-out');
        const target = outIdx !== -1 ? args[outIdx + 1] : undefined;
        const output = ['Generating a self-signed certificate (simulated)'];
        if (!target) return { output, fs, cwd };
        const segs = resolvePath(cwd, target);
        const next = cloneFs(fs);
        const parent = getParent(next, segs);
        if (!parent) return { output: [`openssl: cannot write '${target}': No such file or directory`], fs, cwd };
        parent.children[basename(segs)] = {
          type: 'file',
          content: `-----BEGIN CERTIFICATE-----\n(simulated self-signed cert, fingerprint ${fakeHex(target, 16)})\n-----END CERTIFICATE-----`,
          mode: '-rw-r--r--',
        };
        return { output, fs: next, cwd };
      }

      if (sub === 'x509') {
        const inIdx = args.indexOf('-in');
        const target = inIdx !== -1 ? args[inIdx + 1] : undefined;
        if (!target) return { output: ['openssl: usage: openssl x509 -in <file> -noout -dates'], fs, cwd };
        const segs = resolvePath(cwd, target);
        const node = getNode(fs, segs);
        if (!node || node.type !== 'file') return { output: [`openssl: cannot load '${target}': No such file or directory`], fs, cwd };
        return { output: ['notBefore=Jan  1 00:00:00 2026 GMT', 'notAfter=Jan  1 00:00:00 2027 GMT (simulated)'], fs, cwd };
      }

      if (sub === 'dgst') {
        const algIdx = args.findIndex((a) => a.startsWith('-sha') || a.startsWith('-md'));
        const alg = algIdx !== -1 ? args[algIdx].slice(1).toUpperCase() : 'SHA256';
        const target = args[args.length - 1];
        const segs = resolvePath(cwd, target);
        const node = getNode(fs, segs);
        if (!node || node.type !== 'file') return { output: [`openssl: '${target}': No such file or directory`], fs, cwd };
        return { output: [`${alg}(${target})= ${fakeHex(node.content, 64)}`], fs, cwd };
      }

      if (sub === 'enc') {
        return { output: ['openssl enc: symmetric encryption is not simulated in this sandbox — use the secure-kit case study for real AES-256-GCM code'], fs, cwd };
      }

      return { output: [`openssl: '${sub}' is not a recognized command. Try: genrsa, req, x509, dgst`], fs, cwd };
    }

    case 'base64': {
      const { flags, positional } = splitFlags(args);
      const target = positional[0];
      if (!target) return { output: ['base64: usage: base64 [-d] <file-or-text>'], fs, cwd };

      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      const text = node && node.type === 'file' ? node.content : target;

      try {
        if (flags.has('d')) {
          return { output: atob(text.trim()).split('\n'), fs, cwd };
        }
        return { output: [btoa(text)], fs, cwd };
      } catch {
        return { output: ['base64: invalid input for decoding'], fs, cwd };
      }
    }

    case 'nohup': {
      if (args.length === 0) return { output: ['nohup: usage: nohup <command> [args] &'], fs, cwd };
      const backgrounded = args[args.length - 1] === '&';
      const commandStr = (backgrounded ? args.slice(0, -1) : args).join(' ');
      const output = [`nohup: ignoring input and appending output to 'nohup.out' (simulated)`];
      if (backgrounded) {
        const pid = 1000 + Math.floor(Math.random() * 9000);
        output.push(`[1] ${pid}`);
      }
      output.push(`running: ${commandStr} (simulated — survives terminal hangup)`);
      return { output, fs, cwd };
    }

    case 'nginx': {
      if (args.includes('-t')) {
        return {
          output: [
            'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok',
            'nginx: configuration file /etc/nginx/nginx.conf test is successful',
          ],
          fs,
          cwd,
        };
      }
      if (args.includes('-v')) {
        return { output: ['nginx version: nginx/1.25.3'], fs, cwd };
      }
      const sIdx = args.indexOf('-s');
      if (sIdx !== -1) {
        const signal = args[sIdx + 1];
        const known: Record<string, string> = {
          reload: 'reloading configuration (zero-downtime — active connections are kept alive)',
          stop: 'stopping nginx (fast shutdown)',
          quit: 'stopping nginx (graceful shutdown — waits for in-flight requests)',
          reopen: 'reopening log files',
        };
        if (!signal || !known[signal]) return { output: [`nginx: invalid option "${signal ?? ''}"`], fs, cwd };
        return { output: [`nginx: signal process started`, known[signal]], fs, cwd };
      }
      return {
        output: [
          'usage: nginx -t | -s <reload|stop|quit|reopen> | -v',
          '(simulated — no real nginx process is running in this sandbox)',
        ],
        fs,
        cwd,
      };
    }

    case 'npm': {
      const sub = args[0];
      if (!sub) return { output: ['npm: usage: npm <install|ci|run|start|test|list> [args]'], fs, cwd };

      if (sub === '-v' || sub === '--version') return { output: ['10.8.2'], fs, cwd };

      if (sub === 'install' || sub === 'i') {
        const pkg = args[1];
        return {
          output: pkg
            ? [`+ ${pkg}@latest`, 'added 1 package in 0.8s (simulated)']
            : ['npm install', 'added 214 packages in 3.2s (simulated)'],
          fs,
          cwd,
        };
      }

      if (sub === 'ci') {
        return { output: ['npm ci', 'added 214 packages in 2.1s (simulated, from package-lock.json only)'], fs, cwd };
      }

      if (sub === 'run') {
        const script = args[1];
        if (!script) return { output: ['npm run: missing script name'], fs, cwd };
        return {
          output: [`> app@1.0.0 ${script}`, `> ${script === 'build' ? 'tsc && vite build' : script === 'dev' ? 'vite' : script}`, '(simulated script run — no real project is built here)'],
          fs,
          cwd,
        };
      }

      if (sub === 'start' || sub === 'test') {
        return { output: [`> app@1.0.0 ${sub}`, '(simulated — no real project is running here)'], fs, cwd };
      }

      if (sub === 'list' || sub === 'ls') {
        return {
          output: ['app@1.0.0', '├── react@18.3.1', '├── react-dom@18.3.1', '└── typescript@5.6.2 (simulated tree)'],
          fs,
          cwd,
        };
      }

      return { output: [`npm: unknown command "${sub}". Try: install, ci, run <script>, start, test, list`], fs, cwd };
    }

    case 'git': {
      const sub = args[0];
      if (!sub) return { output: ['git: usage: git <status|add|commit|push|pull|log|branch|checkout|clone|diff> [args]'], fs, cwd };
      const shortHash = () => Math.random().toString(16).slice(2, 9);

      if (sub === 'status') {
        return {
          output: [
            'On branch main',
            "Your branch is up to date with 'origin/main'.",
            '',
            'nothing to commit, working tree clean (simulated)',
          ],
          fs,
          cwd,
        };
      }
      if (sub === 'add') {
        return { output: [`changes staged for commit: ${args.slice(1).join(' ') || '.'} (simulated)`], fs, cwd };
      }
      if (sub === 'commit') {
        const mIdx = args.indexOf('-m');
        const message = mIdx !== -1 ? args[mIdx + 1] : 'no message';
        return {
          output: [`[main ${shortHash()}] ${message}`, ' 1 file changed, 4 insertions(+), 1 deletion(-) (simulated)'],
          fs,
          cwd,
        };
      }
      if (sub === 'push') {
        return {
          output: [
            'Enumerating objects: 5, done.',
            'Writing objects: 100% (3/3), done.',
            `To github.com:user/repo.git`,
            `   ${shortHash()}..${shortHash()}  main -> main (simulated)`,
          ],
          fs,
          cwd,
        };
      }
      if (sub === 'pull') {
        return { output: ['Already up to date. (simulated)'], fs, cwd };
      }
      if (sub === 'log') {
        const oneline = args.includes('--oneline');
        const commits = [
          { hash: shortHash(), msg: 'fix: handle empty input' },
          { hash: shortHash(), msg: 'feat: add sandbox terminal' },
          { hash: shortHash(), msg: 'chore: update dependencies' },
        ];
        if (oneline) return { output: commits.map((c) => `${c.hash} ${c.msg}`), fs, cwd };
        return {
          output: commits.flatMap((c) => [`commit ${c.hash}${c.hash.repeat(5).slice(0, 33)}`, `Author: user <user@example.com>`, '', `    ${c.msg}`, '']),
          fs,
          cwd,
        };
      }
      if (sub === 'branch') {
        return { output: ['* main', '  feature/login', '  feature/sandbox (simulated)'], fs, cwd };
      }
      if (sub === 'checkout' || sub === 'switch') {
        const bIdx = args.indexOf('-b');
        const branch = bIdx !== -1 ? args[bIdx + 1] : args[1];
        if (!branch) return { output: [`git: usage: git ${sub} [-b] <branch>`], fs, cwd };
        return {
          output: [bIdx !== -1 ? `Switched to a new branch '${branch}' (simulated)` : `Switched to branch '${branch}' (simulated)`],
          fs,
          cwd,
        };
      }
      if (sub === 'clone') {
        const repo = args[1];
        if (!repo) return { output: ['git: usage: git clone <repo>'], fs, cwd };
        const name = repo.split('/').pop()?.replace(/\.git$/, '') ?? 'repo';
        return {
          output: [`Cloning into '${name}'...`, 'remote: Enumerating objects: 128, done.', 'Receiving objects: 100% (128/128), done. (simulated)'],
          fs,
          cwd,
        };
      }
      if (sub === 'diff') {
        return { output: ['(no changes — simulated working tree is clean)'], fs, cwd };
      }
      if (sub === 'fetch') {
        return { output: ['remote: Enumerating objects: 8, done.', "From github.com:user/repo", '   ' + shortHash() + '..' + shortHash() + '  main     -> origin/main (simulated)'], fs, cwd };
      }
      if (sub === 'merge') {
        const branch = args[1];
        if (!branch) return { output: ['git: usage: git merge <branch>'], fs, cwd };
        return { output: [`Updating ${shortHash()}..${shortHash()}`, 'Fast-forward (simulated)', ` ${branch} merged into current branch`], fs, cwd };
      }
      if (sub === 'rebase') {
        const branch = args[1];
        if (!branch) return { output: ['git: usage: git rebase <branch>'], fs, cwd };
        return { output: [`Successfully rebased and updated refs/heads/${branch} (simulated)`], fs, cwd };
      }
      if (sub === 'stash') {
        const action = args[1];
        if (action === 'pop') return { output: ['Dropped stash@{0} (simulated)', ' (changes restored to working tree)'], fs, cwd };
        if (action === 'list') return { output: ['stash@{0}: WIP on main: ' + shortHash() + ' work in progress (simulated)'], fs, cwd };
        return { output: [`Saved working directory and index state WIP on main: ${shortHash()} (simulated)`], fs, cwd };
      }
      if (sub === 'reset') {
        const hard = args.includes('--hard');
        return {
          output: [`HEAD is now at ${shortHash()} previous commit message (simulated${hard ? ' — working tree changes discarded' : ''})`],
          fs,
          cwd,
        };
      }
      if (sub === 'remote') {
        return { output: ['origin\tgit@github.com:user/repo.git (fetch)', 'origin\tgit@github.com:user/repo.git (push)'], fs, cwd };
      }
      if (sub === 'tag') {
        const name = args[1];
        if (!name) return { output: ['v1.0.0', 'v1.1.0', 'v1.2.0 (simulated)'], fs, cwd };
        return { output: [`created tag '${name}' (simulated)`], fs, cwd };
      }
      if (sub === 'rm') {
        const target = args[1];
        if (!target) return { output: ['git: usage: git rm <file>'], fs, cwd };
        return { output: [`rm '${target}' (simulated — staged for removal)`], fs, cwd };
      }
      return { output: [`git: '${sub}' is not a recognized command. Try: status, add, commit, push, pull, fetch, merge, rebase, stash, reset, log, branch, checkout, clone, diff, remote, tag, rm`], fs, cwd };
    }

    case 'docker': {
      const sub = args[0];
      if (!sub) return { output: ['docker: usage: docker <ps|images|build|run|stop|logs|pull|exec> [args]'], fs, cwd };

      if (sub === 'ps') {
        const all = args.includes('-a');
        const rows = [
          ['CONTAINER ID', 'IMAGE', 'STATUS', 'PORTS', 'NAMES'],
          ['a1b2c3d4e5f6', 'myapp:latest', 'Up 2 hours', '0.0.0.0:3000->3000/tcp', 'myapp'],
          ['b2c3d4e5f6a1', 'nginx:alpine', 'Up 2 hours', '0.0.0.0:443->443/tcp', 'nginx-proxy'],
          ...(all ? [['c3d4e5f6a1b2', 'redis:7', 'Exited (0) 1 day ago', '', 'redis-cache']] : []),
        ];
        return { output: formatTable(rows), fs, cwd };
      }
      if (sub === 'images') {
        return {
          output: [
            'REPOSITORY   TAG      IMAGE ID      SIZE',
            'myapp        latest   a1b2c3d4e5f6  148MB',
            'nginx        alpine   b2c3d4e5f6a1  42MB',
            'node         20-slim  c3d4e5f6a1b2  178MB',
          ],
          fs,
          cwd,
        };
      }
      if (sub === 'pull') {
        const image = args[1] ?? 'unknown';
        return {
          output: [`Using default tag: latest`, `latest: Pulling from library/${image}`, `Status: Downloaded newer image for ${image}:latest (simulated)`],
          fs,
          cwd,
        };
      }
      if (sub === 'build') {
        const tIdx = args.indexOf('-t');
        const tag = tIdx !== -1 ? args[tIdx + 1] : 'app:latest';
        return {
          output: [
            'Step 1/5 : FROM node:20-alpine',
            'Step 2/5 : WORKDIR /app',
            'Step 3/5 : COPY . .',
            'Step 4/5 : RUN npm ci',
            'Step 5/5 : CMD ["node", "server.js"]',
            `Successfully built a1b2c3d4e5f6`,
            `Successfully tagged ${tag} (simulated)`,
          ],
          fs,
          cwd,
        };
      }
      if (sub === 'run') {
        const image = args[args.length - 1];
        return { output: [`a1b2c3d4e5f6789 (started ${image} — simulated)`], fs, cwd };
      }
      if (sub === 'stop') {
        const name = args[1] ?? 'container';
        return { output: [`${name} (simulated)`], fs, cwd };
      }
      if (sub === 'logs') {
        const name = args[args.length - 1] ?? 'container';
        return {
          output: [`==> logs for ${name} (simulated) <==`, 'server listening on port 3000', 'GET /health 200 3ms'],
          fs,
          cwd,
        };
      }
      if (sub === 'exec') {
        return { output: ['docker exec: interactive shells are not supported in this simulated sandbox'], fs, cwd };
      }
      if (sub === 'rm') {
        const name = args[1] ?? 'container';
        return { output: [`${name} (simulated — removed)`], fs, cwd };
      }
      if (sub === 'rmi') {
        const image = args[1] ?? 'image';
        return { output: [`Untagged: ${image}`, `Deleted: sha256:${fakeHex(image, 64)} (simulated)`], fs, cwd };
      }
      if (sub === 'tag') {
        const [, source, target] = args;
        if (!source || !target) return { output: ['docker: usage: docker tag <source> <target>'], fs, cwd };
        return { output: [`tagged ${source} as ${target} (simulated)`], fs, cwd };
      }
      if (sub === 'push') {
        const image = args[1] ?? 'unknown';
        return {
          output: [`The push refers to repository [docker.io/library/${image.split(':')[0]}]`, `latest: digest: sha256:${fakeHex(image, 64)} size: 1789 (simulated)`],
          fs,
          cwd,
        };
      }
      if (sub === 'inspect') {
        const target = args[1] ?? 'container';
        return {
          output: [
            `[{`,
            `  "Id": "${fakeHex(target, 64)}",`,
            `  "Name": "/${target}",`,
            `  "State": { "Status": "running" },`,
            `  "Image": "sha256:${fakeHex(target + 'image', 64)}"`,
            `}] (simulated)`,
          ],
          fs,
          cwd,
        };
      }
      if (sub === 'network' && args[1] === 'ls') {
        return {
          output: formatTable([
            ['NETWORK ID', 'NAME', 'DRIVER', 'SCOPE'],
            ['a1b2c3d4e5f6', 'bridge', 'bridge', 'local'],
            ['b2c3d4e5f6a1', 'app_default', 'bridge', 'local'],
          ]),
          fs,
          cwd,
        };
      }
      if (sub === 'volume' && args[1] === 'ls') {
        return {
          output: formatTable([
            ['DRIVER', 'VOLUME NAME'],
            ['local', 'app_db-data'],
            ['local', 'app_node-modules'],
          ]),
          fs,
          cwd,
        };
      }
      if (sub === 'compose') {
        const action = args[1];
        if (action === 'up') {
          const detached = args.includes('-d');
          return {
            output: [
              'Creating network "app_default" (simulated)',
              'Creating app_db_1     ... done',
              'Creating app_api_1    ... done',
              'Creating app_nginx_1  ... done',
              detached ? '(running in detached mode)' : 'Attaching to app_db_1, app_api_1, app_nginx_1 (Ctrl+C to stop — simulated)',
            ],
            fs,
            cwd,
          };
        }
        if (action === 'down') {
          return { output: ['Stopping app_nginx_1 ... done', 'Stopping app_api_1    ... done', 'Stopping app_db_1     ... done', 'Removing network app_default (simulated)'], fs, cwd };
        }
        return { output: ['docker compose: usage: docker compose <up|down>'], fs, cwd };
      }
      return { output: [`docker: '${sub}' is not a recognized command. Try: ps, images, build, run, stop, rm, rmi, logs, pull, push, tag, exec, inspect, network ls, volume ls, compose up|down`], fs, cwd };
    }

    case 'k9s': {
      return { output: [], fs, cwd, openK9s: true };
    }

    case 'kubectl': {
      const sub = args[0];
      if (!sub) return { output: ['kubectl: usage: kubectl <get|describe|apply|delete|logs|exec|scale|rollout|top|config> [args]'], fs, cwd };

      // splitFlags treats "-n" as a flag, which would swallow the namespace value; parse it manually first.
      const nsIdx = args.findIndex((a) => a === '-n' || a === '--namespace');
      const namespace = nsIdx !== -1 ? args[nsIdx + 1] : 'default';
      const rest = nsIdx === -1 ? args : args.filter((_, i) => i !== nsIdx && i !== nsIdx + 1);

      if (sub === 'get') {
        const resource = rest[1];
        if (!resource) return { output: ['kubectl: usage: kubectl get <pods|deployments|services|nodes|namespaces> [-n <namespace>]'], fs, cwd };

        const tablesFor = (kind: string): string[] => {
          if (kind === 'pods' || kind === 'pod' || kind === 'po') {
            if (namespace === 'kube-system') {
              return formatTable([
                ['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'],
                ['coredns-6799fbcd5-abcde', '1/1', 'Running', '0', '30d'],
                ['kube-proxy-x9z2p', '1/1', 'Running', '0', '30d'],
              ]);
            }
            return formatTable([['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'], ...FAKE_PODS.map((p) => [p.name, p.ready, p.status, p.restarts, p.age])]);
          }
          if (kind === 'deployments' || kind === 'deployment' || kind === 'deploy') {
            return formatTable([
              ['NAME', 'READY', 'UP-TO-DATE', 'AVAILABLE', 'AGE'],
              ['api', '3/3', '3', '3', '10d'],
              ['web', '2/2', '2', '2', '10d'],
            ]);
          }
          if (kind === 'services' || kind === 'service' || kind === 'svc') {
            return formatTable([
              ['NAME', 'TYPE', 'CLUSTER-IP', 'EXTERNAL-IP', 'PORT(S)', 'AGE'],
              ['api', 'ClusterIP', '10.96.12.34', '<none>', '80/TCP', '10d'],
              ['web', 'LoadBalancer', '10.96.45.67', '203.0.113.10', '80:31245/TCP', '10d'],
            ]);
          }
          if (kind === 'nodes' || kind === 'node' || kind === 'no') {
            return formatTable([
              ['NAME', 'STATUS', 'ROLES', 'AGE', 'VERSION'],
              ['node-1', 'Ready', 'control-plane', '60d', 'v1.29.2'],
              ['node-2', 'Ready', '<none>', '60d', 'v1.29.2'],
            ]);
          }
          if (kind === 'namespaces' || kind === 'namespace' || kind === 'ns') {
            return formatTable([
              ['NAME', 'STATUS', 'AGE'],
              ['default', 'Active', '60d'],
              ['kube-system', 'Active', '60d'],
            ]);
          }
          return [`error: the server doesn't have a resource type "${kind}"`];
        };

        return { output: resource.split(',').flatMap((kind, i, arr) => (i > 0 && arr.length > 1 ? ['', ...tablesFor(kind)] : tablesFor(kind))), fs, cwd };
      }

      if (sub === 'describe') {
        const [, kind, name] = rest;
        if (!kind || !name) return { output: ['kubectl: usage: kubectl describe <pod|deployment|service> <name>'], fs, cwd };
        const pod = FAKE_PODS.find((p) => p.name === name);
        const isCrashing = pod?.status === 'CrashLoopBackOff';
        return {
          output: [
            `Name:         ${name}`,
            `Namespace:    ${namespace}`,
            `Node:         node-1/10.0.1.5`,
            `Status:       ${pod?.status ?? 'Running'}`,
            `IP:           10.244.1.${23 + (name.length % 50)}`,
            '',
            'Containers:',
            `  ${kind}:`,
            `    Image:      registry.example.com/${kind}:latest`,
            '    Port:       8080/TCP',
            `    State:      ${isCrashing ? 'Waiting - reason: CrashLoopBackOff' : 'Running'}`,
            '',
            'Events:',
            '  Type     Reason     Age   From               Message',
            '  ----     ------     ----  ----               -------',
            '  Normal   Scheduled  2m    default-scheduler  Successfully assigned pod to node-1',
            '  Normal   Pulled     2m    kubelet            Container image already present on machine',
            '  Normal   Created    2m    kubelet            Created container',
            '  Normal   Started    2m    kubelet            Started container',
            ...(isCrashing ? ['  Warning  BackOff    30s   kubelet            Back-off restarting failed container'] : []),
            '(simulated)',
          ],
          fs,
          cwd,
        };
      }

      if (sub === 'apply') {
        const fIdx = rest.indexOf('-f');
        const file = fIdx !== -1 ? rest[fIdx + 1] : undefined;
        if (!file) return { output: ['kubectl: usage: kubectl apply -f <file>'], fs, cwd };
        const name = file.split('/').pop()?.replace(/\.(ya?ml)$/, '') ?? 'app';
        return { output: [`deployment.apps/${name} created (simulated)`, `service/${name} created (simulated)`], fs, cwd };
      }

      if (sub === 'delete') {
        const [, kind, name] = rest;
        if (!kind || !name) return { output: ['kubectl: usage: kubectl delete <pod|deployment|service> <name>'], fs, cwd };
        return { output: [`${kind} "${name}" deleted (simulated)`], fs, cwd };
      }

      if (sub === 'logs') {
        const name = rest.slice(1).find((a) => !a.startsWith('-'));
        if (!name) return { output: ['kubectl: usage: kubectl logs [-f] <pod>'], fs, cwd };
        const pod = FAKE_PODS.find((p) => p.name === name);
        if (pod?.status === 'CrashLoopBackOff') {
          return { output: ['Starting server...', 'Error: connect ECONNREFUSED 127.0.0.1:5432', 'Exiting with code 1 (simulated)'], fs, cwd };
        }
        return { output: ['server listening on port 8080', 'GET /health 200 2ms', 'GET /api/users 200 14ms (simulated)'], fs, cwd };
      }

      if (sub === 'exec') {
        return { output: ['kubectl exec: interactive shells are not supported in this simulated sandbox'], fs, cwd };
      }

      if (sub === 'scale') {
        const target = rest[1];
        const replicasArg = rest.find((a) => a.startsWith('--replicas='));
        if (!target || !replicasArg) return { output: ['kubectl: usage: kubectl scale deployment/<name> --replicas=<n>'], fs, cwd };
        const name = target.includes('/') ? target.split('/')[1] : target;
        return { output: [`deployment.apps/${name} scaled (simulated, now ${replicasArg.split('=')[1]} replicas)`], fs, cwd };
      }

      if (sub === 'rollout') {
        const action = rest[1];
        const target = rest[2];
        const name = target?.includes('/') ? target.split('/')[1] : target;
        if (!action || !name) return { output: ['kubectl: usage: kubectl rollout <status|undo|history> deployment/<name>'], fs, cwd };
        if (action === 'status') {
          return { output: [`Waiting for deployment "${name}" rollout to finish: 2 of 3 updated replicas are available...`, `deployment "${name}" successfully rolled out (simulated)`], fs, cwd };
        }
        if (action === 'undo') {
          return { output: [`deployment.apps/${name} rolled back (simulated)`], fs, cwd };
        }
        if (action === 'history') {
          return { output: [`deployment.apps/${name}`, 'REVISION  CHANGE-CAUSE', '1         kubectl apply --filename=deployment.yaml', '2         kubectl set image deployment/' + name + ' app=' + name + ':v2 (simulated)'], fs, cwd };
        }
        return { output: [`kubectl: unknown rollout action "${action}"`], fs, cwd };
      }

      if (sub === 'top') {
        const kind = rest[1];
        if (kind === 'nodes') {
          return { output: formatTable([['NAME', 'CPU%', 'MEMORY%'], ['node-1', '34%', '61%'], ['node-2', '28%', '55%']]), fs, cwd };
        }
        return {
          output: formatTable([
            ['NAME', 'CPU(cores)', 'MEMORY(bytes)'],
            ...FAKE_PODS.map((p) => [p.name, `${(p.name.length * 3) % 200}m`, `${(p.name.length * 11) % 500}Mi`]),
          ]),
          fs,
          cwd,
        };
      }

      if (sub === 'config') {
        const action = rest[1];
        if (action === 'get-contexts') {
          return {
            output: formatTable([
              ['CURRENT', 'NAME', 'CLUSTER', 'AUTHINFO', 'NAMESPACE'],
              ['*', 'docker-desktop', 'docker-desktop', 'docker-desktop', 'default'],
              ['', 'prod', 'prod-cluster', 'prod-admin', 'default'],
            ]),
            fs,
            cwd,
          };
        }
        if (action === 'use-context') {
          const ctx = rest[2];
          if (!ctx) return { output: ['kubectl: usage: kubectl config use-context <name>'], fs, cwd };
          return { output: [`Switched to context "${ctx}". (simulated)`], fs, cwd };
        }
        if (action === 'current-context') {
          return { output: ['docker-desktop (simulated)'], fs, cwd };
        }
        return { output: ['kubectl: usage: kubectl config <get-contexts|use-context|current-context>'], fs, cwd };
      }

      return { output: [`kubectl: '${sub}' is not a recognized command. Try: get, describe, apply, delete, logs, exec, scale, rollout, top, config`], fs, cwd };
    }

    case 'aws': {
      const service = args[0];
      if (!service) return { output: ['usage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]'], fs, cwd };
      const rest = args.slice(1);
      const action = rest[0];

      if (service === 'configure') {
        if (action === 'list') {
          return {
            output: formatTable([
              ['Name', 'Value', 'Type', 'Location'],
              ['profile', '<not set>', '', ''],
              ['access_key', '****************ABCD', 'shared-credentials-file', ''],
              ['secret_key', '****************wxyz', 'shared-credentials-file', ''],
              ['region', 'us-east-1', 'config-file', '~/.aws/config'],
            ]),
            fs,
            cwd,
          };
        }
        return { output: ['AWS Access Key ID [****************ABCD]: ', 'AWS Secret Access Key [****************wxyz]: ', 'Default region name [us-east-1]: ', 'Default output format [json]: ', '(simulated — credentials not actually persisted in this sandbox)'], fs, cwd };
      }

      if (service === 'sts') {
        if (action === 'get-caller-identity') {
          return {
            output: [
              '{',
              '    "UserId": "AIDAEXAMPLE123456789",',
              '    "Account": "123456789012",',
              '    "Arn": "arn:aws:iam::123456789012:user/deploy-bot"',
              '}',
            ],
            fs,
            cwd,
          };
        }
        if (action === 'get-access-key-info') {
          const keyId = getFlagValue(rest, '--access-key-id');
          if (!keyId) return { output: ['usage: aws sts get-access-key-info --access-key-id <value>'], fs, cwd };
          if (!/^[A-Z0-9]{16,}$/.test(keyId)) {
            return { output: ['An error occurred (ValidationError) when calling the GetAccessKeyInfo operation: Invalid id'], fs, cwd };
          }
          return { output: ['{', `    "Account": "${fakeAccountId(keyId)}"`, '}'], fs, cwd };
        }
        return { output: [`aws: '${action}' is not a valid sts command. Try: get-caller-identity, get-access-key-info`], fs, cwd };
      }

      if (service === 's3' || service === 's3api') {
        if (action === 'ls') {
          const target = rest[1];
          if (!target || service === 's3api') {
            return {
              output: formatTable([
                ['2026-01-15 09:12:03', '', 'my-bucket'],
                ['2026-03-02 17:41:55', '', 'my-static-site'],
              ].map(([a, , c]) => [a, c])),
              fs,
              cwd,
            };
          }
          return {
            output: formatTable([
              ['2026-06-01 10:22:14', '1042', 'index.html'],
              ['2026-06-01 10:22:15', '38102', 'assets/index.js'],
              ['2026-06-01 10:22:15', '8210', 'assets/index.css'],
            ]),
            fs,
            cwd,
          };
        }
        if (action === 'cp' || action === 'sync') {
          const src = rest[1];
          const dest = rest[2];
          if (!src || !dest) return { output: [`usage: aws s3 ${action} <source> <dest> [--recursive] [--delete]`], fs, cwd };
          const verb = action === 'sync' ? 'sync' : 'copy';
          return {
            output: [
              `upload: ${src}/index.html to ${dest}index.html (simulated)`,
              `upload: ${src}/assets/index.js to ${dest}assets/index.js (simulated)`,
              `upload: ${src}/assets/index.css to ${dest}assets/index.css (simulated)`,
              ...(rest.includes('--delete') ? ['delete: ' + dest + 'assets/old-chunk.js (simulated)'] : []),
              `${verb} complete (simulated)`,
            ],
            fs,
            cwd,
          };
        }
        if (action === 'head-object') {
          const key = getFlagValue(rest, '--key') ?? 'object';
          return {
            output: ['{', `    "ETag": "\\"${fakeHex(key, 32)}\\"",`, '    "ContentLength": 1042,', '    "ContentType": "text/html"', '}'],
            fs,
            cwd,
          };
        }
        return { output: [`aws: '${action}' is not a valid s3 command. Try: ls, cp, sync, head-object`], fs, cwd };
      }

      if (service === 'ec2') {
        if (action === 'describe-instances') {
          return {
            output: formatTable([
              ['InstanceId', 'State', 'PublicIp'],
              ['i-0123456789abcdef0', 'running', '203.0.113.24'],
              ['i-0fedcba9876543210', 'stopped', '-'],
            ]),
            fs,
            cwd,
          };
        }
        if (action === 'start-instances' || action === 'stop-instances') {
          const idsIdx = rest.indexOf('--instance-ids');
          const id = idsIdx !== -1 ? rest[idsIdx + 1] : undefined;
          if (!id) return { output: [`usage: aws ec2 ${action} --instance-ids <id>`], fs, cwd };
          const [from, to] = action === 'start-instances' ? ['stopped', 'pending'] : ['running', 'stopping'];
          return {
            output: ['{', `    "${action === 'start-instances' ? 'StartingInstances' : 'StoppingInstances'}": [`, '        {', `            "InstanceId": "${id}",`, `            "CurrentState": { "Name": "${to}" },`, `            "PreviousState": { "Name": "${from}" }`, '        }', '    ]', '} (simulated)'],
            fs,
            cwd,
          };
        }
        if (action === 'describe-instance-status') {
          return { output: ['{', '    "InstanceStatuses": [{ "InstanceStatus": { "Status": "ok" }, "SystemStatus": { "Status": "ok" } }]', '} (simulated)'], fs, cwd };
        }
        return { output: [`aws: '${action}' is not a valid ec2 command. Try: describe-instances, start-instances, stop-instances, describe-instance-status`], fs, cwd };
      }

      if (service === 'iam') {
        if (action === 'list-users') {
          return { output: formatTable([['UserName', 'Arn'], ['deploy-bot', 'arn:aws:iam::123456789012:user/deploy-bot'], ['jane.doe', 'arn:aws:iam::123456789012:user/jane.doe']]), fs, cwd };
        }
        if (action === 'list-attached-user-policies') {
          const user = getFlagValue(rest, '--user-name') ?? 'user';
          return { output: formatTable([['PolicyName', 'PolicyArn'], ['AmazonS3FullAccess', 'arn:aws:iam::aws:policy/AmazonS3FullAccess'], [`${user}-inline-policy`, `arn:aws:iam::123456789012:policy/${user}-inline-policy`]]), fs, cwd };
        }
        if (action === 'create-access-key') {
          const user = getFlagValue(rest, '--user-name') ?? 'user';
          const newKey = `AKIA${fakeHex(user + Date.now(), 16).toUpperCase()}`;
          return { output: ['{', '    "AccessKey": {', `        "UserName": "${user}",`, `        "AccessKeyId": "${newKey}",`, '        "Status": "Active",', `        "SecretAccessKey": "${fakeHex(user + 'secret', 40)}"`, '    }', '} (simulated — store this now, it cannot be retrieved again)'], fs, cwd };
        }
        if (action === 'delete-access-key') {
          const keyId = getFlagValue(rest, '--access-key-id');
          if (!keyId) return { output: ['usage: aws iam delete-access-key --user-name <name> --access-key-id <id>'], fs, cwd };
          return { output: [`Access key ${keyId} deleted (simulated)`], fs, cwd };
        }
        if (action === 'simulate-principal-policy') {
          const actionName = getFlagValue(rest, '--action-names') ?? 'unknown:Action';
          return { output: formatTable([['EvalActionName', 'EvalDecision'], [actionName, 'allowed']]), fs, cwd };
        }
        return { output: [`aws: '${action}' is not a valid iam command. Try: list-users, list-attached-user-policies, create-access-key, delete-access-key, simulate-principal-policy`], fs, cwd };
      }

      if (service === 'ecs') {
        const cluster = getFlagValue(rest, '--cluster') ?? 'my-cluster';
        if (action === 'list-services') {
          return { output: ['{', `    "serviceArns": ["arn:aws:ecs:us-east-1:123456789012:service/${cluster}/my-service"]`, '}'], fs, cwd };
        }
        if (action === 'describe-services') {
          return { output: ['{', '    "services": [{', '        "deployments": [', '            { "status": "PRIMARY", "desiredCount": 3, "runningCount": 3 }', '        ]', '    }]', '} (simulated)'], fs, cwd };
        }
        if (action === 'list-tasks') {
          return { output: ['{', `    "taskArns": ["arn:aws:ecs:us-east-1:123456789012:task/${cluster}/${fakeHex(cluster, 32)}"]`, '}'], fs, cwd };
        }
        if (action === 'describe-tasks') {
          return { output: ['{', '    "tasks": [{ "lastStatus": "RUNNING", "healthStatus": "HEALTHY", "stoppedReason": "" }]', '} (simulated)'], fs, cwd };
        }
        if (action === 'update-service') {
          const svc = getFlagValue(rest, '--service') ?? 'my-service';
          return { output: [`Service ${svc} in cluster ${cluster} forced to redeploy (simulated)`], fs, cwd };
        }
        return { output: [`aws: '${action}' is not a valid ecs command. Try: list-services, describe-services, list-tasks, describe-tasks, update-service`], fs, cwd };
      }

      if (service === 'eks') {
        if (action === 'list-clusters') {
          return { output: ['{', '    "clusters": ["my-cluster"]', '}'], fs, cwd };
        }
        if (action === 'update-kubeconfig') {
          const name = getFlagValue(rest, '--name') ?? 'my-cluster';
          return { output: [`Added new context arn:aws:eks:us-east-1:123456789012:cluster/${name} to ~/.kube/config (simulated)`], fs, cwd };
        }
        if (action === 'describe-cluster') {
          return { output: ['{', '    "cluster": { "status": "ACTIVE" }', '}'], fs, cwd };
        }
        return { output: [`aws: '${action}' is not a valid eks command. Try: list-clusters, update-kubeconfig, describe-cluster`], fs, cwd };
      }

      if (service === 'logs') {
        if (action === 'describe-log-groups') {
          return { output: ['{', '    "logGroups": ["/ecs/my-service", "/aws/lambda/my-function"]', '}'], fs, cwd };
        }
        if (action === 'tail') {
          const group = rest[1] ?? '/ecs/my-service';
          return {
            output: [
              `${group} (simulated tail)`,
              '2026-07-17T10:22:01Z  server listening on port 8080',
              '2026-07-17T10:22:03Z  GET /health 200 2ms',
              '2026-07-17T10:22:14Z  GET /api/users 200 14ms',
              ...(rest.includes('--follow') ? ['(streaming — press Ctrl+C to stop, simulated)'] : []),
            ],
            fs,
            cwd,
          };
        }
        if (action === 'filter-log-events') {
          const pattern = getFlagValue(rest, '--filter-pattern') ?? '';
          return {
            output: pattern.includes('ERROR')
              ? ['{', '    "events": [{ "message": "2026-07-17T09:58:12Z ERROR connect ECONNREFUSED 127.0.0.1:5432" }]', '} (simulated)']
              : ['{', '    "events": []', '} (simulated)'],
            fs,
            cwd,
          };
        }
        return { output: [`aws: '${action}' is not a valid logs command. Try: describe-log-groups, tail, filter-log-events`], fs, cwd };
      }

      if (service === 'cloudformation') {
        const stackName = getFlagValue(rest, '--stack-name') ?? 'my-stack';
        if (action === 'describe-stacks') {
          return { output: ['{', '    "Stacks": [{ "StackStatus": "UPDATE_COMPLETE" }]', '}'], fs, cwd };
        }
        if (action === 'describe-stack-events') {
          return {
            output: formatTable([
              ['Timestamp', 'ResourceStatus', 'LogicalResourceId'],
              ['2026-07-17T10:00:00Z', 'UPDATE_COMPLETE', stackName],
              ['2026-07-17T09:59:40Z', 'UPDATE_IN_PROGRESS', 'AppServiceTaskDef'],
              ['2026-07-17T09:59:10Z', 'UPDATE_IN_PROGRESS', stackName],
            ]),
            fs,
            cwd,
          };
        }
        return { output: [`aws: '${action}' is not a valid cloudformation command. Try: describe-stacks, describe-stack-events`], fs, cwd };
      }

      if (service === 'secretsmanager') {
        if (action === 'get-secret-value') {
          const id = getFlagValue(rest, '--secret-id') ?? 'my-secret';
          return { output: [`${fakeHex(id, 24)} (simulated secret value)`], fs, cwd };
        }
        return { output: [`aws: '${action}' is not a valid secretsmanager command. Try: get-secret-value`], fs, cwd };
      }

      if (service === 'ssm') {
        if (action === 'get-parameter') {
          const name = getFlagValue(rest, '--name') ?? '/myapp/prod/API_URL';
          return { output: [`https://api.example.com (simulated value of ${name})`], fs, cwd };
        }
        if (action === 'put-parameter') {
          const name = getFlagValue(rest, '--name') ?? '/myapp/prod/API_URL';
          return { output: [`Parameter ${name} updated (simulated)`], fs, cwd };
        }
        return { output: [`aws: '${action}' is not a valid ssm command. Try: get-parameter, put-parameter`], fs, cwd };
      }

      if (service === 'ce') {
        if (action === 'get-cost-and-usage') {
          return {
            output: formatTable([
              ['Service', 'BlendedCost (USD)'],
              ['Amazon Elastic Compute Cloud', '412.55'],
              ['Amazon Simple Storage Service', '38.20'],
              ['Amazon Elastic Container Service', '96.10'],
            ]),
            fs,
            cwd,
          };
        }
        return { output: [`aws: '${action}' is not a valid ce command. Try: get-cost-and-usage`], fs, cwd };
      }

      return { output: [`aws: '${service}' is not a recognized service. Try: sts, s3, ec2, iam, ecs, eks, logs, cloudformation, secretsmanager, ssm, ce, configure`], fs, cwd };
    }

    case 'ls': {
      const { flags, positional } = splitFlags(args);
      const segs = resolvePath(cwd, positional[0] ?? '.');
      const node = getNode(fs, segs);
      if (!node) return { output: [`ls: cannot access '${positional[0]}': No such file or directory`], fs, cwd };
      if (node.type === 'file') return { output: [positional[0] ?? basename(segs)], fs, cwd };

      let names = Object.keys(node.children).sort();
      if (!flags.has('a')) names = names.filter((n) => !n.startsWith('.'));

      if (flags.has('l')) {
        const lines = names.map((n) => {
          const child = node.children[n];
          const suffix = child.type === 'dir' ? '/' : '';
          return `${child.mode}  ${String(fakeSize(child as never)).padStart(5)}  ${n}${suffix}`;
        });
        return { output: lines.length ? lines : [], fs, cwd };
      }
      return { output: [names.map((n) => (node.children[n].type === 'dir' ? `${n}/` : n)).join('  ')], fs, cwd };
    }

    case 'cd': {
      const target = args[0];
      const segs = resolvePath(cwd, target ?? '~');
      const node = getNode(fs, segs);
      if (!node) return { output: [`cd: no such file or directory: ${target}`], fs, cwd };
      if (node.type !== 'dir') return { output: [`cd: not a directory: ${target}`], fs, cwd };
      return { output: [], fs, cwd: segs };
    }

    case 'mkdir': {
      const { flags, positional } = splitFlags(args);
      const target = positional[0];
      if (!target) return { output: ['mkdir: missing operand'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const next = cloneFs(fs);

      if (flags.has('p')) {
        let cursor = next as FSDir;
        for (const seg of segs) {
          if (!cursor.children[seg]) {
            cursor.children[seg] = { type: 'dir', mode: 'drwxr-xr-x', children: {} };
          }
          const child = cursor.children[seg];
          if (child.type !== 'dir') return { output: [`mkdir: '${target}': Not a directory`], fs, cwd };
          cursor = child;
        }
        return { output: [], fs: next, cwd };
      }

      const parent = getParent(next, segs);
      if (!parent) return { output: [`mkdir: cannot create directory '${target}': No such file or directory`], fs, cwd };
      const name = basename(segs);
      if (parent.children[name]) return { output: [`mkdir: cannot create directory '${target}': File exists`], fs, cwd };
      parent.children[name] = { type: 'dir', mode: 'drwxr-xr-x', children: {} };
      return { output: [], fs: next, cwd };
    }

    case 'touch': {
      const target = args[0];
      if (!target) return { output: ['touch: missing operand'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const next = cloneFs(fs);
      const parent = getParent(next, segs);
      if (!parent) return { output: [`touch: cannot touch '${target}': No such file or directory`], fs, cwd };
      const name = basename(segs);
      if (!parent.children[name]) {
        parent.children[name] = { type: 'file', content: '', mode: '-rw-r--r--' };
      }
      return { output: [], fs: next, cwd };
    }

    case 'rm': {
      const { flags, positional } = splitFlags(args);
      const target = positional[0];
      if (!target) return { output: ['rm: missing operand'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const next = cloneFs(fs);
      const parent = getParent(next, segs);
      const name = basename(segs);
      const node = parent?.children[name];
      if (!node) {
        if (flags.has('f')) return { output: [], fs: next, cwd };
        return { output: [`rm: cannot remove '${target}': No such file or directory`], fs, cwd };
      }
      if (node.type === 'dir' && !flags.has('r')) {
        return { output: [`rm: cannot remove '${target}': Is a directory`], fs, cwd };
      }
      delete parent!.children[name];
      return { output: [], fs: next, cwd };
    }

    case 'cp': {
      const { flags, positional } = splitFlags(args);
      const [src, dest] = positional;
      if (!src || !dest) return { output: ['cp: usage: cp [-r] <source> <dest>'], fs, cwd };
      const srcSegs = resolvePath(cwd, src);
      const srcNode = getNode(fs, srcSegs);
      if (!srcNode) return { output: [`cp: cannot stat '${src}': No such file or directory`], fs, cwd };
      if (srcNode.type === 'dir' && !flags.has('r')) {
        return { output: [`cp: -r not specified; omitting directory '${src}'`], fs, cwd };
      }
      const next = cloneFs(fs);
      let destSegs = resolvePath(cwd, dest);
      const destNode = getNode(next, destSegs);
      if (destNode && destNode.type === 'dir') destSegs = [...destSegs, basename(srcSegs)];
      const parent = getParent(next, destSegs);
      if (!parent) return { output: [`cp: cannot create '${dest}': No such file or directory`], fs, cwd };
      parent.children[basename(destSegs)] = JSON.parse(JSON.stringify(srcNode));
      return { output: [], fs: next, cwd };
    }

    case 'mv': {
      const [src, dest] = args;
      if (!src || !dest) return { output: ['mv: usage: mv <source> <dest>'], fs, cwd };
      const srcSegs = resolvePath(cwd, src);
      const next = cloneFs(fs);
      const srcParent = getParent(next, srcSegs);
      const srcName = basename(srcSegs);
      const srcNode = srcParent?.children[srcName];
      if (!srcNode) return { output: [`mv: cannot stat '${src}': No such file or directory`], fs, cwd };

      let destSegs = resolvePath(cwd, dest);
      const destNode = getNode(next, destSegs);
      if (destNode && destNode.type === 'dir') destSegs = [...destSegs, srcName];
      const destParent = getParent(next, destSegs);
      if (!destParent) return { output: [`mv: cannot move to '${dest}': No such file or directory`], fs, cwd };

      destParent.children[basename(destSegs)] = srcNode;
      delete srcParent!.children[srcName];
      return { output: [], fs: next, cwd };
    }

    case 'cat': {
      const target = args[0];
      if (!target) return { output: ['cat: missing operand'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      if (!node) return { output: [`cat: ${target}: No such file or directory`], fs, cwd };
      if (node.type !== 'file') return { output: [`cat: ${target}: Is a directory`], fs, cwd };
      return { output: node.content.split('\n'), fs, cwd };
    }

    case 'vi':
    case 'vim': {
      const target = args[0];
      if (!target) return { output: [`${cmd}: usage: ${cmd} <file>`], fs, cwd };
      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      if (node && node.type !== 'file') return { output: [`${cmd}: ${target}: Is a directory`], fs, cwd };
      if (!node && !getParent(fs, segs)) return { output: [`${cmd}: cannot open '${target}': No such file or directory`], fs, cwd };
      return { output: [], fs, cwd, openEditor: { fileSegs: segs, filename: target, content: node?.type === 'file' ? node.content : '' } };
    }

    case 'head':
    case 'tail': {
      const { flags: rawFlags, positional } = splitFlags(args);
      let n = 10;
      const nIdx = args.indexOf('-n');
      if (nIdx !== -1 && args[nIdx + 1]) n = parseInt(args[nIdx + 1], 10) || 10;
      const target = positional.find((p) => p !== String(n));
      void rawFlags;
      if (!target) return { output: [`${cmd}: missing operand`], fs, cwd };
      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      if (!node || node.type !== 'file') return { output: [`${cmd}: cannot open '${target}'`], fs, cwd };
      const lines = node.content.split('\n');
      return { output: cmd === 'head' ? lines.slice(0, n) : lines.slice(-n), fs, cwd };
    }

    case 'wc': {
      const { flags, positional } = splitFlags(args);
      const target = positional[0];
      if (!target) return { output: ['wc: missing operand'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      if (!node || node.type !== 'file') return { output: [`wc: ${target}: No such file or directory`], fs, cwd };
      const lines = node.content.split('\n').length;
      const words = node.content.split(/\s+/).filter(Boolean).length;
      const chars = node.content.length;
      if (flags.has('l')) return { output: [`${lines} ${target}`], fs, cwd };
      return { output: [`${lines} ${words} ${chars} ${target}`], fs, cwd };
    }

    case 'echo': {
      const gtIdx = args.indexOf('>');
      const appendIdx = args.indexOf('>>');
      const redirIdx = gtIdx !== -1 ? gtIdx : appendIdx;
      const append = appendIdx !== -1;

      if (redirIdx === -1) {
        return { output: [args.join(' ')], fs, cwd };
      }

      const text = args.slice(0, redirIdx).join(' ');
      const target = args[redirIdx + 1];
      if (!target) return { output: ['echo: missing redirection target'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const next = cloneFs(fs);
      const parent = getParent(next, segs);
      if (!parent) return { output: [`echo: cannot write to '${target}': No such file or directory`], fs, cwd };
      const name = basename(segs);
      const existing = parent.children[name];
      const prior = existing && existing.type === 'file' && append ? existing.content + '\n' : '';
      parent.children[name] = { type: 'file', content: prior + text, mode: '-rw-r--r--' };
      return { output: [], fs: next, cwd };
    }

    case 'grep': {
      const [pattern, target] = args;
      if (!pattern || !target) return { output: ['grep: usage: grep <pattern> <file>'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      if (!node || node.type !== 'file') return { output: [`grep: ${target}: No such file or directory`], fs, cwd };
      const matches = node.content.split('\n').filter((l) => l.includes(pattern));
      return { output: matches, fs, cwd };
    }

    case 'jq': {
      const [filter, target] = args;
      if (!filter || !target) return { output: ["jq: usage: jq '<filter>' <file>"], fs, cwd };
      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      if (!node || node.type !== 'file') return { output: [`jq: ${target}: No such file or directory`], fs, cwd };

      let data: unknown;
      try {
        data = JSON.parse(node.content);
      } catch {
        return { output: [`jq: error: ${target} is not valid JSON`], fs, cwd };
      }

      const print = (v: unknown) => (typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v, null, 2)) ?? 'null';

      if (filter === '.') return { output: [print(data)], fs, cwd };
      if (filter === 'keys') {
        if (typeof data !== 'object' || data === null) return { output: ['jq: error: keys requires an object or array'], fs, cwd };
        return { output: [print(Array.isArray(data) ? data.map((_, i) => i) : Object.keys(data))], fs, cwd };
      }
      if (filter === 'length') {
        const len = Array.isArray(data) ? data.length : typeof data === 'string' ? data.length : typeof data === 'object' && data !== null ? Object.keys(data).length : 0;
        return { output: [String(len)], fs, cwd };
      }
      if (filter.startsWith('.')) {
        const path = filter.slice(1).split(/\.|\[|\]/).filter(Boolean);
        let cur: unknown = data;
        for (const seg of path) {
          if (cur == null) break;
          cur = /^\d+$/.test(seg) ? (cur as unknown[])[Number(seg)] : (cur as Record<string, unknown>)[seg];
        }
        return { output: [cur === undefined ? 'null' : print(cur)], fs, cwd };
      }
      return { output: [`jq: error: unsupported filter '${filter}' (try '.', '.field', '.field[0]', 'keys', or 'length')`], fs, cwd };
    }

    case 'find': {
      const nameIdx = args.indexOf('-name');
      const startArg = nameIdx === -1 ? args[0] : args[0] ?? '.';
      const pattern = nameIdx !== -1 ? args[nameIdx + 1] : undefined;
      const segs = resolvePath(cwd, startArg ?? '.');
      const node = getNode(fs, segs);
      if (!node) return { output: [`find: '${startArg}': No such file or directory`], fs, cwd };

      const regex = pattern ? new RegExp('^' + pattern.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$') : null;
      const results: string[] = [];
      const walk = (n: typeof node, path: string[]) => {
        if (!regex || regex.test(basename(path)) || path.length === 0) results.push(formatPath(path));
        if (n.type === 'dir') {
          for (const [childName, child] of Object.entries(n.children)) {
            walk(child, [...path, childName]);
          }
        }
      };
      walk(node, segs);
      return { output: results.length ? results : [], fs, cwd };
    }

    case 'chmod': {
      const [mode, target] = args;
      if (!mode || !target) return { output: ['chmod: usage: chmod <mode> <file>'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const next = cloneFs(fs);
      const node = getNode(next, segs);
      if (!node) return { output: [`chmod: cannot access '${target}': No such file or directory`], fs, cwd };

      if (mode === '+x') {
        node.mode = node.mode.replace(/^(.)(...)(...)(...)/, (_m, t, o, g, ot) =>
          t + o.slice(0, 2) + 'x' + g.slice(0, 2) + 'x' + ot.slice(0, 2) + 'x'
        );
      } else if (mode === '-x') {
        node.mode = node.mode.replace(/x/g, '-');
      } else if (/^\d{3}$/.test(mode)) {
        const bits = 'rwx';
        node.mode = (node.type === 'dir' ? 'd' : '-') + mode
          .split('')
          .map((digit) => {
            const n = parseInt(digit, 10);
            return [4, 2, 1].map((b, i) => (n & b ? bits[i] : '-')).join('');
          })
          .join('');
      } else {
        return { output: [`chmod: invalid mode: '${mode}'`], fs, cwd };
      }
      return { output: [], fs: next, cwd };
    }

    case 'chown': {
      const [owner, target] = args;
      if (!owner || !target) return { output: ['chown: usage: chown <user>:<group> <file>'], fs, cwd };
      const segs = resolvePath(cwd, target);
      const node = getNode(fs, segs);
      if (!node) return { output: [`chown: cannot access '${target}': No such file or directory`], fs, cwd };
      return { output: [`changed ownership of '${target}' to ${owner}`], fs, cwd };
    }

    default:
      return { output: [`command not found: ${cmd} (type "help" to see available commands)`], fs, cwd };
  }
}

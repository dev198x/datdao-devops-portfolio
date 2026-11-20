/**
 * Risk of running an example, shown as a badge in the cheatsheet.
 * Omitted = read-only / safe to run (and safe to hand to an AI agent).
 */
export type CommandRisk = 'changes' | 'destructive';

export interface CommandExample {
  cmd: string;
  note: string;
  group?: string;
  risk?: CommandRisk;
}

export interface LinuxCommand {
  name: string;
  category: string;
  syntax: string;
  description: string;
  /** Extra search keywords (what people type when they do not know the command name). */
  tags?: string[];
  examples: CommandExample[];
}

export const linuxCommandCategories = [
  'All',
  'AI Agents',
  'Files & Text',
  'Search',
  'Process & System',
  'Networking',
  'Git & CI',
  'Containers & K8s',
  'Cloud & IaC',
  'Databases',
  'Security',
] as const;

export const linuxCommands: LinuxCommand[] = [
  // ───────────────────────── AI Agents ─────────────────────────
  {
    name: 'claude',
    category: 'AI Agents',
    syntax: 'claude [-p "<prompt>"] [-c | -r] [mcp <add|list|remove>]',
    description:
      'Claude Code CLI. Interactive by default; -p runs one prompt non-interactively and prints the result, so it can sit in a pipe, a script or CI. -c continues the last session in this directory, -r lets you pick an older one.',
    tags: ['ai', 'agent', 'llm', 'mcp', 'anthropic', 'automation'],
    examples: [
      { cmd: 'claude', note: 'start an interactive session in the current repo' },
      { cmd: 'claude -p "why does this fail?" < error.log', note: 'one-shot answer about piped input, handy in scripts' },
      { cmd: 'git diff main | claude -p "review this diff for bugs and risky changes"', note: 'quick review before opening a PR' },
      { cmd: 'claude -p "list the endpoints" --output-format json', note: 'machine-readable output for tooling' },
      { cmd: 'claude -c', note: 'continue the most recent conversation' },
      { group: 'MCP', cmd: 'claude mcp list', note: 'show the MCP servers (tools such as Slack, Jira, Postgres) the agent can use' },
      { group: 'MCP', cmd: 'claude mcp add <name> -- <command> [args]', note: 'register a local MCP server', risk: 'changes' },
      { group: 'In a session', cmd: '/init', note: 'generate a CLAUDE.md describing the repo, so the agent starts with project context' },
      { group: 'In a session', cmd: '/compact', note: 'summarise a long conversation to free up context' },
      { group: 'In a session', cmd: '/clear', note: 'start fresh between unrelated tasks' },
    ],
  },
  {
    name: 'agent-safe-commands',
    category: 'AI Agents',
    syntax: 'reference — what to let an agent run vs. what a human should run',
    description:
      'Rule of thumb for AI agents on real infrastructure: let them investigate with read-only commands, let them propose changes as a diff or plan, and keep apply/delete steps for a person. Use read-only credentials where you can, and never paste secrets into a prompt.',
    tags: ['ai', 'agent', 'safety', 'read-only', 'permissions', 'guardrails', 'production'],
    examples: [
      { group: 'Safe to automate', cmd: 'kubectl get pods -n <ns> -o wide && kubectl describe pod <pod> -n <ns>', note: 'inspect workloads' },
      { group: 'Safe to automate', cmd: 'kubectl logs <pod> -n <ns> --since=1h --tail=200', note: 'recent logs only, bounded output' },
      { group: 'Safe to automate', cmd: 'aws sts get-caller-identity', note: 'always confirm which account/role you are on first' },
      { group: 'Safe to automate', cmd: 'terraform plan -out=tfplan', note: 'shows what would change; changes nothing' },
      { group: 'Safe to automate', cmd: 'git status && git diff', note: 'see exactly what the agent changed' },
      { group: 'Safe to automate', cmd: "PGOPTIONS='-c default_transaction_read_only=on' psql \"$DATABASE_URL\"", note: 'Postgres session that rejects writes' },
      { group: 'Human approval', cmd: 'kubectl apply -f ... | kubectl delete ...', note: 'changes the cluster — review the diff first', risk: 'changes' },
      { group: 'Human approval', cmd: 'terraform apply | terraform destroy', note: 'changes or deletes real infrastructure', risk: 'destructive' },
      { group: 'Human approval', cmd: 'helm uninstall <release>', note: 'removes a release and its resources', risk: 'destructive' },
      { group: 'Human approval', cmd: 'rm -rf <path> | git reset --hard | git push --force', note: 'cannot be undone', risk: 'destructive' },
      { group: 'Human approval', cmd: 'aws iam put-* | aws iam delete-*', note: 'changes who can access what', risk: 'destructive' },
    ],
  },

  // ───────────────────────── Files & Text ─────────────────────────
  {
    name: 'ls / cp / mv / rm',
    category: 'Files & Text',
    syntax: 'ls [-lah] | cp [-r] <src> <dst> | mv <src> <dst> | mkdir -p <dir> | rm [-r] <path> | ln -s <target> <link>',
    description:
      'Everyday file handling. rm has no undo and -f hides errors, so check the path (ls it first) before deleting. mv also renames. ln -s makes a symlink, for example to point a stable path at one specific tool version.',
    tags: ['list', 'copy', 'move', 'rename', 'delete', 'remove', 'mkdir', 'symlink', 'link', 'directory'],
    examples: [
      { cmd: 'ls -lah', note: 'detailed listing with hidden files and readable sizes' },
      { cmd: 'mkdir -p src/utils', note: 'create a directory and any missing parents' },
      { cmd: 'cp -r app backup/app', note: 'copy a directory tree', risk: 'changes' },
      { cmd: 'mv old-name.txt new-name.txt', note: 'rename (or move) a file', risk: 'changes' },
      { cmd: 'ln -s ~/.nvm/versions/node/<version>/bin/node ~/bin/node', note: 'symlink a specific binary onto a stable path', risk: 'changes' },
      { cmd: 'ls <path> && rm -rf <path>', note: 'look at it first, then delete recursively', risk: 'destructive' },
    ],
  },
  {
    name: 'tail / head / less',
    category: 'Files & Text',
    syntax: 'tail [-n N] [-f] <file> | head [-n N] <file> | less [+F] <file>',
    description:
      'Read files without opening an editor. tail -f follows a log as it grows. less lets you scroll and search (/pattern); less +F behaves like tail -f and Ctrl+C lets you scroll back.',
    tags: ['log', 'logs', 'follow', 'cat', 'view', 'read', 'wc', 'count lines'],
    examples: [
      { cmd: 'tail -f app.log', note: 'follow a log in real time (Ctrl+C to stop)' },
      { cmd: 'tail -n 100 app.log', note: 'last 100 lines' },
      { cmd: 'head -n 5 data.csv', note: 'first 5 lines — peek at a big file' },
      { cmd: 'less +F app.log', note: 'follow a log but still be able to scroll and search' },
      { cmd: 'wc -l app.log', note: 'count lines' },
    ],
  },
  {
    name: 'sed',
    category: 'Files & Text',
    syntax: "sed [-i.bak] 's/<old>/<new>/g' <file>",
    description:
      'Stream editor: search and replace, or print a range of lines. -i edits the file in place; giving it a suffix (-i.bak) keeps a backup and works the same on Linux and macOS.',
    tags: ['replace', 'substitute', 'find and replace', 'edit', 'lines'],
    examples: [
      { cmd: "sed -n '10,20p' app.log", note: 'print lines 10 to 20 only' },
      { cmd: "sed 's/staging/prod/g' config.yaml", note: 'preview a replacement (prints, does not modify)' },
      { cmd: "sed -i.bak 's/staging/prod/g' config.yaml", note: 'apply it in place, keeping config.yaml.bak', risk: 'changes' },
    ],
  },
  {
    name: 'awk / sort / uniq',
    category: 'Files & Text',
    syntax: "awk '{print $N}' <file> | sort | uniq -c | sort -rn",
    description:
      'Turn a log into a quick report. awk picks columns, sort | uniq -c counts duplicates, sort -rn ranks them. Classic for "which IPs / URLs / errors are most frequent".',
    tags: ['column', 'count', 'top', 'frequent', 'report', 'log analysis', 'ip'],
    examples: [
      { cmd: "awk '{print $1}' access.log | sort | uniq -c | sort -rn | head", note: 'top 10 client IPs in an nginx access log' },
      { cmd: "awk '$9 >= 500' access.log | wc -l", note: 'count 5xx responses (status is column 9 in the default format)' },
      { cmd: "awk -F: '{print $1}' /etc/passwd", note: 'use a different field separator' },
    ],
  },
  {
    name: 'xargs',
    category: 'Files & Text',
    syntax: '<producer> | xargs [-0] [-I{}] <command>',
    description:
      'Run a command once per input line, or with all lines as arguments. Use -print0 / -0 when names may contain spaces. Add echo in front of the command to preview what would run.',
    tags: ['pipe', 'batch', 'bulk', 'loop', 'each'],
    examples: [
      { cmd: 'find . -name "*.log" -print0 | xargs -0 ls -lh', note: 'safe with spaces in file names' },
      { cmd: 'grep -rl "TODO" src | xargs wc -l', note: 'run wc on every file that matched' },
      { cmd: 'kubectl get pods -o name | xargs -I{} echo kubectl delete {}', note: 'dry run: print the commands instead of running them' },
    ],
  },
  {
    name: 'jq / yq',
    category: 'Files & Text',
    syntax: "jq '<filter>' <file> | yq '<expr>' <file>",
    description:
      'Query JSON (jq) and YAML (yq, the mikefarah v4 version) from the shell. Typical use: pull one field out of an API response, a kubectl -o json dump, or a Kubernetes manifest. -r prints raw strings without quotes.',
    tags: ['json', 'yaml', 'parse', 'filter', 'api', 'manifest', 'pretty print'],
    examples: [
      { cmd: "jq '.' config.json", note: 'pretty-print and validate JSON' },
      { cmd: "curl -s https://api.example.com/users | jq -r '.[].email'", note: 'one field from every item of an API response' },
      { cmd: "kubectl get pods -o json | jq -r '.items[].metadata.name'", note: 'pod names from kubectl JSON' },
      { cmd: "jq -c 'select(.level==\"error\")' app.log", note: 'filter JSON-lines logs down to errors' },
      { cmd: "yq '.spec.replicas' deployment.yaml", note: 'read a value from YAML' },
      { cmd: "yq -i '.spec.replicas = 3' deployment.yaml", note: 'edit YAML in place', risk: 'changes' },
    ],
  },
  {
    name: 'tar / rsync',
    category: 'Files & Text',
    syntax: 'tar -czf <out.tgz> <dir> | tar -xzf <in.tgz> -C <dir> | rsync -avz [--dry-run] <src>/ <dest>',
    description:
      'Archive and sync. tar bundles a directory (c create, x extract, t list, z gzip, f file). rsync copies only what changed, over SSH too; always run it with --dry-run first, and be careful with --delete since it removes files on the destination.',
    tags: ['archive', 'compress', 'zip', 'backup', 'copy', 'sync', 'deploy', 'upload'],
    examples: [
      { cmd: 'tar -czf backup.tgz app/', note: 'create a compressed archive', risk: 'changes' },
      { cmd: 'tar -tzf backup.tgz | head', note: 'list the contents without extracting' },
      { cmd: 'tar -xzf backup.tgz -C /tmp/restore', note: 'extract into a chosen directory', risk: 'changes' },
      { cmd: 'rsync -avz --dry-run ./dist/ user@host:/var/www/app/', note: 'show what would be copied' },
      { cmd: 'rsync -avz ./dist/ user@host:/var/www/app/', note: 'do the copy', risk: 'changes' },
      { cmd: 'rsync -avz --delete ./dist/ user@host:/var/www/app/', note: 'mirror exactly, deleting extra remote files', risk: 'destructive' },
    ],
  },
  {
    name: 'chmod / chown',
    category: 'Files & Text',
    syntax: 'chmod <mode> <file> | chown <user>:<group> <file>',
    description:
      'Permissions and ownership. Mode digits are owner, group, others, each read(4)+write(2)+execute(1). Private keys must not be readable by others (600) or ssh refuses them.',
    tags: ['permission', 'permissions', 'executable', 'owner', 'access denied', 'permission denied'],
    examples: [
      { cmd: 'chmod +x deploy.sh', note: 'make a script executable', risk: 'changes' },
      { cmd: 'chmod 600 ~/.ssh/id_ed25519', note: 'owner read/write only — required for SSH private keys', risk: 'changes' },
      { cmd: 'chmod 644 notes.txt', note: 'owner read/write, everyone else read-only', risk: 'changes' },
      { cmd: 'chown -R app:app /var/www/app', note: 'give a service user ownership of a tree', risk: 'changes' },
    ],
  },
  {
    name: 'base64',
    category: 'Files & Text',
    syntax: 'base64 [-d] [<file>]',
    description:
      'Encode data as base64 (for env vars, JSON, Kubernetes Secrets) or decode it with -d. It is an encoding, not encryption: anyone can reverse it, so it does not protect a secret. Strip newlines with tr when you need one line (the -w0 flag exists only in GNU base64).',
    tags: ['encode', 'decode', 'secret', 'kubernetes secret', 'token'],
    examples: [
      { cmd: 'printf %s "hello" | base64', note: 'encode without a trailing newline → aGVsbG8=' },
      { cmd: 'echo "aGVsbG8=" | base64 -d', note: 'decode → hello' },
      { cmd: 'base64 < cert.pem | tr -d "\\n"', note: 'one-line encoding that works on Linux and macOS' },
      { cmd: "kubectl get secret <name> -o jsonpath='{.data.<key>}' | base64 -d", note: 'read one key of a Kubernetes Secret (prints the secret — do not paste it into chats or tickets)' },
    ],
  },

  // ───────────────────────── Search ─────────────────────────
  {
    name: 'grep',
    category: 'Search',
    syntax: 'grep [-rniEcv] [-C N] <pattern> <path>',
    description:
      'Search text. -r recurse, -n line numbers, -i ignore case, -E extended regex, -v invert, -c count, -C N show N lines of context around each hit.',
    tags: ['search', 'find text', 'filter', 'log', 'regex', 'error'],
    examples: [
      { cmd: 'grep -rn "TODO" src/', note: 'every TODO in a source tree, with line numbers' },
      { cmd: 'grep -iE "error|fatal|panic" app.log', note: 'any of several words, case-insensitive' },
      { cmd: 'grep -C 3 "timeout" app.log', note: 'each match with 3 lines before and after' },
      { cmd: 'grep -v "healthcheck" access.log', note: 'drop noisy lines' },
      { cmd: 'grep -c "ERROR" app.log', note: 'how many lines match' },
    ],
  },
  {
    name: 'rg',
    category: 'Search',
    syntax: 'rg [-n] [-l] [--glob <pattern>] <pattern> [path]',
    description:
      'ripgrep: a much faster grep for code. Recursive by default, respects .gitignore, skips binaries. It is also what many AI coding agents use under the hood to search a repo.',
    tags: ['ripgrep', 'search code', 'fast grep', 'find in files', 'repo'],
    examples: [
      { cmd: 'rg "useState"', note: 'search the whole repo' },
      { cmd: "rg -n --glob '*.ts' \"TODO\"", note: 'only TypeScript files, with line numbers' },
      { cmd: 'rg -l "DATABASE_URL"', note: 'just the names of files that contain it' },
      { cmd: 'rg --files | rg "migration"', note: 'find files by name' },
    ],
  },
  {
    name: 'find',
    category: 'Search',
    syntax: 'find <path> [-name <glob>] [-type f|d] [-mtime +N] [-size +N]',
    description:
      'Find files by name, type, age or size. -delete and -exec act on every match, so run the same command without them first to see the list.',
    tags: ['files', 'old files', 'large files', 'disk', 'cleanup', 'locate'],
    examples: [
      { cmd: 'find . -name "*.md"', note: 'by name' },
      { cmd: 'find . -type f -size +100M', note: 'files larger than 100 MB (disk full? start here)' },
      { cmd: 'find /var/log -name "*.log" -mtime +7', note: 'not modified for 7+ days' },
      { cmd: 'find . -name "*.tmp" -delete', note: 'delete matches — list them first', risk: 'destructive' },
    ],
  },

  // ───────────────────────── Process & System ─────────────────────────
  {
    name: 'ps / kill',
    category: 'Process & System',
    syntax: 'ps aux | grep <name> | kill [-9] <pid> | pkill <name>',
    description:
      'List and stop processes. kill sends SIGTERM (graceful) by default; -9 is SIGKILL and gives the process no chance to clean up, so try plain kill first.',
    tags: ['process', 'stuck', 'hung', 'stop', 'terminate', 'pid'],
    examples: [
      { cmd: 'ps aux | grep node', note: 'find a process by name' },
      { cmd: 'kill 4821', note: 'ask process 4821 to exit cleanly', risk: 'changes' },
      { cmd: 'kill -9 4821', note: 'force-kill when it ignores SIGTERM', risk: 'destructive' },
      { cmd: 'pkill -f "node server.js"', note: 'kill by command line instead of pid', risk: 'changes' },
    ],
  },
  {
    name: 'lsof / ss',
    category: 'Process & System',
    syntax: 'lsof -i :<port> | ss -tulpn',
    description:
      'Answer "what is using this port?" lsof works on Linux and macOS. ss is the modern Linux replacement for netstat and lists listening sockets with their process (needs sudo to see other users\' processes).',
    tags: ['port', 'port in use', 'address already in use', 'listen', 'socket', 'netstat', 'EADDRINUSE'],
    examples: [
      { cmd: 'lsof -i :3000', note: 'which process holds port 3000 (Linux and macOS)' },
      { cmd: 'sudo ss -tulpn', note: 'all listening TCP/UDP ports and their processes (Linux)' },
      { cmd: 'sudo ss -tulpn | grep :443', note: 'is anything listening on 443?' },
    ],
  },
  {
    name: 'top / htop',
    category: 'Process & System',
    syntax: 'top | htop | free -h | uptime',
    description:
      'Live view of CPU and memory. Load average in uptime is the number of runnable processes over 1/5/15 minutes: compare it with the CPU count. free -h (Linux) shows memory; "available" is the number that matters, not "free".',
    tags: ['cpu', 'memory', 'ram', 'load', 'performance', 'slow server', 'resource usage'],
    examples: [
      { cmd: 'uptime', note: 'load average over 1, 5 and 15 minutes' },
      { cmd: 'top', note: 'live processes (press M to sort by memory, P by CPU, q to quit)' },
      { cmd: 'htop', note: 'friendlier top, if installed' },
      { cmd: 'free -h', note: 'memory and swap in human units (Linux)' },
    ],
  },
  {
    name: 'df / du',
    category: 'Process & System',
    syntax: 'df -h | du -sh <path>/* | sort -h',
    description:
      'Disk space. df shows free space per filesystem, du shows what is using it. The usual flow when a disk fills up: df to find the full volume, du to find the biggest directory, find -size to find the file.',
    tags: ['disk', 'disk full', 'no space left on device', 'storage', 'size', 'inode'],
    examples: [
      { cmd: 'df -h', note: 'usage per mounted filesystem' },
      { cmd: 'df -i', note: 'inode usage (a disk can be "full" with space left)' },
      { cmd: 'du -sh /var/* 2>/dev/null | sort -h', note: 'biggest directories last' },
    ],
  },
  {
    name: 'systemctl / journalctl',
    category: 'Process & System',
    syntax: 'systemctl <status|restart|enable> <unit> | journalctl -u <unit> [-f] [--since ...]',
    description:
      'Manage and debug services on systemd Linux. Check status and logs before restarting: restart drops connections and can hide the cause.',
    tags: ['service', 'daemon', 'logs', 'restart', 'linux', 'unit', 'boot'],
    examples: [
      { cmd: 'systemctl status nginx', note: 'state, recent log lines, and why it failed' },
      { cmd: 'journalctl -u nginx --since "1 hour ago"', note: 'logs of one service in a time window' },
      { cmd: 'journalctl -u myapp -f', note: 'follow a service log' },
      { cmd: 'systemctl --failed', note: 'list units that failed' },
      { cmd: 'sudo systemctl restart nginx', note: 'restart a service', risk: 'changes' },
    ],
  },
  {
    name: 'crontab / tmux',
    category: 'Process & System',
    syntax: 'crontab -l | crontab -e | tmux new -s <name> | nohup <cmd> &',
    description:
      'Scheduled and long-running jobs. A cron line is "minute hour day month weekday command". tmux keeps a shell alive after SSH disconnects and you can re-attach later; nohup is the lighter option for a single command.',
    tags: ['schedule', 'cron', 'background', 'long running', 'session', 'ssh disconnect', 'nohup'],
    examples: [
      { cmd: 'crontab -l', note: 'show the current user\'s schedule' },
      { cmd: '*/5 * * * * /opt/app/backup.sh >> /var/log/backup.log 2>&1', note: 'cron line: every 5 minutes, log output (add with crontab -e)', risk: 'changes' },
      { group: 'tmux', cmd: 'tmux new -s deploy', note: 'start a named session (detach with Ctrl+b then d)' },
      { group: 'tmux', cmd: 'tmux attach -t deploy', note: 'come back to it after reconnecting' },
      { group: 'nohup', cmd: 'nohup ./job.sh > job.log 2>&1 &', note: 'run in the background and survive the terminal closing' },
    ],
  },

  // ───────────────────────── Networking ─────────────────────────
  {
    name: 'curl',
    category: 'Networking',
    syntax: 'curl [-sS] [-X METHOD] [-H header] [-d data] [-o file] [-I] [-w format] <url>',
    description:
      'Call APIs and check endpoints. -I fetches headers only, -s hides the progress bar (-sS still prints errors), -w prints timing or status. Attach proof such as the status line when you tell someone a site is up.',
    tags: ['http', 'api', 'request', 'health check', 'status code', 'latency', 'download', 'headers'],
    examples: [
      { cmd: 'curl -I https://example.com', note: 'status line and headers only' },
      { cmd: 'curl -sS -o /dev/null -w "%{http_code} %{time_total}s\\n" https://example.com', note: 'status code and total time in one line' },
      { cmd: 'curl -sS https://api.example.com/health | jq .', note: 'GET and pretty-print JSON' },
      { cmd: 'curl -X POST -H "Content-Type: application/json" -d \'{"name":"demo"}\' https://api.example.com/users', note: 'send a JSON body', risk: 'changes' },
      { cmd: 'curl --retry 3 --max-time 10 https://example.com', note: 'retry and cap the wait — good for scripts' },
      { group: 'Auth', cmd: 'curl -H "Authorization: Bearer ${TOKEN}" https://api.example.com/me', note: 'bearer token from an env var (never type the token inline: it lands in shell history)' },
      { group: 'Auth', cmd: 'curl -u "${USER}:${PASS}" https://api.example.com/secure', note: 'HTTP Basic auth from env vars' },
    ],
  },
  {
    name: 'dig',
    category: 'Networking',
    syntax: 'dig [+short] [@<resolver>] <name> [A|AAAA|CNAME|MX|TXT|NS]',
    description:
      'Look up DNS. Compare your default resolver with a public one (@8.8.8.8 or @1.1.1.1) to tell a propagation delay from a wrong record.',
    tags: ['dns', 'domain', 'nslookup', 'cname', 'mx', 'txt', 'propagation', 'resolve'],
    examples: [
      { cmd: 'dig +short example.com', note: 'just the A record(s)' },
      { cmd: 'dig +short CNAME www.example.com', note: 'where an alias points' },
      { cmd: 'dig example.com MX +short', note: 'mail servers' },
      { cmd: 'dig @1.1.1.1 example.com +short', note: 'ask a specific resolver, bypassing local cache' },
      { cmd: 'dig +short TXT example.com', note: 'SPF, domain verification and similar records' },
    ],
  },
  {
    name: 'nc',
    category: 'Networking',
    syntax: 'nc -zv <host> <port>',
    description:
      'Check whether a TCP port is reachable (netcat). Replaces telnet for this purpose: telnet is often not installed and was never meant for it. "Connection refused" means nothing listens; a timeout usually means a firewall or security group.',
    tags: ['port check', 'connectivity', 'telnet', 'reachable', 'firewall', 'security group', 'timeout'],
    examples: [
      { cmd: 'nc -zv example.com 443', note: 'is port 443 open?' },
      { cmd: 'nc -zv db.internal 5432', note: 'can this host reach the database?' },
      { cmd: 'nc -zv -w 3 10.0.0.5 22', note: 'give up after 3 seconds' },
    ],
  },
  {
    name: 'ssh',
    category: 'Networking',
    syntax: 'ssh [-i <key>] [-L <local>:<host>:<remote>] <user>@<host>',
    description:
      'Remote shell and tunnels. Prefer ed25519 keys and put hosts in ~/.ssh/config so you can type "ssh prod-bastion". A -L tunnel lets a local tool reach a private database through a bastion without opening it to the internet.',
    tags: ['remote', 'login', 'key', 'tunnel', 'port forward', 'bastion', 'jump host', 'server'],
    examples: [
      { cmd: 'ssh user@203.0.113.10', note: 'log in to a server' },
      { cmd: 'ssh -i ~/.ssh/id_ed25519 user@host', note: 'use a specific key' },
      { cmd: 'ssh -L 5432:db.internal:5432 user@bastion', note: 'local port 5432 → private database via the bastion' },
      { cmd: 'ssh -J bastion user@10.0.0.5', note: 'jump through a bastion to a private host' },
      { cmd: 'ssh-keygen -t ed25519 -C "you@example.com"', note: 'generate a new key pair', risk: 'changes' },
    ],
  },
  {
    name: 'nmap',
    category: 'Networking',
    syntax: 'nmap [-p <ports>] <host>',
    description:
      'Scan a host for open ports and services — useful to audit what a server really exposes. Only scan hosts you own or are authorised to test.',
    tags: ['port scan', 'audit', 'exposed', 'open ports', 'security'],
    examples: [
      { cmd: 'nmap -p 22,80,443 example.com', note: 'check specific ports' },
      { cmd: 'nmap 192.168.1.1', note: 'scan the most common ports' },
    ],
  },

  // ───────────────────────── Git & CI ─────────────────────────
  {
    name: 'git',
    category: 'Git & CI',
    syntax: 'git <status|diff|add|commit|switch|log|stash|restore|rebase|reflog|worktree> [args]',
    description:
      'Version control. Read-only commands (status, diff, log) are always safe. Anything that rewrites history (reset --hard, rebase, push --force) can lose work: reflog is your safety net for recovering it.',
    tags: ['version control', 'commit', 'branch', 'undo', 'revert', 'history', 'merge', 'conflict'],
    examples: [
      { cmd: 'git status -sb', note: 'short status with the branch name' },
      { cmd: 'git diff --stat main...HEAD', note: 'what this branch changes compared to main' },
      { cmd: 'git log --oneline --graph --decorate -20', note: 'compact history with branches' },
      { cmd: 'git switch -c feature/login', note: 'create and switch to a new branch', risk: 'changes' },
      { cmd: 'git add -p && git commit -m "fix: handle empty input"', note: 'stage hunk by hunk, then commit', risk: 'changes' },
      { cmd: 'git stash push -m "wip" && git stash pop', note: 'shelve and restore uncommitted work', risk: 'changes' },
      { cmd: 'git restore --staged <file>', note: 'unstage a file without losing the edit', risk: 'changes' },
      { cmd: 'git reflog', note: 'every place HEAD has been — find "lost" commits here' },
      { cmd: 'git worktree add ../app-hotfix hotfix/123', note: 'second checkout of the same repo (parallel tasks, parallel agents)', risk: 'changes' },
      { cmd: 'git reset --hard HEAD~1', note: 'throw away the last commit and local edits', risk: 'destructive' },
      { cmd: 'git push --force-with-lease', note: 'safer force push: fails if someone else pushed', risk: 'destructive' },
    ],
  },
  {
    name: 'gh',
    category: 'Git & CI',
    syntax: 'gh <pr|run|issue|repo> <subcommand>',
    description:
      'GitHub CLI: open and review pull requests, and watch or debug GitHub Actions without leaving the terminal. gh run view --log-failed is the fastest way to see why a pipeline broke.',
    tags: ['github', 'pull request', 'pr', 'actions', 'workflow', 'ci', 'pipeline', 'failed build'],
    examples: [
      { cmd: 'gh pr status', note: 'your open PRs and their review/CI state' },
      { cmd: 'gh pr checks', note: 'CI results for the current branch\'s PR' },
      { cmd: 'gh run list --limit 5', note: 'latest workflow runs' },
      { cmd: 'gh run view --log-failed', note: 'logs of only the failed steps' },
      { cmd: 'gh run watch', note: 'follow a running workflow live' },
      { cmd: 'gh pr create --fill', note: 'open a PR using the commit messages', risk: 'changes' },
    ],
  },
  {
    name: 'npm / node',
    category: 'Git & CI',
    syntax: 'npm <ci|install|run|test|audit> | node [-e "<script>" | -v]',
    description:
      'Node.js tooling. Use npm ci in CI and for reproducible installs: it installs exactly the lockfile and never changes it. npm audit checks dependencies for known vulnerabilities; review a package before adding it. node -e is a quick scripting tool when no extra utility is installed.',
    tags: ['javascript', 'package', 'dependencies', 'build', 'lockfile', 'vulnerabilities', 'install'],
    examples: [
      { cmd: 'node -v && npm -v', note: 'confirm the toolchain version' },
      { cmd: 'npm ci', note: 'clean, lockfile-exact install (use this in CI)', risk: 'changes' },
      { cmd: 'npm run build', note: 'run the build script from package.json', risk: 'changes' },
      { cmd: 'npm audit --omit=dev', note: 'known vulnerabilities in production dependencies' },
      { cmd: 'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"', note: 'generate a random 32-byte key without OpenSSL' },
    ],
  },
  {
    name: 'nginx',
    category: 'Git & CI',
    syntax: 'nginx -t | nginx -s reload | nginx -T',
    description:
      'Reverse proxy and web server. Always test the config first (-t); reload applies it without dropping connections, while restart does drop them.',
    tags: ['web server', 'reverse proxy', 'config', 'reload', 'proxy', '502', '504'],
    examples: [
      { cmd: 'nginx -t', note: 'validate the config without applying it' },
      { cmd: 'nginx -T | grep server_name', note: 'dump the full effective config and search it' },
      { cmd: 'nginx -s reload', note: 'apply the new config with zero downtime', risk: 'changes' },
    ],
  },

  // ───────────────────────── Containers & K8s ─────────────────────────
  {
    name: 'docker',
    category: 'Containers & K8s',
    syntax: 'docker <ps|logs|exec|stats|build|run|compose|system> [args]',
    description:
      'Build and run containers. For debugging: ps to see state, logs to see why, exec to look inside, stats for resource use. "system prune" deletes unused data, so check what it will remove first.',
    tags: ['container', 'image', 'compose', 'logs', 'shell', 'build', 'registry', 'dockerfile'],
    examples: [
      { cmd: 'docker ps -a', note: 'all containers, including stopped ones' },
      { cmd: 'docker logs -f --tail 100 myapp', note: 'follow the last 100 log lines' },
      { cmd: 'docker exec -it myapp sh', note: 'shell inside a running container' },
      { cmd: 'docker stats --no-stream', note: 'one snapshot of CPU/memory per container' },
      { cmd: 'docker inspect myapp | jq ".[0].State"', note: 'state, exit code and OOM-killed flag' },
      { cmd: 'docker system df', note: 'how much disk images, containers and volumes use' },
      { cmd: 'docker build -t myapp:latest .', note: 'build an image from the Dockerfile here', risk: 'changes' },
      { cmd: 'docker run -d -p 3000:3000 --name myapp myapp:latest', note: 'run in the background and publish a port', risk: 'changes' },
      { cmd: 'docker compose up -d && docker compose logs -f api', note: 'start the stack, then follow one service', risk: 'changes' },
      { cmd: 'docker system prune', note: 'remove stopped containers, dangling images and unused networks', risk: 'destructive' },
    ],
  },
  {
    name: 'kubectl',
    category: 'Containers & K8s',
    syntax: 'kubectl <get|describe|logs|top|exec|port-forward|rollout|apply|delete> [-n <ns>] [args]',
    description:
      'Kubernetes CLI. Debug in this order: get (state) → describe (events) → logs (app errors; --previous after a crash). Check the context and namespace before any change: a wrong context is how people modify the wrong cluster.',
    tags: ['k8s', 'pod', 'crashloopbackoff', 'oomkilled', 'deployment', 'namespace', 'logs', 'cluster', 'rollout', 'pending'],
    examples: [
      { group: 'Context', cmd: 'kubectl config current-context', note: 'which cluster am I about to touch?' },
      { group: 'Context', cmd: 'kubectl config get-contexts', note: 'list contexts' },
      { group: 'Investigate', cmd: 'kubectl get pods -n <ns> -o wide', note: 'pods with node and IP' },
      { group: 'Investigate', cmd: 'kubectl describe pod <pod> -n <ns>', note: 'events: why Pending, why restarting, probe failures' },
      { group: 'Investigate', cmd: 'kubectl logs <pod> -n <ns> --since=1h --tail=200', note: 'recent logs only' },
      { group: 'Investigate', cmd: 'kubectl logs <pod> -n <ns> --previous', note: 'logs of the container that just crashed' },
      { group: 'Investigate', cmd: 'kubectl get events -n <ns> --sort-by=.lastTimestamp', note: 'what happened recently in the namespace' },
      { group: 'Investigate', cmd: 'kubectl top pods -n <ns>', note: 'CPU/memory per pod (needs metrics-server)' },
      { group: 'Investigate', cmd: 'kubectl auth can-i delete pods -n <ns>', note: 'check permissions before trying' },
      { group: 'Access', cmd: 'kubectl port-forward svc/<service> 8080:80 -n <ns>', note: 'reach a service locally without exposing it' },
      { group: 'Access', cmd: 'kubectl exec -it <pod> -n <ns> -- sh', note: 'shell inside a pod' },
      { group: 'Change', cmd: 'kubectl diff -f deployment.yaml', note: 'preview a change against the live cluster' },
      { group: 'Change', cmd: 'kubectl apply -f deployment.yaml --dry-run=server', note: 'validate with the API server, change nothing' },
      { group: 'Change', cmd: 'kubectl apply -f deployment.yaml', note: 'create or update resources', risk: 'changes' },
      { group: 'Change', cmd: 'kubectl rollout restart deployment/<name> -n <ns>', note: 'rolling restart', risk: 'changes' },
      { group: 'Change', cmd: 'kubectl rollout undo deployment/<name> -n <ns>', note: 'roll back to the previous revision', risk: 'changes' },
      { group: 'Change', cmd: 'kubectl delete pod <pod> -n <ns>', note: 'delete a pod (its Deployment recreates it)', risk: 'destructive' },
    ],
  },
  {
    name: 'helm',
    category: 'Containers & K8s',
    syntax: 'helm <list|template|diff upgrade|upgrade --install|rollback|uninstall> [args]',
    description:
      'Kubernetes package manager. Render and diff before you upgrade: "helm template" shows the YAML, and the helm-diff plugin shows what would change in the cluster. --atomic rolls back automatically if the upgrade fails.',
    tags: ['chart', 'release', 'values', 'kubernetes', 'deploy', 'upgrade', 'rollback'],
    examples: [
      { cmd: 'helm list -A', note: 'releases in all namespaces' },
      { cmd: 'helm get values <release> -n <ns>', note: 'values the release was deployed with' },
      { cmd: 'helm template <release> ./chart -f values.yaml', note: 'render the manifests locally' },
      { cmd: 'helm diff upgrade <release> ./chart -f values.yaml -n <ns>', note: 'preview the change (needs the helm-diff plugin)' },
      { cmd: 'helm upgrade --install <release> ./chart -f values.yaml -n <ns> --atomic', note: 'deploy; auto-rollback on failure', risk: 'changes' },
      { cmd: 'helm rollback <release> <revision> -n <ns>', note: 'go back to an earlier revision', risk: 'changes' },
      { cmd: 'helm uninstall <release> -n <ns>', note: 'remove the release and its resources', risk: 'destructive' },
    ],
  },
  {
    name: 'k9s',
    category: 'Containers & K8s',
    syntax: 'k9s [-n <ns>]',
    description:
      'Terminal UI for Kubernetes: browse, filter, tail logs and open shells with the keyboard instead of typing a new kubectl command per lookup.',
    tags: ['k8s', 'dashboard', 'tui', 'kubernetes ui'],
    examples: [
      { cmd: 'k9s', note: 'start on the pods view' },
      { cmd: ':deploy  /  :svc  /  :ns', note: 'switch to Deployments, Services or Namespaces' },
      { cmd: '/<text>', note: 'filter the current list' },
      { cmd: 'd  /  l  /  s', note: 'describe, logs, or shell for the selected resource' },
      { cmd: 'Esc  /  q', note: 'go back / quit' },
    ],
  },

  // ───────────────────────── Cloud & IaC ─────────────────────────
  {
    name: 'aws',
    category: 'Cloud & IaC',
    syntax: 'aws [--profile <name>] <sts|s3|ec2|ecs|eks|logs|cloudformation|ssm|ce> <subcommand>',
    description:
      'AWS CLI. Start every session with sts get-caller-identity to confirm the account and role. Prefer SSO / roles to long-lived access keys. Reading a secret or SSM parameter with decryption prints it to the terminal: keep it out of chats, tickets and logs.',
    tags: ['amazon', 'cloud', 's3', 'ec2', 'ecs', 'eks', 'cloudwatch', 'sso', 'credentials', 'billing', 'cost'],
    examples: [
      { cmd: 'aws sso login --profile <name>', note: 'sign in with SSO (temporary credentials)' },
      { cmd: 'aws sts get-caller-identity', note: 'which account / role am I using?' },
      { cmd: 'aws s3 ls s3://my-bucket/ --recursive --human-readable --summarize', note: 'list objects with total size' },
      { cmd: 'aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId,State.Name,Tags[?Key==\'Name\']|[0].Value]" --output table', note: 'instance id, state and name tag as a table' },
      { cmd: 'aws logs tail /ecs/my-service --follow --since 30m', note: 'stream CloudWatch Logs' },
      { cmd: 'aws cloudformation describe-stack-events --stack-name my-stack --max-items 20', note: 'why a stack update failed' },
      { cmd: 'aws eks update-kubeconfig --name my-cluster --region <region>', note: 'add the cluster to ~/.kube/config', risk: 'changes' },
      { cmd: 'aws s3 sync ./dist s3://my-bucket/app/ --dryrun', note: 'preview a deploy; drop --dryrun to run it' },
      { cmd: 'aws ecs update-service --cluster <c> --service <s> --force-new-deployment', note: 'roll a service to pick up a new image', risk: 'changes' },
      { cmd: 'aws ce get-cost-and-usage --time-period Start=2026-10-01,End=2026-10-31 --granularity MONTHLY --metrics UnblendedCost', note: 'month spend without opening the console' },
    ],
  },
  {
    name: 'terraform',
    category: 'Cloud & IaC',
    syntax: 'terraform <fmt|validate|plan|show|state list|apply|destroy>',
    description:
      'Infrastructure as code. The safe loop is fmt → validate → plan; read the plan (especially anything marked "destroy" or "replace") before anyone runs apply. Save the plan with -out and apply that exact file so nothing changes between review and apply.',
    tags: ['iac', 'infrastructure', 'plan', 'apply', 'state', 'hcl', 'provision'],
    examples: [
      { cmd: 'terraform fmt -recursive', note: 'format the code', risk: 'changes' },
      { cmd: 'terraform validate', note: 'check syntax and internal consistency' },
      { cmd: 'terraform plan -out=tfplan', note: 'compute the changes and save them; changes nothing' },
      { cmd: 'terraform show tfplan', note: 'read the saved plan before approving' },
      { cmd: 'terraform state list', note: 'resources Terraform manages' },
      { cmd: 'terraform apply tfplan', note: 'apply exactly the reviewed plan', risk: 'destructive' },
      { cmd: 'terraform destroy', note: 'delete everything in this configuration', risk: 'destructive' },
    ],
  },

  // ───────────────────────── Databases ─────────────────────────
  {
    name: 'psql',
    category: 'Databases',
    syntax: 'psql "$DATABASE_URL" [-c "<sql>"] | pg_dump -Fc | pg_restore',
    description:
      'PostgreSQL client. Keep the connection string in an env var (it contains the password). For investigation start a read-only session. EXPLAIN ANALYZE really executes the query, so use it on SELECTs only.',
    tags: ['postgres', 'postgresql', 'sql', 'query', 'backup', 'dump', 'locks', 'slow query', 'explain'],
    examples: [
      { cmd: "PGOPTIONS='-c default_transaction_read_only=on' psql \"$DATABASE_URL\"", note: 'interactive session that rejects writes' },
      { cmd: 'psql "$DATABASE_URL" -c "\\l"', note: 'list databases' },
      { cmd: 'psql "$DATABASE_URL" -c "\\dt"', note: 'list tables' },
      { cmd: 'psql "$DATABASE_URL" -c "\\d+ orders"', note: 'columns, indexes and constraints of a table' },
      { cmd: 'psql "$DATABASE_URL" -c "SELECT pid, now()-xact_start AS age, state, left(query,80) FROM pg_stat_activity WHERE state <> \'idle\' ORDER BY age DESC LIMIT 10;"', note: 'long-running transactions (check before any migration)' },
      { cmd: 'psql "$DATABASE_URL" -c "EXPLAIN (ANALYZE, BUFFERS) SELECT ..."', note: 'real execution plan of a SELECT' },
      { cmd: 'pg_dump -Fc -f backup.dump "$DATABASE_URL"', note: 'compressed logical backup' },
      { cmd: 'pg_restore --list backup.dump | head', note: 'check a backup is readable without restoring it' },
      { group: 'In Docker', cmd: 'docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" <container> psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "\\dt"', note: 'same, against a container' },
    ],
  },
  {
    name: 'redis-cli',
    category: 'Databases',
    syntax: 'redis-cli -u "$REDIS_URL" <command>',
    description:
      'Redis client. Use --scan instead of KEYS on a live instance: KEYS blocks the server while it walks every key.',
    tags: ['redis', 'cache', 'keys', 'ttl', 'memory', 'queue'],
    examples: [
      { cmd: 'redis-cli -u "$REDIS_URL" ping', note: 'connectivity check → PONG' },
      { cmd: "redis-cli -u \"$REDIS_URL\" --scan --pattern 'user:*' | head", note: 'find keys without blocking the server' },
      { cmd: 'redis-cli -u "$REDIS_URL" ttl <key>', note: 'seconds left (-1 no expiry, -2 missing)' },
      { cmd: 'redis-cli -u "$REDIS_URL" info memory | head -n 12', note: 'memory usage' },
      { cmd: 'redis-cli -u "$REDIS_URL" del <key>', note: 'delete one key', risk: 'destructive' },
    ],
  },
  {
    name: 'mongosh / mysql',
    category: 'Databases',
    syntax: 'mongosh "$MONGODB_URI" --eval "<js>" | mysql -u <user> -p -e "<sql>"',
    description:
      'MongoDB and MySQL clients. Connection details come from env vars. For MySQL, let -p prompt for the password: a password typed after -p is visible in the process list and shell history.',
    tags: ['mongodb', 'mysql', 'mariadb', 'collections', 'tables', 'databases', 'docker'],
    examples: [
      { group: 'MongoDB', cmd: 'mongosh "$MONGODB_URI" --eval "db.getCollectionNames()"', note: 'list collections' },
      { group: 'MongoDB', cmd: 'mongosh "$MONGODB_URI" --eval "db.<collection>.countDocuments()"', note: 'document count' },
      { group: 'MySQL', cmd: 'mysql -u"$MYSQL_USER" -p -e "SHOW DATABASES;"', note: 'list databases (prompts for the password)' },
      { group: 'MySQL', cmd: 'mysql -u"$MYSQL_USER" -p -e "SHOW TABLES IN <db>;"', note: 'list tables' },
      { group: 'In Docker', cmd: 'docker exec -it <container> mysql -u"$MYSQL_USER" -p', note: 'interactive MySQL inside a container' },
    ],
  },

  // ───────────────────────── Security ─────────────────────────
  {
    name: 'openssl',
    category: 'Security',
    syntax: 'openssl <rand|dgst|x509|s_client|genrsa|req> [args]',
    description:
      'Crypto Swiss-army knife. Day to day: generate a random secret, hash a file, and check when a server certificate expires.',
    tags: ['certificate', 'ssl', 'tls', 'cert expiry', 'random', 'password generator', 'hash', 'sha256', 'key'],
    examples: [
      { cmd: 'openssl rand -base64 32', note: 'random 32-byte secret, base64' },
      { cmd: 'openssl rand -hex 16', note: 'random 16-byte value as hex' },
      { cmd: 'openssl dgst -sha256 file.txt', note: 'SHA-256 of a file (verify downloads)' },
      { cmd: 'openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates -subject', note: 'subject and expiry of a live site certificate' },
      { cmd: 'openssl x509 -in cert.pem -noout -dates', note: 'expiry of a local certificate file' },
      { cmd: 'openssl genrsa -out key.pem 2048', note: 'new RSA private key (keep it out of Git)', risk: 'changes' },
    ],
  },
  {
    name: 'trivy / gitleaks',
    category: 'Security',
    syntax: 'trivy <image|fs|config> <target> | gitleaks detect --source <path>',
    description:
      'Scan before you ship. trivy finds vulnerable packages in images and dependencies and misconfigurations in Dockerfiles, Kubernetes and Terraform. gitleaks finds secrets committed to Git. Run both locally and in CI; if a secret was ever committed, rotate it.',
    tags: ['vulnerability', 'cve', 'scan', 'secrets', 'leak', 'container security', 'sast', 'sca', 'iac scan'],
    examples: [
      { cmd: 'trivy image --severity HIGH,CRITICAL myapp:latest', note: 'serious vulnerabilities in an image' },
      { cmd: 'trivy fs .', note: 'scan dependencies in the current project' },
      { cmd: 'trivy config .', note: 'misconfigurations in Dockerfile / K8s / Terraform' },
      { cmd: 'gitleaks detect --source . --no-banner', note: 'look for secrets in the repo and its history' },
    ],
  },
  {
    name: 'sudo',
    category: 'Security',
    syntax: 'sudo <command> | sudo -u <user> <command> | sudo su - <user>',
    description:
      'Run something with elevated rights. Prefer a single "sudo <command>" over a root shell. "su -" starts a clean login shell as another user (their HOME and environment); exit returns to yours.',
    tags: ['root', 'admin', 'privilege', 'su', 'switch user', 'permission denied'],
    examples: [
      { cmd: 'sudo -l', note: 'what am I allowed to run with sudo?' },
      { cmd: 'sudo -u postgres psql', note: 'run one command as another user' },
      { cmd: 'sudo su - appuser', note: 'login shell as appuser (exit to return)', risk: 'changes' },
    ],
  },
];

import React, { useEffect, useRef, useState } from 'react';
import { FAKE_DEPLOYMENTS, FAKE_NAMESPACES, FAKE_PODS, FAKE_SERVICES } from './k8sFixtures';

type ViewKind = 'pods' | 'deployments' | 'services' | 'namespaces';
type Mode = 'list' | 'detail' | 'logs' | 'command';

const VIEW_ALIASES: Record<string, ViewKind> = {
  po: 'pods',
  pod: 'pods',
  pods: 'pods',
  deploy: 'deployments',
  deployment: 'deployments',
  deployments: 'deployments',
  svc: 'services',
  service: 'services',
  services: 'services',
  ns: 'namespaces',
  namespace: 'namespaces',
  namespaces: 'namespaces',
};

const COLUMNS: Record<ViewKind, string[]> = {
  pods: ['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'],
  deployments: ['NAME', 'READY', 'UP-TO-DATE', 'AVAILABLE', 'AGE'],
  services: ['NAME', 'TYPE', 'CLUSTER-IP', 'EXTERNAL-IP', 'PORT(S)', 'AGE'],
  namespaces: ['NAME', 'STATUS', 'AGE'],
};

function rowsFor(view: ViewKind): string[][] {
  if (view === 'pods') return FAKE_PODS.map((p) => [p.name, p.ready, p.status, p.restarts, p.age]);
  if (view === 'deployments') return FAKE_DEPLOYMENTS.map((d) => [d.name, d.ready, d.upToDate, d.available, d.age]);
  if (view === 'services') return FAKE_SERVICES.map((s) => [s.name, s.type, s.clusterIp, s.externalIp, s.ports, s.age]);
  return FAKE_NAMESPACES.map((n) => [n.name, n.status, n.age]);
}

function widths(view: ViewKind): number[] {
  const rows = [COLUMNS[view], ...rowsFor(view)];
  return COLUMNS[view].map((_, col) => Math.max(...rows.map((r) => r[col].length)) + 2);
}

interface K9sViewProps {
  onExit: () => void;
}

export const K9sView: React.FC<K9sViewProps> = ({ onExit }) => {
  const [view, setView] = useState<ViewKind>('pods');
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<Mode>('list');
  const [commandBuffer, setCommandBuffer] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const rows = rowsFor(view);
  const colWidths = widths(view);
  const selectedRow = rows[selected];

  const detailLines = (): string[] => {
    if (!selectedRow) return ['(no resource selected)'];
    const name = selectedRow[0];
    if (view === 'pods') {
      const pod = FAKE_PODS.find((p) => p.name === name);
      return [
        `Name:      ${name}`,
        `Status:    ${pod?.status}`,
        `Node:      node-1/10.0.1.5`,
        `Restarts:  ${pod?.restarts}`,
        `Age:       ${pod?.age}`,
        '',
        'Containers:',
        `  ${name}:`,
        `    Image: registry.example.com/${name.split('-')[0]}:latest`,
        `    State: ${pod?.status === 'CrashLoopBackOff' ? 'Waiting - CrashLoopBackOff' : 'Running'}`,
        '',
        '(simulated — press Esc/q to go back)',
      ];
    }
    return [`Name: ${name}`, ...COLUMNS[view].slice(1).map((h, i) => `${h}: ${selectedRow[i + 1]}`), '', '(simulated — press Esc/q to go back)'];
  };

  const logLines = (): string[] => {
    const name = selectedRow?.[0] ?? 'unknown';
    const pod = FAKE_PODS.find((p) => p.name === name);
    if (pod?.status === 'CrashLoopBackOff') {
      return ['Starting server...', 'Error: connect ECONNREFUSED 127.0.0.1:5432', 'Exiting with code 1', '', '(simulated — press Esc/q to go back)'];
    }
    return ['server listening on port 8080', 'GET /health 200 2ms', 'GET /api/users 200 14ms', '', '(simulated — press Esc/q to go back)'];
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (mode === 'command') {
      if (e.key === 'Enter') {
        const alias = VIEW_ALIASES[commandBuffer.trim()];
        if (alias) {
          setView(alias);
          setSelected(0);
          setStatusMsg('');
        } else {
          setStatusMsg(`unknown resource ":${commandBuffer}" — try pod, deploy, svc, or ns`);
        }
        setCommandBuffer('');
        setMode('list');
      } else if (e.key === 'Escape') {
        setCommandBuffer('');
        setMode('list');
      } else if (e.key === 'Backspace') {
        setCommandBuffer((b) => b.slice(0, -1));
      } else if (e.key.length === 1) {
        setCommandBuffer((b) => b + e.key);
      }
      return;
    }

    if (mode === 'detail' || mode === 'logs') {
      if (e.key === 'Escape' || e.key === 'q') setMode('list');
      return;
    }

    // list mode
    if (e.key === 'q' || e.key === 'Escape') {
      onExit();
      return;
    }
    if (e.key === 'j' || e.key === 'ArrowDown') {
      setSelected((s) => Math.min(rows.length - 1, s + 1));
      return;
    }
    if (e.key === 'k' || e.key === 'ArrowUp') {
      setSelected((s) => Math.max(0, s - 1));
      return;
    }
    if (e.key === ':') {
      setMode('command');
      setCommandBuffer('');
      return;
    }
    if (e.key === 'd') {
      setMode('detail');
      return;
    }
    if (e.key === 'l' && view === 'pods') {
      setMode('logs');
      return;
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="absolute inset-0 bg-black text-neutral-100 font-mono text-sm flex flex-col outline-none z-10"
    >
      <div className="px-3 py-1 border-b border-green-500/20 text-neutral-500 text-xs flex justify-between">
        <span>Context: docker-desktop  Namespace: default  View: {view} (simulated k9s)</span>
        <span>? for help</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {mode === 'list' && (
          <>
            <div className="text-green-400">{COLUMNS[view].map((h, i) => h.padEnd(colWidths[i])).join('')}</div>
            {rows.map((row, i) => (
              <div key={i} className={i === selected ? 'bg-green-400 text-black' : 'text-neutral-100'}>
                {row.map((c, ci) => c.padEnd(colWidths[ci])).join('')}
              </div>
            ))}
            {rows.length === 0 && <div className="text-neutral-500">No resources found.</div>}
          </>
        )}
        {mode === 'detail' && detailLines().map((l, i) => <div key={i}>{l}</div>)}
        {mode === 'logs' && logLines().map((l, i) => <div key={i}>{l}</div>)}
      </div>

      <div className="border-t border-green-500/20 px-3 py-1 flex justify-between text-neutral-400 text-xs">
        <span>
          {mode === 'command' ? `:${commandBuffer}` : statusMsg}
        </span>
        <span>
          {mode === 'list'
            ? '↑/↓ or j/k: select   d: describe   l: logs (pods)   ::view (pod|deploy|svc|ns)   q: quit'
            : 'esc/q: back to list'}
        </span>
      </div>
    </div>
  );
};

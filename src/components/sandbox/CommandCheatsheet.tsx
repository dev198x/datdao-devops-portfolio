import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { linuxCommandCategories, linuxCommands, type CommandRisk } from '../../data/linuxCommands';

const RISK_STYLE: Record<CommandRisk, { label: string; className: string }> = {
  changes: { label: 'changes state', className: 'text-yellow-400 border-yellow-500/40' },
  destructive: { label: 'destructive', className: 'text-red-400 border-red-500/40' },
};

export const CommandCheatsheet: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return linuxCommands.filter((c) => {
      const matchesCategory = category === 'All' || c.category === category;
      const matchesSearch =
        !q ||
        [c.name, c.description, ...(c.tags ?? []), ...c.examples.flatMap((e) => [e.cmd, e.note])]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by command or task (e.g. port in use, disk full, rollback, ai)..."
            className="w-full bg-bg-surface border border-neutral-700 rounded-lg pl-10 pr-3 py-2 text-sm font-mono text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-bg-surface border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-neutral-200 focus:outline-none focus:border-primary-500"
        >
          {linuxCommandCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-neutral-500 font-mono">
        Examples with no badge are read-only (safe to hand to an AI agent).{' '}
        <span className="text-yellow-400">changes state</span> and{' '}
        <span className="text-red-400">destructive</span> ones deserve a human look first.
        Replace &lt;placeholders&gt; and never paste real secrets.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((c) => (
          <div
            key={c.name}
            className="border border-neutral-700 rounded-lg p-4 bg-bg-surface hover:border-primary-500/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-primary-500 font-bold">{c.name}</span>
              <span className="text-xs text-neutral-500 border border-neutral-700 rounded px-2 py-0.5">
                {c.category}
              </span>
            </div>
            <code className="block text-xs text-neutral-400 font-mono mb-2">{c.syntax}</code>
            <p className="text-sm text-neutral-300 mb-2">{c.description}</p>
            <div className="space-y-1">
              {c.examples.map((ex, i) => {
                const showGroup = ex.group && ex.group !== c.examples[i - 1]?.group;
                return (
                  <React.Fragment key={i}>
                    {showGroup && (
                      <div className="text-[11px] uppercase tracking-wide text-primary-500/80 font-mono pt-2 first:pt-0">
                        {ex.group}
                      </div>
                    )}
                    <div className="text-xs font-mono rounded px-2 py-1 whitespace-pre-wrap">
                      <span className="text-green-400">$ {ex.cmd}</span>
                      <span className="text-neutral-500"> — {ex.note}</span>
                      {ex.risk && (
                        <span
                          className={`ml-2 text-[10px] uppercase border rounded px-1 py-0.5 align-middle ${RISK_STYLE[ex.risk].className}`}
                        >
                          {RISK_STYLE[ex.risk].label}
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-neutral-500 text-sm col-span-2">No commands match your search.</p>
        )}
      </div>
    </div>
  );
};

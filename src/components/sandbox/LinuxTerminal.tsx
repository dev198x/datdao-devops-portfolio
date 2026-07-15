import React, { useEffect, useRef, useState } from 'react';
import { runCommand } from './commands';
import { createInitialFs, formatPath, HOME_SEGMENTS, FSDir, cloneFs, getParent, basename } from './virtualFs';
import { VimEditor } from './VimEditor';
import { K9sView } from './K9sView';

interface Line {
  type: 'input' | 'output';
  text: string;
}

const WELCOME = [
  "You're in a live simulated Linux filesystem — nothing you type here touches your real machine.",
  'Type "help" for a command list, or "man <command>" for details. Try: ls, cd projects, cat README.md',
];

export const LinuxTerminal: React.FC = () => {
  const [fs, setFs] = useState<FSDir>(() => createInitialFs());
  const [cwd, setCwd] = useState<string[]>(HOME_SEGMENTS);
  const [lines, setLines] = useState<Line[]>(WELCOME.map((text) => ({ type: 'output', text })));
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ fileSegs: string[]; filename: string; content: string } | null>(null);
  const [k9sOpen, setK9sOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  const prompt = `user@sandbox:${formatPath(cwd)}$`;

  const submit = (raw: string) => {
    const trimmed = raw.trim();
    const promptLine: Line = { type: 'input', text: `${prompt} ${raw}` };

    if (!trimmed) {
      setLines((prev) => [...prev, promptLine]);
      return;
    }

    if (trimmed === 'reset') {
      setFs(createInitialFs());
      setCwd(HOME_SEGMENTS);
      setLines([{ type: 'output', text: 'Sandbox reset.' }]);
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(null);
      return;
    }

    const result = runCommand(trimmed, fs, cwd, history);
    setFs(result.fs);
    setCwd(result.cwd);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    if (result.clear) {
      setLines([]);
      return;
    }

    setLines((prev) => [
      ...prev,
      promptLine,
      ...result.output.map((text) => ({ type: 'output' as const, text })),
    ]);

    if (result.openEditor) {
      setEditing(result.openEditor);
    }
    if (result.openK9s) {
      setK9sOpen(true);
    }
  };

  const onEditorExit = (finalContent: string, saved: boolean) => {
    if (!editing) return;
    if (saved) {
      setFs((prevFs) => {
        const next = cloneFs(prevFs);
        const parent = getParent(next, editing.fileSegs);
        if (parent) {
          parent.children[basename(editing.fileSegs)] = { type: 'file', content: finalContent, mode: '-rw-r--r--' };
        }
        return next;
      });
    }
    setLines((prev) => [
      ...prev,
      { type: 'output', text: saved ? `"${editing.filename}" written` : `"${editing.filename}" — no changes written` },
    ]);
    setEditing(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    }
  };

  return (
    <div
      className="bg-black/90 border border-green-500/30 rounded-lg overflow-hidden font-mono text-sm shadow-lg shadow-green-500/5"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/20 bg-black/60">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-neutral-600 text-xs">linux-sandbox</span>
      </div>

      <div className="relative h-96 overflow-y-auto px-4 py-3 space-y-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className={line.type === 'input' ? 'text-green-400' : 'text-neutral-100 whitespace-pre-wrap'}
          >
            {line.text}
          </div>
        ))}
        <div className="flex items-center gap-2 text-green-400">
          <span className="shrink-0">{prompt}</span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            disabled={!!editing || k9sOpen}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400 disabled:opacity-0"
          />
        </div>
        <div ref={bottomRef} />

        {editing && (
          <VimEditor
            filename={editing.filename}
            initialContent={editing.content}
            onExit={(finalContent, saved) => {
              onEditorExit(finalContent, saved);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          />
        )}

        {k9sOpen && (
          <K9sView
            onExit={() => {
              setK9sOpen(false);
              setLines((prev) => [...prev, { type: 'output', text: '(k9s exited)' }]);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          />
        )}
      </div>
    </div>
  );
};

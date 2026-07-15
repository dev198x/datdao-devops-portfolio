import React, { useEffect, useRef, useState } from 'react';

type Mode = 'normal' | 'insert' | 'command';

interface VimEditorProps {
  filename: string;
  initialContent: string;
  onExit: (finalContent: string, saved: boolean) => void;
}

export const VimEditor: React.FC<VimEditorProps> = ({ filename, initialContent, onExit }) => {
  const [lines, setLines] = useState<string[]>(initialContent === '' ? [''] : initialContent.split('\n'));
  const [mode, setMode] = useState<Mode>('normal');
  const [cursor, setCursor] = useState({ row: 0, col: 0 });
  const [commandBuffer, setCommandBuffer] = useState('');
  const [dirty, setDirty] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const clipboard = useRef<string | null>(null);
  const pendingKey = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const clampCol = (row: number, col: number) => Math.max(0, Math.min(col, lines[row].length));

  const executeCommand = (raw: string) => {
    const content = lines.join('\n');
    if (raw === 'w') {
      onExit(content, true);
      setStatusMsg(`"${filename}" written`);
      setMode('normal');
      setDirty(false);
      return;
    }
    if (raw === 'q') {
      if (dirty) {
        setStatusMsg('E37: No write since last change (add ! to override)');
        setMode('normal');
        return;
      }
      onExit(content, false);
      return;
    }
    if (raw === 'q!') {
      onExit(content, false);
      return;
    }
    if (raw === 'wq' || raw === 'x') {
      onExit(content, true);
      return;
    }
    setStatusMsg(`E492: Not an editor command: ${raw}`);
    setMode('normal');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStatusMsg('');

    if (mode === 'command') {
      if (e.key === 'Enter') {
        const cmdText = commandBuffer;
        setCommandBuffer('');
        executeCommand(cmdText);
      } else if (e.key === 'Escape') {
        setCommandBuffer('');
        setMode('normal');
      } else if (e.key === 'Backspace') {
        setCommandBuffer((b) => b.slice(0, -1));
      } else if (e.key.length === 1) {
        setCommandBuffer((b) => b + e.key);
      }
      return;
    }

    if (mode === 'insert') {
      if (e.key === 'Escape') {
        setMode('normal');
        setCursor((c) => ({ row: c.row, col: Math.max(0, c.col - 1) }));
        return;
      }
      if (e.key === 'Enter') {
        setLines((ls) => {
          const next = [...ls];
          const line = next[cursor.row];
          next[cursor.row] = line.slice(0, cursor.col);
          next.splice(cursor.row + 1, 0, line.slice(cursor.col));
          return next;
        });
        setCursor({ row: cursor.row + 1, col: 0 });
        setDirty(true);
        return;
      }
      if (e.key === 'Backspace') {
        setLines((ls) => {
          const next = [...ls];
          if (cursor.col > 0) {
            next[cursor.row] = next[cursor.row].slice(0, cursor.col - 1) + next[cursor.row].slice(cursor.col);
            setCursor((c) => ({ row: c.row, col: c.col - 1 }));
          } else if (cursor.row > 0) {
            const prevLen = next[cursor.row - 1].length;
            next[cursor.row - 1] += next[cursor.row];
            next.splice(cursor.row, 1);
            setCursor({ row: cursor.row - 1, col: prevLen });
          }
          return next;
        });
        setDirty(true);
        return;
      }
      if (e.key.length === 1) {
        setLines((ls) => {
          const next = [...ls];
          next[cursor.row] = next[cursor.row].slice(0, cursor.col) + e.key + next[cursor.row].slice(cursor.col);
          return next;
        });
        setCursor((c) => ({ row: c.row, col: c.col + 1 }));
        setDirty(true);
      }
      return;
    }

    // normal mode
    if (e.key === 'i') {
      setMode('insert');
      return;
    }
    if (e.key === 'a') {
      setMode('insert');
      setCursor((c) => ({ row: c.row, col: clampCol(c.row, c.col + 1) }));
      return;
    }
    if (e.key === ':') {
      setMode('command');
      setCommandBuffer('');
      return;
    }
    if (e.key === 'Escape') {
      pendingKey.current = null;
      return;
    }
    if (e.key === 'h' || e.key === 'ArrowLeft') {
      setCursor((c) => ({ row: c.row, col: Math.max(0, c.col - 1) }));
      return;
    }
    if (e.key === 'l' || e.key === 'ArrowRight') {
      setCursor((c) => ({ row: c.row, col: clampCol(c.row, c.col + 1) }));
      return;
    }
    if (e.key === 'k' || e.key === 'ArrowUp') {
      setCursor((c) => {
        const row = Math.max(0, c.row - 1);
        return { row, col: clampCol(row, c.col) };
      });
      return;
    }
    if (e.key === 'j' || e.key === 'ArrowDown') {
      setCursor((c) => {
        const row = Math.min(lines.length - 1, c.row + 1);
        return { row, col: clampCol(row, c.col) };
      });
      return;
    }
    if (e.key === 'x') {
      setLines((ls) => {
        const next = [...ls];
        next[cursor.row] = next[cursor.row].slice(0, cursor.col) + next[cursor.row].slice(cursor.col + 1);
        return next;
      });
      setDirty(true);
      return;
    }
    if (e.key === '0') {
      setCursor((c) => ({ row: c.row, col: 0 }));
      return;
    }
    if (e.key === '$') {
      setCursor((c) => ({ row: c.row, col: Math.max(0, lines[c.row].length - 1) }));
      return;
    }
    if (e.key === 'd') {
      if (pendingKey.current === 'd') {
        pendingKey.current = null;
        clipboard.current = lines[cursor.row];
        const newLength = lines.length > 1 ? lines.length - 1 : 1;
        setLines((ls) => {
          const next = ls.filter((_, i) => i !== cursor.row);
          return next.length ? next : [''];
        });
        setCursor((c) => ({ row: Math.min(c.row, newLength - 1), col: 0 }));
        setDirty(true);
      } else {
        pendingKey.current = 'd';
      }
      return;
    }
    if (e.key === 'y') {
      if (pendingKey.current === 'y') {
        pendingKey.current = null;
        clipboard.current = lines[cursor.row];
        setStatusMsg('1 line yanked');
      } else {
        pendingKey.current = 'y';
      }
      return;
    }
    if (e.key === 'p') {
      if (clipboard.current !== null) {
        setLines((ls) => {
          const next = [...ls];
          next.splice(cursor.row + 1, 0, clipboard.current as string);
          return next;
        });
        setCursor((c) => ({ row: c.row + 1, col: 0 }));
        setDirty(true);
      }
      return;
    }
    pendingKey.current = null;
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="absolute inset-0 bg-black text-neutral-100 font-mono text-sm flex flex-col outline-none z-10"
    >
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {lines.map((line, row) => (
          <div key={row} className="whitespace-pre">
            {line.split('').map((ch, col) => (
              <span
                key={col}
                className={row === cursor.row && col === cursor.col ? 'bg-green-400 text-black' : ''}
              >
                {ch}
              </span>
            ))}
            {row === cursor.row && cursor.col >= line.length && (
              <span className="bg-green-400 text-black">&nbsp;</span>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-green-500/20 px-3 py-1 flex justify-between text-neutral-400 text-xs">
        <span>
          {mode === 'command' ? `:${commandBuffer}` : statusMsg || `"${filename}"${dirty ? ' [Modified]' : ''}`}
        </span>
        <span>
          {mode === 'insert' ? '-- INSERT --' : mode === 'command' ? '' : '-- NORMAL --'} {cursor.row + 1},{cursor.col + 1}
        </span>
      </div>
    </div>
  );
};

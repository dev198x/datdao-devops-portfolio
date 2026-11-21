import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const PLACEHOLDER = '--:--:--';

/**
 * Live clock showing the visitor's own device time (this is a static site, there is no server clock).
 * Renders a placeholder first so the prerendered HTML and the first client render match and the
 * layout does not shift. Ticks once per second and pauses while the tab is hidden.
 */
export const Clock = ({ className = '' }: { className?: string }) => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: number | undefined;

    const tick = () => {
      setNow(new Date());
      // Re-align to the next full second so the display does not drift.
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    const stop = () => window.clearTimeout(timer);
    const onVisibility = () => {
      stop();
      if (!document.hidden) tick();
    };

    tick();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <time
      dateTime={now?.toISOString()}
      className={`font-mono text-xs sm:text-sm tabular-nums text-neutral-400 ${className}`}
      title="Your local time"
    >
      <span className="text-neutral-500">[</span>
      <span className="text-neutral-300">{now ? formatter.format(now) : PLACEHOLDER}</span>
      <span className="text-neutral-500">]</span>
    </time>
  );
};

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  duration?: number; // ms, default 900
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a number counting up (or down) from its previous value
 * to the new `value` whenever `value` changes. Drop this in place
 * of a raw number in JSX, e.g.:
 *
 *   <h3><CountUp value={dashboardRecord?.totalOrders ?? 0} /></h3>
 */
export default function CountUp({
  value,
  duration = 900,
  prefix = '',
  suffix = '',
  decimals = 0,
}: Readonly<CountUpProps>) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = Number(value) || 0;

    if (from === to) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formatted = display.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className="count-up">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
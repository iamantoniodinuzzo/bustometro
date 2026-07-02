import { useState, useEffect, useRef } from 'react';

export const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(target);
  const previousRef = useRef(target);

  useEffect(() => {
    const start = previousRef.current;
    const startTime = performance.now();
    let raf;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setCount(current);
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        previousRef.current = target;
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
};

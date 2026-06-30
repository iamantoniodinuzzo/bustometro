import { useEffect } from 'react';
import { mapParentela } from '../utils/mapParentela';

// Incremento stats anonimo — una sola volta per sessione, debounce 2s
export const useStatsSubmit = (isComplete, parentela, arrotondato) => {
  useEffect(() => {
    if (!isComplete) return;
    const timer = setTimeout(() => {
      if (sessionStorage.getItem('bm_stat_sent')) return;
      sessionStorage.setItem('bm_stat_sent', '1');
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: mapParentela(parentela), amount: arrotondato }),
      }).catch(() => { /* silenzioso */ });
    }, 2000);
    return () => clearTimeout(timer);
  }, [isComplete, parentela, arrotondato]);
};

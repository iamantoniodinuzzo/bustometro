import { useState, useEffect, useMemo } from 'react';
import { useCountUp } from './useCountUp';

export const useCalcolo = ({ parentela, adulti, bambini, costoCoperto, figura, testimone }) => {
  const [sweepKey, setSweepKey] = useState(0);

  const isComplete = parentela !== null && figura !== null;
  const calcolo = isComplete ? (bambini / 2 + adulti) * (costoCoperto * 1.3) * parentela * figura * (testimone ? 1.3 : 1) : 0;
  const arrotondato = Math.round(calcolo / 10) * 10;
  const rangeMin = Math.round((arrotondato * 0.9) / 10) * 10;
  const rangeMax = Math.round((arrotondato * 1.1) / 10) * 10;
  const displayedAmount = useCountUp(isComplete ? arrotondato : 0, 1100);

  // Bump sweepKey dopo il count-up: fa rimontare l'overlay gold sweep
  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(() => setSweepKey((k) => k + 1), 1150);
    return () => clearTimeout(t);
  }, [isComplete, arrotondato]);

  const easterEggMessage = useMemo(() => {
    if (!isComplete) return null;
    if (parentela === 2.0 && figura === 1.5 && adulti >= 3)
      return 'Gli sposi ti vogliono come padrino di battesimo del primo figlio.';
    if (arrotondato > 800)
      return 'A questo punto compragli anche la casa.';
    if (parentela === 1.0 && figura === 1.0 && adulti === 1 && bambini === 0 && costoCoperto <= 50)
      return 'Vabbè dai, almeno gli auguri sinceri 💀';
    return null;
  }, [isComplete, parentela, figura, adulti, bambini, costoCoperto, arrotondato]);

  return { isComplete, calcolo, arrotondato, rangeMin, rangeMax, displayedAmount, sweepKey, easterEggMessage };
};

import { useState } from 'react';

export const useBusyGuard = () => {
  const [busyCard, setBusyCard] = useState(false);

  const withBusy = async (fn) => {
    if (busyCard) return;
    setBusyCard(true);
    try { await fn(); } finally { setBusyCard(false); }
  };

  return { busyCard, withBusy };
};

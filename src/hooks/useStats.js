import { useState, useEffect } from 'react';

export const useStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.available) setStats(data);
      })
      .catch(() => { /* degradation: stats resta null */ });
  }, []);

  return stats;
};

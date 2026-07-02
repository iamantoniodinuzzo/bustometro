import { useState } from 'react';

export const useShareUrl = ({ parentela, adulti, bambini, costoCoperto, figura, regione, testimone, suocera, showToast }) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const buildShareUrl = () => {
    const obj = { p: parentela, i: adulti, b: bambini, c: costoCoperto, d: figura, r: regione };
    if (testimone) obj.t = '1';
    if (suocera) obj.s = '1';
    const params = new URLSearchParams(obj);
    return `${window.location.origin}${window.location.pathname}?${params}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      showToast('Copia link non supportata');
    }
  };

  return { buildShareUrl, copyLink, linkCopied };
};

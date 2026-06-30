import { useState } from 'react';
import { generateCard } from '../utils/generateCard';

export const useCardActions = ({ nomineSposi, arrotondato, rangeMin, rangeMax, testimone, suocera, buildShareUrl, showToast }) => {
  const [cardCopied, setCardCopied] = useState(false);

  const buildCard = (format) => generateCard({ format, nomineSposi, arrotondato, rangeMin, rangeMax, testimone, suocera });

  const downloadCard = async (format) => {
    const canvas = await buildCard(format);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bustometro-${format}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Immagine scaricata ✓');
    }, 'image/png');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`💌 Bustometro dice €${arrotondato} in busta!\n${buildShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('Aperto WhatsApp');
  };

  const copyCard = async (format) => {
    try {
      const canvas = await buildCard(format);
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCardCopied(true);
          setTimeout(() => setCardCopied(false), 2000);
        } catch {
          showToast('Copia immagine non supportata');
        }
      }, 'image/png');
    } catch { /* ignora */ }
  };

  const nativeShare = async (format) => {
    try {
      const canvas = await buildCard(format);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `bustometro-${format}.png`, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Bustometro', text: `La mia busta: €${arrotondato} 💌` });
        }
      }, 'image/png');
    } catch { showToast('Condivisione annullata'); }
  };

  return { downloadCard, copyCard, shareWhatsApp, nativeShare, cardCopied };
};

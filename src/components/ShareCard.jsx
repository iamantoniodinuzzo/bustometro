import React from 'react';
import { RefreshCw } from 'lucide-react';
import { THEME as c } from '../constants';

export const ShareCard = ({
  nomineSposi, setNomineSposi,
  cardFormat, setCardFormat,
  busyCard, withBusy,
  downloadCard, shareWhatsApp, copyCard, nativeShare,
  cardCopied,
}) => (
  <section style={{ marginBottom: '40px', padding: '24px', borderRadius: '8px', backgroundColor: c.card, border: `1px solid ${c.border}` }}>
    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: c.inkSoft, marginBottom: '16px' }}>
      Condividi risultato
    </div>
    <input
      type="text"
      placeholder="Nome sposi (es. Marco & Giulia)"
      value={nomineSposi}
      onChange={(e) => setNomineSposi(e.target.value)}
      maxLength={50}
      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: `1px solid ${c.border}`, background: c.bg, color: c.ink, fontSize: '13px', fontFamily: 'inherit', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }}
    />
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
      {['story', 'post'].map(f => (
        <button key={f} onClick={() => setCardFormat(f)} style={{ flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', border: `1px solid ${cardFormat === f ? c.burgundy : c.border}`, backgroundColor: cardFormat === f ? c.burgundy : 'transparent', color: cardFormat === f ? '#FFFCF5' : c.inkSoft, cursor: 'pointer', transition: 'all .2s' }}>
          {f === 'story' ? '📱 Story 9:16' : '⬛ Post 1:1'}
        </button>
      ))}
    </div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <button onClick={() => withBusy(() => downloadCard(cardFormat))} disabled={busyCard} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${c.border}`, color: c.ink, background: c.bg, cursor: busyCard ? 'not-allowed' : 'pointer', opacity: busyCard ? 0.6 : 1 }}>
        {busyCard ? <RefreshCw size={12} className="spin-icon" /> : '⬇'} Scarica
      </button>
      <button onClick={shareWhatsApp} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${c.border}`, color: c.ink, background: c.bg, cursor: 'pointer' }}>
        💬 WhatsApp
      </button>
      <button onClick={() => withBusy(() => copyCard(cardFormat))} disabled={busyCard} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${cardCopied ? c.gold : c.border}`, color: cardCopied ? c.gold : c.ink, background: cardCopied ? 'rgba(184,146,79,0.1)' : c.bg, cursor: busyCard ? 'not-allowed' : 'pointer', opacity: busyCard ? 0.6 : 1, transition: 'all .2s' }}>
        {busyCard ? <><RefreshCw size={12} className="spin-icon" /> Copia immagine</> : cardCopied ? '✓ Copiata!' : '📋 Copia immagine'}
      </button>
      {typeof navigator !== 'undefined' && navigator.share && (
        <button onClick={() => withBusy(() => nativeShare(cardFormat))} disabled={busyCard} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${c.border}`, color: c.ink, background: c.bg, cursor: busyCard ? 'not-allowed' : 'pointer', opacity: busyCard ? 0.6 : 1 }}>
          {busyCard ? <><RefreshCw size={12} className="spin-icon" /> Condividi</> : '↗ Condividi'}
        </button>
      )}
    </div>
  </section>
);

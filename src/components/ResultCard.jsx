import React from 'react';
import { RefreshCw, Link2, Check } from 'lucide-react';
import { THEME as c } from '../constants';
import { mapParentela } from '../utils/mapParentela';

export const ResultCard = ({
  isComplete, reducedMotion, displayedAmount, sweepKey, rangeMin, rangeMax,
  suocera, easterEggMessage, stats, parentela,
  showBreakdown, setShowBreakdown,
  bambini, adulti, costoCoperto, figura, testimone, calcolo, arrotondato,
  reset, copyLink, linkCopied,
}) => (
  <section style={{ marginBottom: '40px', padding: '32px 24px', borderRadius: '8px', backgroundColor: isComplete ? c.ink : c.bgAlt, color: isComplete ? c.bg : c.inkSoft, border: `1px solid ${isComplete ? c.ink : c.border}`, transition: 'all .5s cubic-bezier(.16,1,.3,1)', position: 'relative', overflow: 'hidden', boxShadow: isComplete ? '0 20px 50px -20px rgba(43,24,16,.4)' : 'none' }}>
    {isComplete && ['tl', 'tr', 'bl', 'br'].map((pos, i) => (
      <div key={pos} style={{ position: 'absolute', top: pos.includes('t') ? 12 : undefined, bottom: pos.includes('b') ? 12 : undefined, left: pos.includes('l') ? 12 : undefined, right: pos.includes('r') ? 12 : undefined, color: c.gold, opacity: 0.6, fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '12px', animation: `fadeUp .5s cubic-bezier(.16,1,.3,1) ${i * 0.1}s both` }}>~</div>
    ))}
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px', color: isComplete ? c.goldSoft : c.inkSoft }}>
        La tua busta
      </div>
      {isComplete ? (
        <>
          <div style={{ position: 'relative', display: 'inline-block', margin: '12px 0' }}>
            <div className="number-display" style={{ fontSize: 'clamp(4rem,18vw,7rem)', lineHeight: 1, color: c.bg, fontWeight: 300 }}>
              €{displayedAmount}
            </div>
            {!reducedMotion && (
              <span
                key={sweepKey}
                className="number-sweep number-display"
                aria-hidden="true"
                style={{ fontSize: 'clamp(4rem,18vw,7rem)', lineHeight: 1, fontWeight: 300, whiteSpace: 'nowrap' }}
              >
                €{displayedAmount}
              </span>
            )}
          </div>
          <div className="display-font" style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '12px', color: c.goldSoft }}>
            range consigliato: €{rangeMin} — €{rangeMax}
          </div>
          {suocera && (
            <div className="reveal-4 display-font" style={{ fontStyle: 'italic', fontSize: '12px', marginBottom: '16px', color: c.gold, opacity: 0.8 }}>
              👁️ Tua suocera sa già quanto hai messo. Lo sa.
            </div>
          )}
          {easterEggMessage && (
            <div className="reveal-5 display-font" style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '16px', padding: '10px 16px', borderRadius: '6px', border: `1px dashed ${c.gold}`, color: c.goldSoft }}>
              {easterEggMessage}
            </div>
          )}
          {stats?.categories?.[mapParentela(parentela)]?.avg != null && (
            <div className="reveal-5" style={{ fontSize: '11px', marginBottom: '16px', color: c.goldSoft, opacity: 0.8 }}>
              Media in questa categoria:{' '}
              <span style={{ color: c.gold }}>€{stats.categories[mapParentela(parentela)].avg}</span>
            </div>
          )}
          <button onClick={() => setShowBreakdown(!showBreakdown)} style={{ fontSize: '11px', textDecoration: 'underline', textUnderlineOffset: '4px', background: 'none', border: 'none', color: c.goldSoft, cursor: 'pointer' }}>
            {showBreakdown ? 'Nascondi calcolo' : 'Vedi come è stato calcolato'}
          </button>
          {showBreakdown && (
            <div className="reveal-1" style={{ marginTop: '20px', paddingTop: '20px', textAlign: 'left', borderTop: `1px solid ${c.inkSoft}`, color: c.bg }}>
              <div className="display-font" style={{ fontStyle: 'italic', fontSize: '12px', marginBottom: '12px', textAlign: 'center', color: c.goldSoft }}>
                € = (B/2 + I) × (C + C×30%) × P × D
              </div>
              {[
                ['Bambini ÷ 2 + Adulti:', `${bambini / 2 + adulti}`],
                ['Coperto × 1,3:', `€${(costoCoperto * 1.3).toFixed(2)}`],
                ['× Parentela:', `×${parentela}`],
                ['× Figura:', `×${figura}`],
                ...(testimone ? [['× Testimone:', '×1.3']] : []),
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'monospace', opacity: 0.9, marginBottom: '6px' }}>
                  <span>{label}</span><span>{val}</span>
                </div>
              ))}
              <div className="display-font" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '8px', borderTop: `1px dashed ${c.inkSoft}` }}>
                <span>Totale grezzo:</span><span>€{calcolo.toFixed(2)}</span>
              </div>
              <div className="display-font" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, color: c.goldSoft, marginTop: '4px' }}>
                <span>Arrotondato:</span><span>€{arrotondato}</span>
              </div>
            </div>
          )}
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', padding: '8px 16px', borderRadius: '999px', border: `1px solid ${c.goldSoft}`, color: c.goldSoft, background: 'transparent', cursor: 'pointer' }}>
              <RefreshCw size={12} /> Ricomincia
            </button>
            <button onClick={copyLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', padding: '8px 16px', borderRadius: '999px', border: `1px solid ${linkCopied ? c.gold : c.goldSoft}`, color: linkCopied ? c.gold : c.goldSoft, background: linkCopied ? 'rgba(184,146,79,0.12)' : 'transparent', cursor: 'pointer', transition: 'all .2s' }}>
              {linkCopied ? <><Check size={12} /> Link copiato!</> : <><Link2 size={12} /> Copia link</>}
            </button>
          </div>
        </>
      ) : (
        <div style={{ padding: '32px 0' }}>
          <div className="display-font" style={{ fontStyle: 'italic', fontSize: '28px', marginBottom: '8px', color: c.inkSoft }}>€ — , —</div>
          <div style={{ fontSize: '11px', color: c.inkSoft }}>Completa i passaggi i. e iii. per scoprire la cifra</div>
        </div>
      )}
    </div>
  </section>
);

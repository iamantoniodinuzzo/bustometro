import React from 'react';
import { VERSION, THEME as c } from '../constants';

export const Header = ({ stats }) => (
  <header style={{ textAlign: 'center', marginBottom: '48px' }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
      <span className="shimmer-text" style={{ color: c.gold, fontSize: '11px', letterSpacing: '0.4em' }}>✦ ✦ ✦</span>
    </div>
    <div className="reveal-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', marginBottom: '8px', backgroundColor: c.bgAlt, color: c.inkSoft, fontSize: '11px', letterSpacing: '0.1em' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.burgundy, display: 'inline-block' }} />
      BUSTOMETRO · v{VERSION}
    </div>
    {/* Riga stat — altezza riservata anche pre-fetch: niente jump */}
    <div className="reveal-1" style={{
      display: 'flex', justifyContent: 'center', marginBottom: '16px',
      minHeight: '18px',
      opacity: stats?.total > 0 ? 1 : 0,
      transition: 'opacity .4s ease',
    }}>
      {stats?.total > 0 && (
        <span style={{ fontSize: '11px', color: c.inkSoft, letterSpacing: '0.08em' }}>
          <span style={{ color: c.gold }}>✦</span>{' '}
          {stats.total.toLocaleString('it-IT')} buste calcolate questo mese
        </span>
      )}
    </div>
    <h1 className="display-font reveal-2" style={{ color: c.ink, fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 400, lineHeight: '0.95', margin: '0 0 12px', fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>
      Quanto metto<br />
      <em style={{ color: c.burgundy, fontStyle: 'italic', fontWeight: 300 }}>in busta?</em>
    </h1>
    <div className="deco-line" style={{ height: '1px', margin: '20px auto', background: `linear-gradient(to right, transparent, ${c.gold}, transparent)` }} />
    <p className="reveal-3" style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6, color: c.inkSoft }}>
      La formula napoletana per non fare brutta figura agli sposi.
      Compilala e scopri la cifra giusta.
    </p>
  </header>
);

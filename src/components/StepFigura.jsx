import React from 'react';
import { figure, THEME as c } from '../constants';

export const StepFigura = ({ figura, setFigura, suocera, setSuocera }) => (
  <section className="reveal-5" style={{ marginBottom: '40px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
      <span className="display-font" style={{ color: c.gold, fontStyle: 'italic', fontSize: '24px' }}>iii.</span>
      <h2 className="display-font" style={{ color: c.ink, fontSize: '22px', margin: 0 }}>Che figura vuoi fare?</h2>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {figure.map((f) => {
        const sel = figura === f.value;
        return (
          <button key={f.value} onClick={() => setFigura(f.value)}
            className={`step-card${sel ? ' stamped' : ''}`}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: sel ? c.burgundy : c.card, border: `1px solid ${sel ? c.burgundy : c.border}`, color: sel ? '#FFFCF5' : c.ink, boxShadow: sel ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>{f.emoji}</span>
            <div style={{ flex: 1 }}>
              <div className="display-font" style={{ fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {f.label}
                <span style={{ fontSize: '11px', fontStyle: 'italic', color: sel ? c.goldSoft : c.gold, fontWeight: 300 }}>{f.subnap}</span>
              </div>
              <div style={{ fontSize: '11px', marginTop: '2px', color: sel ? '#FFFCF5' : c.inkSoft, opacity: 0.85 }}>{f.desc}</div>
            </div>
            <div className="display-font" style={{ fontSize: '13px', color: sel ? c.goldSoft : c.inkSoft }}>×{f.value}</div>
          </button>
        );
      })}
    </div>
    <button onClick={() => setSuocera(!suocera)}
      className={`step-card${suocera ? ' stamped' : ''}`}
      style={{ marginTop: '12px', width: '100%', padding: '14px 16px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: suocera ? c.burgundy : c.card, border: `1px solid ${suocera ? c.burgundy : c.border}`, color: suocera ? '#FFFCF5' : c.ink, boxShadow: suocera ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
      <div>
        <div className="display-font" style={{ fontSize: '14px', fontWeight: 500 }}>Modalità Suocera 👁️</div>
        <div style={{ fontSize: '11px', marginTop: '2px', color: suocera ? c.goldSoft : c.inkSoft }}>Lei lo sa. Sempre.</div>
      </div>
    </button>
  </section>
);

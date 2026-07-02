import React from 'react';
import { parentele, THEME as c } from '../constants';

export const StepParentela = ({ parentela, setParentela, testimone, setTestimone }) => (
  <section className="reveal-3" style={{ marginBottom: '40px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
      <span className="display-font" style={{ color: c.gold, fontStyle: 'italic', fontSize: '24px' }}>i.</span>
      <h2 className="display-font" style={{ color: c.ink, fontSize: '22px', margin: 0 }}>Per chi è la busta?</h2>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
      {parentele.map((p) => {
        const sel = parentela === p.value;
        return (
          <button key={p.value} onClick={() => setParentela(p.value)}
            className={`step-card${sel ? ' stamped' : ''}`}
            style={{ padding: '16px', borderRadius: '8px', textAlign: 'left', backgroundColor: sel ? c.burgundy : c.card, border: `1px solid ${sel ? c.burgundy : c.border}`, color: sel ? '#FFFCF5' : c.ink, boxShadow: sel ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{p.icon}</div>
            <div className="display-font" style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.2 }}>{p.label}</div>
            <div style={{ fontSize: '11px', marginTop: '4px', color: sel ? c.goldSoft : c.inkSoft }}>
              {p.sublabel} · ×{p.value}
            </div>
          </button>
        );
      })}
    </div>
    <button onClick={() => setTestimone(!testimone)}
      className={`step-card${testimone ? ' stamped' : ''}`}
      style={{ marginTop: '12px', width: '100%', padding: '14px 16px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: testimone ? c.burgundy : c.card, border: `1px solid ${testimone ? c.burgundy : c.border}`, color: testimone ? '#FFFCF5' : c.ink, boxShadow: testimone ? '0 6px 18px rgba(122,31,43,.18)' : 'none', cursor: 'pointer' }}>
      <div>
        <div className="display-font" style={{ fontSize: '14px', fontWeight: 500 }}>Testimone 💍</div>
        <div style={{ fontSize: '11px', marginTop: '2px', color: testimone ? c.goldSoft : c.inkSoft }}>Hai detto sì. Anche al portafogli.</div>
      </div>
      <div className="display-font" style={{ fontSize: '13px', color: testimone ? c.goldSoft : c.inkSoft }}>×1.3</div>
    </button>
  </section>
);

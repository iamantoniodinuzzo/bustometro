import React from 'react';
import { Users, Baby, Utensils, Sparkles } from 'lucide-react';
import { regioni, presetCoperto, THEME as c } from '../constants';
import { Stepper } from './Stepper';

export const StepPartecipanti = ({
  regione, selectRegione,
  adulti, setAdulti,
  bambini, setBambini,
  costoCoperto, setCostoCoperto,
}) => (
  <section className="reveal-4" style={{ marginBottom: '40px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
      <span className="display-font" style={{ color: c.gold, fontStyle: 'italic', fontSize: '24px' }}>ii.</span>
      <h2 className="display-font" style={{ color: c.ink, fontSize: '22px', margin: 0 }}>Chi partecipa?</h2>
    </div>

    {/* Selettore regionale */}
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {regioni.map((reg) => {
          const sel = regione === reg.id;
          return (
            <button key={reg.id} className="pill-btn" onClick={() => selectRegione(reg.id)} style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '13px', backgroundColor: sel ? c.gold : 'transparent', color: sel ? c.ink : c.inkSoft, border: `1px solid ${sel ? c.gold : c.border}`, fontWeight: sel ? 600 : 400, cursor: 'pointer', transition: 'all .2s' }}>
              {reg.emoji} {reg.label}
            </button>
          );
        })}
      </div>
      <div className="display-font" style={{ fontSize: '12px', fontStyle: 'italic', color: c.inkSoft }}>
        <Sparkles size={12} style={{ display: 'inline', marginBottom: '-2px', marginRight: '4px', color: c.gold }} />
        <em>Le aspettative variano. Come i cognati.</em>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { icon: <Users size={18} style={{ color: c.burgundy }} />, label: 'Adulti', sub: 'Te incluso', val: adulti, setter: setAdulti, min: 1, max: 10 },
        { icon: <Baby size={18} style={{ color: c.burgundy }} />, label: 'Bambini', sub: 'Contano la metà', val: bambini, setter: setBambini, min: 0, max: 10 },
      ].map((row) => (
        <div key={row.label} style={{ padding: '16px', borderRadius: '8px', backgroundColor: c.card, border: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {row.icon}
              <div>
                <div className="display-font" style={{ fontWeight: 500 }}>{row.label}</div>
                <div style={{ fontSize: '11px', color: c.inkSoft }}>{row.sub}</div>
              </div>
            </div>
            <Stepper value={row.val} onChange={row.setter} min={row.min} max={row.max} />
          </div>
        </div>
      ))}
      <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: c.card, border: `1px solid ${c.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Utensils size={18} style={{ color: c.burgundy }} />
            <div>
              <div className="display-font" style={{ fontWeight: 500 }}>Costo coperto</div>
              <div style={{ fontSize: '11px', color: c.inkSoft }}>Stima a persona</div>
            </div>
          </div>
          <div className="display-font" style={{ fontSize: '24px', color: c.ink }}>€{costoCoperto}</div>
        </div>
        <input type="range" min="30" max="200" step="5" value={costoCoperto} onChange={(e) => setCostoCoperto(Number(e.target.value))} style={{ width: '100%', marginBottom: '12px', accentColor: c.burgundy }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {presetCoperto.map((p) => {
            const sel = costoCoperto === p;
            return (
              <button key={p} className="pill-btn" onClick={() => setCostoCoperto(p)} style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', backgroundColor: sel ? c.gold : 'transparent', color: sel ? c.ink : c.inkSoft, border: `1px solid ${sel ? c.gold : c.border}`, fontWeight: sel ? 500 : 400, cursor: 'pointer', transition: 'all .2s' }}>
                €{p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

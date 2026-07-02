import React from 'react';
import { BookOpen, Code2, Crown, ExternalLink } from 'lucide-react';
import { VERSION, THEME as c } from '../constants';

export const CreditsFooter = ({ showCredits, setShowCredits }) => (
  <footer style={{ borderTop: `1px solid ${c.border}`, paddingTop: '24px' }}>
    <button onClick={() => setShowCredits(!showCredits)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', marginBottom: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={14} style={{ color: c.burgundy }} />
        <span className="display-font" style={{ fontSize: '14px', fontWeight: 500, color: c.ink }}>Crediti e fonti</span>
      </div>
      <span style={{ fontSize: '12px', color: c.inkSoft }}>{showCredits ? '−' : '+'}</span>
    </button>

    {showCredits && (
      <div className="reveal-1" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px', color: c.inkSoft }}>
        {/* Developer */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Code2 size={14} style={{ color: c.gold }} />
            <span className="display-font" style={{ fontWeight: 500, color: c.ink }}>Sviluppatore</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '6px', backgroundColor: c.bgAlt }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: c.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#FFFCF5', fontSize: '14px', fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>I</span>
            </div>
            <div>
              <div className="display-font" style={{ fontWeight: 600, color: c.ink }}>Indisparte</div>
            </div>
          </div>
        </div>

        {/* Formula author */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Crown size={14} style={{ color: c.gold }} />
            <span className="display-font" style={{ fontWeight: 500, color: c.ink }}>Inventore della formula</span>
          </div>
          <p style={{ lineHeight: 1.6, paddingLeft: '24px', margin: 0 }}>
            Formula ideata da <strong style={{ color: c.burgundy }}>Amedeo Colella</strong>, scrittore e docente di napoletanità presso la fondazione Humaniter. Pubblicata a <em>pagina 145</em> del <em>Manuale di filosofia napoletana</em> (Cultura Nova editore).
          </p>
        </div>

        {/* Formula */}
        <div>
          <div className="display-font" style={{ fontWeight: 500, marginBottom: '8px', color: c.ink }}>La formula originale</div>
          <div style={{ padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', backgroundColor: c.bgAlt, color: c.ink }}>
            € = (B/2 + I) × (C + C×30%) × P × D
          </div>
          <p style={{ fontSize: '11px', marginTop: '8px', lineHeight: 1.6 }}>
            Nell'originale napoletano, D si chiama <em>"squarciunaria"</em>: Squarcione (1,5), Ngannaruto (1,3), «Amma fa' 'na bella figura» (1,2), Normale (1,0).
          </p>
        </div>

        {/* References */}
        <div>
          <div className="display-font" style={{ fontWeight: 500, marginBottom: '8px', color: c.ink }}>Riferimenti</div>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              ['https://www.restoalsud.it/primo-piano/quanto-mettere-nella-busta-del-matrimonio-lo-svela-una-formula-matematica-napoletana/', 'Resto al Sud · La formula matematica napoletana'],
              ['https://www.sfilate.it/376460/sposi-non-sai-quanto-mettere-nella-busta-il-calcolo-esatto-per-evitare-figuracce/', 'Sfilate · Il calcolo esatto'],
              ['https://www.trend-online.com/lusso/matrimonio-quanto-regalare-soldi-busta/', 'Trend Online · Quanto regalare al matrimonio'],
            ].map(([href, label]) => (
              <li key={href} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px' }}>
                <ExternalLink size={11} style={{ marginTop: '2px', flexShrink: 0, color: c.gold }} />
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: c.burgundy, textDecoration: 'none' }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Changelog */}
        <div>
          <div className="display-font" style={{ fontWeight: 500, marginBottom: '8px', color: c.ink }}>Changelog</div>
          <div style={{ fontSize: '11px', lineHeight: 1.9, paddingLeft: '8px' }}>
            <div><strong style={{ color: c.burgundy }}>v1.7.0</strong> — Gold sweep reveal, micro-feedback sui controlli, toast, focus a11y</div>
            <div style={{ opacity: 0.6 }}><strong>v1.3.1</strong> — Busta 3D Three.js, polvere d'oro, coriandoli, count-up, micro-animazioni</div>
            <div style={{ opacity: 0.6 }}><strong>v1.0.0</strong> — Versione iniziale</div>
          </div>
        </div>
      </div>
    )}

    <div style={{ textAlign: 'center', paddingTop: '16px', marginTop: '8px', fontSize: '11px', color: c.inkSoft, borderTop: `1px dashed ${c.border}` }}>
      <div className="display-font" style={{ fontStyle: 'italic' }}>
        Bustometro <span style={{ color: c.gold }}>·</span> v{VERSION}
      </div>
      <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>
        Formula © Amedeo Colella · Sviluppato da Indisparte
      </div>
    </div>
  </footer>
);

import React from 'react';
import { THEME as c } from '../constants';

export const Stepper = ({ value, onChange, min, max }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <button className="stepper-btn" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: c.bgAlt, color: c.ink, border: `1px solid ${c.border}`, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: value <= min ? 0.35 : 1, cursor: value <= min ? 'default' : 'pointer', transition: 'opacity .15s, transform .1s' }}>−</button>
    <span className="display-font" style={{ fontSize: '24px', width: '32px', textAlign: 'center', color: c.ink, display: 'inline-block' }}>{value}</span>
    <button className="stepper-btn" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: c.bgAlt, color: c.ink, border: `1px solid ${c.border}`, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: value >= max ? 0.35 : 1, cursor: value >= max ? 'default' : 'pointer', transition: 'opacity .15s, transform .1s' }}>+</button>
  </div>
);

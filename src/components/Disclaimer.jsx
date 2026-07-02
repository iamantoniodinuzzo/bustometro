import React from 'react';
import { Sparkles } from 'lucide-react';
import { THEME as c } from '../constants';

export const Disclaimer = () => (
  <div style={{ textAlign: 'center', marginBottom: '32px', fontSize: '12px', fontStyle: 'italic', padding: '0 16px', color: c.inkSoft }}>
    <Sparkles size={14} style={{ display: 'inline', marginBottom: '-2px', marginRight: '4px', color: c.gold }} />
    La formula è ironica per natura. Il risultato è un'ottima guida, ma alla fine il vero metro è l'affetto.{' '}
    <em>E quanto puoi permetterti.</em>
  </div>
);

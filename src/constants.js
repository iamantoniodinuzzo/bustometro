export const VERSION = '1.7.0';

export const parentele = [
  { value: 2.0, label: 'Genitore', sublabel: 'Mamma o papà', icon: '👨‍👩‍👧' },
  { value: 1.5, label: 'Fratello / Sorella', sublabel: 'Stesso sangue', icon: '🫂' },
  { value: 1.2, label: 'Cugino', sublabel: 'Famiglia allargata', icon: '🌿' },
  { value: 1.0, label: 'Amico', sublabel: 'O collega', icon: '🤝' },
];

export const figure = [
  { value: 1.5, label: 'Massimo', subnap: '«Squarcione»', emoji: '😎', desc: 'Spendere senza pensieri' },
  { value: 1.3, label: 'Medio', subnap: '«Ngannaruto»', emoji: '🙂', desc: 'Generoso ma con misura' },
  { value: 1.2, label: 'Sufficiente', subnap: '«Bella figura»', emoji: '🤏', desc: 'Dignitoso, niente di più' },
  { value: 1.0, label: 'Normale', subnap: '«Standard»', emoji: '😐', desc: 'Né troppo né troppo poco' },
];

export const regioni = [
  { id: 'nord',   label: 'Nord',   emoji: '🏔️', coperto: 70, figura: 1.0  },
  { id: 'centro', label: 'Centro', emoji: '🏛️', coperto: 80, figura: null },
  { id: 'sud',    label: 'Sud',    emoji: '🌋', coperto: 90, figura: 1.2  },
];

export const presetCoperto = [50, 80, 120, 160];

export const THEME = {
  bg: '#F5EFE4', bgAlt: '#EBE3D2', card: '#FBF8F1',
  ink: '#2B1810', inkSoft: '#6B5B4F',
  burgundy: '#7A1F2B', gold: '#B8924F', goldSoft: '#D4B584', goldFocus: '#9A7634',
  border: '#D8CDB8',
};

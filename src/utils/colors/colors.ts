import type { HeaderColor } from './colors.types';

export const colorPalette: {
  color: HeaderColor;
  gradient: string;
  label: string;
}[] = [
  { color: 'none', gradient: 'none', label: 'None' },
  {
    color: 'aurora',
    gradient: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)',
    label: 'Aurora',
  },
  {
    color: 'sunset',
    gradient: 'linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)',
    label: 'Sunset',
  },
  {
    color: 'ocean',
    gradient: 'linear-gradient(135deg, #7dd3fc 0%, #67e8f9 100%)',
    label: 'Ocean',
  },
  {
    color: 'forest',
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #86efac 100%)',
    label: 'Forest',
  },
  {
    color: 'midnight',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    label: 'Midnight',
  },
  {
    color: 'rose',
    gradient: 'linear-gradient(135deg, #fecdd3 0%, #f9a8d4 100%)',
    label: 'Rose',
  },
  {
    color: 'golden',
    gradient: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
    label: 'Golden',
  },
  {
    color: 'cosmic',
    gradient: 'linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 100%)',
    label: 'Cosmic',
  },
  {
    color: 'ember',
    gradient: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
    label: 'Ember',
  },
  {
    color: 'dusk',
    gradient: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
    label: 'Dusk',
  },
  {
    color: 'arctic',
    gradient: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)',
    label: 'Arctic',
  },
  {
    color: 'spring',
    gradient: 'linear-gradient(135deg, #bef264 0%, #d9f99d 100%)',
    label: 'Spring',
  },
  {
    color: 'candy',
    gradient: 'linear-gradient(135deg, #f5d0fe 0%, #e9d5ff 100%)',
    label: 'Candy',
  },
  {
    color: 'neon',
    gradient: 'linear-gradient(135deg, #67e8f9 0%, #c084fc 100%)',
    label: 'Neon',
  },
  {
    color: 'borealis',
    gradient: 'linear-gradient(135deg, #86efac 0%, #5eead4 100%)',
    label: 'Borealis',
  },
  {
    color: 'royal',
    gradient: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    label: 'Royal',
  },
  {
    color: 'grape',
    gradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
    label: 'Grape',
  },
  {
    color: 'kyoto',
    gradient: 'linear-gradient(135deg, #fecaca 0%, #fef08a 100%)',
    label: 'Kyoto',
  },
  {
    color: 'aqua',
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #a5f3fc 100%)',
    label: 'Aqua',
  },
  {
    color: 'mauve',
    gradient: 'linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%)',
    label: 'Mauve',
  },
  {
    color: 'shore',
    gradient: 'linear-gradient(135deg, #bae6fd 0%, #fef3c7 100%)',
    label: 'Shore',
  },
  {
    color: 'peach',
    gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    label: 'Peach',
  },
  {
    color: 'indigo',
    gradient: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)',
    label: 'Indigo',
  },
  {
    color: 'nebula',
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%)',
    label: 'Nebula',
  },
  {
    color: 'mint',
    gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    label: 'Mint',
  },
  {
    color: 'blood',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    label: 'Blood',
  },
  {
    color: 'silver',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    label: 'Silver',
  },
  {
    color: 'obsidian',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    label: 'Obsidian',
  },
  // Solid pastel colors
  {
    color: 'pastel_pink',
    gradient: '#fecdd3',
    label: 'Pastel Pink',
  },
  {
    color: 'pastel_rose',
    gradient: '#fda4af',
    label: 'Pastel Rose',
  },
  {
    color: 'pastel_coral',
    gradient: '#fca5a5',
    label: 'Pastel Coral',
  },
  {
    color: 'pastel_peach',
    gradient: '#ffedd5',
    label: 'Pastel Peach',
  },
  {
    color: 'pastel_orange',
    gradient: '#fed7aa',
    label: 'Pastel Orange',
  },
  {
    color: 'pastel_yellow',
    gradient: '#fef08a',
    label: 'Pastel Yellow',
  },
  {
    color: 'pastel_lime',
    gradient: '#bef264',
    label: 'Pastel Lime',
  },
  {
    color: 'pastel_green',
    gradient: '#86efac',
    label: 'Pastel Green',
  },
  {
    color: 'pastel_mint',
    gradient: '#99f6e4',
    label: 'Pastel Mint',
  },
  {
    color: 'pastel_teal',
    gradient: '#5eead4',
    label: 'Pastel Teal',
  },
  {
    color: 'pastel_cyan',
    gradient: '#67e8f9',
    label: 'Pastel Cyan',
  },
  {
    color: 'pastel_sky',
    gradient: '#7dd3fc',
    label: 'Pastel Sky',
  },
  {
    color: 'pastel_blue',
    gradient: '#a5b4fc',
    label: 'Pastel Blue',
  },
  {
    color: 'pastel_indigo',
    gradient: '#c7d2fe',
    label: 'Pastel Indigo',
  },
  {
    color: 'pastel_violet',
    gradient: '#c4b5fd',
    label: 'Pastel Violet',
  },
  {
    color: 'pastel_purple',
    gradient: '#d8b4fe',
    label: 'Pastel Purple',
  },
  {
    color: 'pastel_magenta',
    gradient: '#f5d0fe',
    label: 'Pastel Magenta',
  },
  {
    color: 'pastel_lavender',
    gradient: '#e9d5ff',
    label: 'Pastel Lavender',
  },
  {
    color: 'pastel_gray',
    gradient: '#e2e8f0',
    label: 'Pastel Gray',
  },
  {
    color: 'pastel_slate',
    gradient: '#cbd5e1',
    label: 'Pastel Slate',
  },
  {
    color: 'pastel_matcha',
    gradient: '#d9f99d',
    label: 'Pastel Matcha',
  },
  {
    color: 'pastel_creme',
    gradient: '#fef9c3',
    label: 'Pastel Crème',
  },
  {
    color: 'pastel_almond',
    gradient: '#ede0d4',
    label: 'Pastel Almond',
  },
  {
    color: 'pastel_sage',
    gradient: '#c2d6c4',
    label: 'Pastel Sage',
  },
  {
    color: 'pastel_sand',
    gradient: '#e8dcb8',
    label: 'Pastel Sand',
  },
  {
    color: 'pastel_ice',
    gradient: '#e0f2fe',
    label: 'Pastel Ice',
  },

  // Sólidos / Solid vibrant colors (compatible con Dark y Light mode)
  {
    color: 'solid_blue',
    gradient: '#0284c7',
    label: 'Azul Océano',
  },
  {
    color: 'solid_navy',
    gradient: '#1d4ed8',
    label: 'Azul Marino',
  },
  {
    color: 'solid_indigo',
    gradient: '#4338ca',
    label: 'Índigo Real',
  },
  {
    color: 'solid_purple',
    gradient: '#7e22ce',
    label: 'Púrpura Imperial',
  },
  {
    color: 'solid_plum',
    gradient: '#581c87',
    label: 'Ciruela',
  },
  {
    color: 'solid_ruby',
    gradient: '#e11d48',
    label: 'Rubí',
  },
  {
    color: 'solid_crimson',
    gradient: '#be185d',
    label: 'Frambuesa',
  },
  {
    color: 'solid_amber',
    gradient: '#d97706',
    label: 'Ámbar Cálido',
  },
  {
    color: 'solid_emerald',
    gradient: '#059669',
    label: 'Esmeralda',
  },
  {
    color: 'solid_forest',
    gradient: '#15803d',
    label: 'Verde Bosque',
  },
  {
    color: 'solid_teal',
    gradient: '#0f766e',
    label: 'Cerceta / Teal',
  },
  {
    color: 'solid_cyan',
    gradient: '#0891b2',
    label: 'Cian',
  },
  {
    color: 'solid_terracotta',
    gradient: '#c2410c',
    label: 'Terracota Intenso',
  },
  {
    color: 'solid_charcoal',
    gradient: '#1e293b',
    label: 'Carbón',
  },
  {
    color: 'solid_slate',
    gradient: '#334155',
    label: 'Grafito',
  },
  {
    color: 'solid_wine',
    gradient: '#9f1239',
    label: 'Borgoña / Vino',
  },
  {
    color: 'solid_coffee',
    gradient: '#78350f',
    label: 'Café / Cuero',
  },
];

/**
 * Calculates whether a color or gradient is dark to guarantee high-contrast text readability
 */
export const isColorDark = (colorStr?: string | null): boolean => {
  if (!colorStr) return false;
  const c = colorStr.trim().toLowerCase();
  if (['none', 'transparent'].includes(c)) return false;

  // Known dark presets
  if (['midnight', 'obsidian', 'royal', 'blood'].includes(c)) return true;
  if (
    [
      'solid_navy',
      'solid_indigo',
      'solid_purple',
      'solid_plum',
      'solid_ruby',
      'solid_crimson',
      'solid_forest',
      'solid_teal',
      'solid_charcoal',
      'solid_slate',
      'solid_wine',
      'solid_coffee',
      'solid_blue',
      'solid_terracotta',
      'solid_amber',
    ].includes(c)
  ) {
    return true;
  }

  // If hex code is found anywhere
  const hexMatch = c.match(/#([0-9a-f]{3,8})/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((x) => x + x)
        .join('');
    }
    const r = parseInt(hex.slice(0, 2), 16) || 0;
    const g = parseInt(hex.slice(2, 4), 16) || 0;
    const b = parseInt(hex.slice(4, 6), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 145;
  }

  return false;
};

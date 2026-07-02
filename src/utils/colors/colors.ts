export type HeaderColor =
  | 'aurora'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'midnight'
  | 'rose'
  | 'golden'
  | 'cosmic'
  | 'ember'
  | 'dusk'
  | 'arctic'
  | 'spring'
  | 'candy'
  | 'neon'
  | 'borealis'
  | 'royal'
  | 'grape'
  | 'kyoto'
  | 'aqua'
  | 'mauve'
  | 'shore'
  | 'peach'
  | 'indigo'
  | 'nebula'
  | 'mint'
  | 'blood'
  | 'silver'
  | 'obsidian'
  | 'pastel_pink'
  | 'pastel_rose'
  | 'pastel_coral'
  | 'pastel_peach'
  | 'pastel_orange'
  | 'pastel_yellow'
  | 'pastel_lime'
  | 'pastel_green'
  | 'pastel_mint'
  | 'pastel_teal'
  | 'pastel_cyan'
  | 'pastel_sky'
  | 'pastel_blue'
  | 'pastel_indigo'
  | 'pastel_violet'
  | 'pastel_purple'
  | 'pastel_magenta'
  | 'pastel_lavender'
  | 'pastel_gray'
  | 'pastel_slate'
  | 'none';

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
];

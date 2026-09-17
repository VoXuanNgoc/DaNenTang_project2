export const colors = {
  // Primary Palette - Modern University Purple
  primary: '#6C4AB6',
  primaryDark: '#49317D',
  primaryLight: '#F1ECFA',
  primarySubtle: '#F7F4FD',

  // Accent
  accent: '#F6C945', // Highlight yellow for accents and attention
  accentLight: '#FEF9E7',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F7FC',
  card: '#FFFFFF',
  border: '#E8E3F0',
  divider: '#F1ECFA',

  // Typography
  text: '#25213A',
  secondaryText: '#77728A',
  textMuted: '#A09BB0',

  // Status Indicators
  available: '#27AE60',
  availableBg: '#EAF7EE',
  availableBorder: '#BDE7CC',

  occupied: '#E65B5B',
  occupiedBg: '#FDF0F0',
  occupiedBorder: '#F9D1D1',

  confirmed: '#6C4AB6',
  confirmedBg: '#F1ECFA',
  confirmedBorder: '#D8CEEF',

  cancelled: '#77728A',
  cancelledBg: '#F0EFF5',
  cancelledBorder: '#DDD9E8',

  overlay: 'rgba(37, 33, 58, 0.45)',
} as const;

export type ColorKey = keyof typeof colors;

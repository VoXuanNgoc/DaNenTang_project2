export const colors = {
  // Primary brand palette
  primary: '#2563EB', // Vibrant royal blue
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primarySubtle: '#EFF6FF',

  // Status colors
  available: '#10B981', // Emerald green
  availableBg: '#ECFDF5',
  availableBorder: '#A7F3D0',

  occupied: '#EF4444', // Coral red
  occupiedBg: '#FEF2F2',
  occupiedBorder: '#FECACA',

  confirmed: '#2563EB',
  confirmedBg: '#EFF6FF',
  confirmedBorder: '#BFDBFE',

  cancelled: '#64748B', // Muted slate gray
  cancelledBg: '#F1F5F9',
  cancelledBorder: '#CBD5E1',

  // Neutral tones
  background: '#F8FAFC', // Ultra clean soft background
  card: '#FFFFFF',
  text: '#0F172A', // Deep slate for high contrast
  textSecondary: '#64748B', // Subtitle text
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  divider: '#F1F5F9',

  // Accents
  accent: '#F59E0B',
  accentSubtle: '#FFFBEB',
  surfaceHighlight: '#F8FAFC',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

export type ColorKey = keyof typeof colors;

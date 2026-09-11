/**
 * OKNEXUS Standardized Design Tokens & Color Palette
 * Source of Truth: OKNexus Dark + Light Mode Specification
 */

export const OKNEXUS_BRAND = {
  primaryPurple: '#8B5CF6',
  magenta: '#EC4899',
  gold: '#F59E0B',
  cyan: '#06B6D4',
  brandGradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  accentGradient: 'linear-gradient(135deg, #F59E0B 0%, #06B6D4 100%)',
} as const;

export const OKNEXUS_STATUS = {
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

export const OKNEXUS_DARK = {
  bg: '#0A0E13',
  surface: '#0E141B',
  surfaceElevated: '#141B24',
  surface2: '#1A222D',
  surfaceHover: '#202A37',
  border: '#242E3B',
  borderSoft: '#1A222C',
  textPrimary: '#EDF1F5',
  textSecondary: '#8E98A6',
  textMuted: '#586572',
  textFaint: '#3A4553',
  chart: {
    bullish: '#2FBD8E',
    bearish: '#F1667A',
    grid: '#1A222C',
    crosshair: '#3A4553',
    volume: '#4FA3E3',
  },
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
    md: '0 8px 24px rgba(0, 0, 0, 0.5)',
    glow: '0 0 16px rgba(139, 92, 246, 0.3)',
  },
} as const;

export const OKNEXUS_LIGHT = {
  bg: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#F1F5F9',
  surface2: '#E9EEF5',
  surfaceHover: '#DEE6F2',
  border: '#D7E0EB',
  borderSoft: '#E4ECF7',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textFaint: '#94A3B8',
  chart: {
    bullish: '#10B981',
    bearish: '#EF4444',
    grid: '#E5E7EB',
    crosshair: '#CBD5E1',
    volume: '#3B82F6',
  },
  shadow: {
    sm: '0 2px 8px rgba(15, 23, 42, 0.08)',
    md: '0 8px 24px rgba(15, 23, 42, 0.12)',
    glow: '0 0 16px rgba(139, 92, 246, 0.12)',
  },
} as const;

export function getThemeTokens(isDark: boolean) {
  return isDark ? OKNEXUS_DARK : OKNEXUS_LIGHT;
}

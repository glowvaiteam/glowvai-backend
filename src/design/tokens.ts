/**
 * GlowVAI V2 Design Tokens & Theme Definition
 * 
 * Aesthetic: Premium dark modern skincare e-commerce
 * Palette: Slate, Deep Midnight, Cyan Glow, Rose Gold, Emerald Green
 */

export const colors = {
  // Backgrounds
  background: {
    primary: '#060B18',      // Deepest midnight obsidian
    secondary: '#0F172A',    // Deep slate blue
    tertiary: '#131D33',     // Elevated card background
    elevated: '#1E293B',     // Popover / modal background
    glass: 'rgba(19, 29, 51, 0.85)',
  },
  
  // Brand Accents
  brand: {
    primary: '#38BDF8',      // Radiant Cyan Glow
    primaryDark: '#1D4ED8',  // Deep Royal Blue
    primaryLight: '#BAE6FD',
    secondary: '#F43F5E',    // Rose Glow (Beauty / Vitality)
    secondaryLight: '#FECDD3',
    accent: '#818CF8',       // Indigo / AI Diagnostic violet
  },

  // Text & Typography
  text: {
    primary: '#F8FAFC',      // Pure white slate
    secondary: '#94A3B8',    // Muted slate gray
    tertiary: '#64748B',     // Low emphasis
    inverse: '#060B18',      // Dark on light
    accent: '#38BDF8',
  },

  // Status & Feedback
  status: {
    success: '#10B981',      // Emerald Green
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',      // Amber
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',        // Crimson Red
    errorBg: 'rgba(239, 68, 68, 0.15)',
    info: '#38BDF8',
    infoBg: 'rgba(56, 189, 248, 0.15)',
  },

  // Borders & Dividers
  border: {
    subtle: '#1E293B',
    default: '#334155',
    focus: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  giant: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 30,
    hero: 34,
    splash: 52,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
};

export const shadows = {
  glowPrimary: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
};

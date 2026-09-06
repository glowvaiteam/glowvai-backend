/**
 * Blinkit/Zepto Style Clean Quick-Commerce Design Tokens
 * Focus: High-contrast, clean, 2-3 primary brand colors, content-first, zero rainbow gradients.
 */

export const colors = {
  // Brand
  primary: '#00C853',        // Blinkit Emerald Green
  primaryDark: '#009624',    // Deep Emerald
  primaryLight: '#E8F5E9',   // Light Mint Pill Background
  secondary: '#111827',      // Carbon Slate / Black
  secondaryLight: '#1F2937',

  // Surfaces & Backgrounds
  background: '#FFFFFF',     // Clean White
  surface: '#F8FAFC',        // Subdued Slate Gray
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',         // Clean subtle border
  borderFocus: '#00C853',

  // Typography
  text: '#111827',           // Pure Dark text
  textSecondary: '#64748B',  // Subtitle / Muted text
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // System Status
  success: '#00C853',
  successBg: '#E8F5E9',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  info: '#0284C7',
  infoBg: '#E0F2FE',
};

export const typography = {
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  h1: { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 16, fontWeight: '700' as const, letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.2 },
  badge: { fontSize: 10, fontWeight: '800' as const, letterSpacing: 0.5 },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};
